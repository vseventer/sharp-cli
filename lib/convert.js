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
const path = require('path')

// Package modules.
const bubbleError = require('bubble-stream-error')
const isDirectory = require('is-directory')
const sharp = require('sharp')
const urlTemplate = require('url-template')

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
module.exports = {
  // Convert a list of files.
  files: (input, output) => {
    const template = urlTemplate.parse(output) // Parse output template.
    output = path.resolve(output)

    // Process files.
    const isBatch = input.length > 1
    const promises = input.map((src) => {
      src = path.resolve(src) // Absolute path.

      // Process file.
      const transformer = queue.drain(sharp(src))

      // Destination.
      let dest = template.expand(path.parse(src))

      // Path separator for windows is encoded by url-template.
      // @see https://github.com/vseventer/sharp-cli/issues/8
      if (process.platform === 'win32') {
        dest = dest.split('%5C').join(path.sep)
      }
      dest = path.resolve(dest) // Absolute path.

      // If output was not a template, assume dest is a directory when using
      // batch processing.
      const outputAssumeDir = dest === output && isBatch
      if (outputAssumeDir || isDirectory.sync(dest)) {
        const defaultExt = path.extname(src)
        const desiredExt = transformer.options.formatOut
        dest = path.format({
          dir: dest,
          name: path.basename(src, defaultExt),
          ext: desiredExt in EXTENSIONS ? EXTENSIONS[desiredExt] : defaultExt
        })
      }

      // Save to file.
      return transformer
        .toFile(dest)
        .then((info) => Object.assign(info, { src: src, path: dest }))
    })
    return Promise.all(promises)
  },

  // Convert a stream.
  stream: (inStream, outStream) => {
    return new Promise((resolve, reject) => {
      const transformer = queue.drain(sharp())

      // Pipe, and return as promise.
      bubbleError(inStream, transformer, outStream)
      inStream.pipe(transformer).pipe(outStream)
      outStream.once('error', reject)
      outStream.on('finish', resolve)
    })
  }
}
