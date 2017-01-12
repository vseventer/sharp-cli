/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
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

// Package modules.
const multiyargs = require('multiyargs')
const yargs = require('yargs')

// Global options.
const options = {
  // @see http://sharp.dimens.io/en/stable/api-constructor/
  density: {
    alias: 'd',
    desc: 'Integral number representing the DPI for vector images',
    defaultDescription: 72,
    type: 'number'
  },
  input: {
    alias: 'i',
    defaultDescription: 'stdin',
    desc: 'Path to (an) image file(s)',
    type: 'array'
  },

  // @see http://sharp.dimens.io/en/stable/api-input/#limitinputpixels
  limitInputPixels: {
    alias: 'l',
    defaultDescription: 0x3FFF * 0x3FFF,
    desc: 'Do not process input images where the number of pixels (width x height) exceeds this limit',
    type: 'number'
  },

  // @see http://sharp.dimens.io/en/stable/api-input/#sequentialread
  sequentialRead: {
    desc: 'An advanced setting that switches the libvips access method to VIPS_ACCESS_SEQUENTIAL',
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/
  output: {
    alias: 'o',
    defaultDescription: 'stdout',
    desc: 'Path to write the image data to',
    type: 'string'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
  withMetadata: {
    alias: 'm',
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    type: 'boolean'
  }
}
const optionNames = Object.keys(options)

// Configure.
const cli = yargs
  .strict()
  .usage('$0 [options] <command>')

  // Global options.
  .help().alias('help', 'h')
  .version().alias('version', 'v')
  .options(options) // Custom global options.
  .global(optionNames)
  .group([ ...optionNames, 'help', 'version' ].sort(), 'Global Options')

  // Commands.
  .demandCommand(1)
  .commandDir('../cmd', { recurse: true })

// Exports.
module.exports = (argv) => {
  const args = multiyargs(cli, argv)
  console.log(JSON.stringify(args, null, 2))
  // TODO Handle global options (density / input / limitInputPixels / sequentialRead).
}
