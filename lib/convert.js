/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Mark van Seventer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Strict mode.
'use strict'

// Standard lib.
const fs = require('fs')
const path = require('path')

// Package modules.
const bubbleError = require('bubble-stream-error')
const glob = require('glob')
const isDirectory = require('is-directory')
const rw = require('rw-stream')
const sharp = require('sharp')

// Local modules.
const queue = require('./queue')

// Configure.
const EXTENSIONS = {
  dz: '', // Determined by tile.container.
  jpeg: '.jpg',
  png: '.png',
  tiff: '.tiff',
  webp: '.webp'
}

// Exports.
const convert = module.exports = {
  // Convert a list of files.
  files: (input, output) => {
    // Resolve files.
    const files = input.reduce((list, input) => {
      return list.concat(glob.sync(input, { absolute: true }))
    }, [])

    // Process files.
    const isBatch = files.length > 1
    const promises = files.map((src) => {
      // Create pipeline.
      const transformer = queue.drain(sharp())

      // Process output as a template.
      const parts = path.parse(src)
      const regex = /\{(root|dir|base|ext|name)\}/g
      let dest = output
      let match
      while ((match = regex.exec(output)) !== null) {
        const [search, prop] = match
        dest = dest.replace(search, parts[prop])
      }
      dest = path.resolve(dest)

      // If output was not a template, assume dest is a directory when using
      // batch processing.
      const outputAssumeDir = dest === path.resolve(output) && isBatch
      if (outputAssumeDir || isDirectory.sync(dest)) {
        const defaultExt = path.extname(src)
        const desiredExt = transformer.options.formatOut
        dest = path.format({
          dir: dest,
          name: path.basename(src, defaultExt),
          ext: desiredExt in EXTENSIONS ? EXTENSIONS[desiredExt] : defaultExt
        })
      }

      // If source equals destination, write to the same file.
      const promise = src === dest
        ? rw(src) // Create read- and write stream from source.
          .then(({ readStream, writeStream }) => {
            return convert.stream(readStream, writeStream, transformer)
          })
        : convert.stream(fs.createReadStream(src), fs.createWriteStream(dest), transformer)

      // Attach info and return.
      return promise.then((info) => Object.assign(info, { src, path: dest }))
    })
    return Promise.all(promises)
  },

  // Convert a stream.
  stream: (inStream, outStream, transformer) => {
    return new Promise((resolve, reject) => {
      // Use transformer if specified.
      transformer = transformer || queue.drain(sharp())

      // Gather return value.
      const info = { }
      transformer.on('info', (_info) => Object.assign(info, _info))

      // Pipe, and return as promise.
      bubbleError(inStream, transformer, outStream)
      inStream.pipe(transformer).pipe(outStream)
      outStream.once('error', reject)
      outStream.on('finish', () => resolve(info))
    })
  }
}
