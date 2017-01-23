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
const yargs = require('yargs')

// Local modules.
const constants = require('./constants')
const pkg = require('../package.json')
const queue = require('./queue')

// Configure.
const IS_TEXT_TERMINAL = process.stdin.isTTY

// Global options.
const globalGroup = 'Global Options'
const outputGroup = 'Output Options'
const options = {
  // @see http://sharp.dimens.io/en/stable/api-constructor/
  input: IS_TEXT_TERMINAL ? {
    alias: 'i',
    defaultDescription: 'stdin',
    demand: true,
    desc: 'Path to (an) image file(s)',
    global: true,
    group: globalGroup,
    implies: 'output',
    normalize: true,
    type: 'array'
  } : undefined,

  // @see http://sharp.dimens.io/en/stable/api-input/#limitinputpixels
  limitInputPixels: {
    alias: 'l',
    defaultDescription: 0x3FFF * 0x3FFF,
    desc: 'Do not process input images where the number of pixels (width x height) exceeds this limit',
    global: true,
    group: globalGroup,
    nargs: 1,
    type: 'number'
  },

  // @see http://sharp.dimens.io/en/stable/api-input/#sequentialread
  sequentialRead: {
    desc: 'An advanced setting that switches the libvips access method to VIPS_ACCESS_SEQUENTIAL',
    global: true,
    group: globalGroup,
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/
  output: IS_TEXT_TERMINAL ? {
    alias: 'o',
    defaultDescription: 'stdout',
    demand: true,
    desc: 'Directory to write the image files to',
    global: true,
    group: globalGroup,
    implies: 'input',
    nargs: 1,
    normalize: true,
    type: 'string'
  } : undefined,

  // @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
  withMetadata: {
    alias: 'm',
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    global: true,
    group: globalGroup,
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#toformat
  format: {
    alias: 'f',
    choices: constants.FORMAT,
    defaultDescription: 'input format',
    desc: 'Force output to a given format',
    global: true,
    group: outputGroup,
    nargs: 1,
    type: 'string'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#jpeg
  'jpeg.chromaSubsampling': {
    desc: 'Set to "4:4:4" to prevent chroma subsampling when quality <= 90',
    defaultDescription: '4:2:0',
    global: true,
    group: outputGroup,
    nargs: 1,
    type: 'string'
  },
  'jpeg.optimiseScans': {
    alias: 'jpeg.optimizeScans',
    desc: 'Optimise progressive scans, forces progressive, requires mozjpeg',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },
  'jpeg.overshootDeringing': {
    desc: 'Apply overshoot deringing, requires mozjpeg',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },
  'jpeg.progressive': {
    desc: 'Use progressive (interlace) scan',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },
  'jpeg.quality': {
    desc: 'Quality',
    defaultDescription: 80,
    global: true,
    group: outputGroup,
    type: 'number'
  },
  'jpeg.trellisQuantisation': {
    desc: 'Apply trellis quantisation, requires mozjpeg',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#png
  'png.adaptiveFiltering': {
    desc: 'Use adaptive row filtering',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },
  'png.compressionLevel': {
    desc: 'zlib compression level',
    defaultDescription: 6,
    global: true,
    group: outputGroup,
    nargs: 1,
    type: 'number'
  },
  'png.progressive': {
    desc: 'Use progressive (interlace) scan',
    global: true,
    group: outputGroup,
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#tiff
  'tiff.quality': {
    desc: 'Quality',
    defaultDescription: 80,
    global: true,
    group: outputGroup,
    nargs: 1,
    type: 'number'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#webp
  'webp.quality': {
    desc: 'Quality',
    defaultDescription: 80,
    global: true,
    group: outputGroup,
    nargs: 1,
    type: 'number'
  }
}

// Configure.
const cli = yargs
  .strict()
  .usage('$0 <options> [command..]', options)
  .example('$0 -i ./input.jpg -o ./ resize 300 200', 'output.jpg will be a 300 pixels wide and 200 pixels high image containing a scaled and cropped version of input.jpg')
  .example('$0 -mq 90 -i ./input.jpg -o ./ rotate 180 -- resize 300 -- background "#ff6600" --flatten -- overlayWith ./overlay.png --gravity southeast -- sharpen', 'output.jpg will be an upside down, 300px wide, alpha channel flattened onto orange background, composited with overlay.png with SE gravity, sharpened, with metadata, 90% quality version of input.jpg')
  .epilog('For more information on available options, please visit http://sharp.dimens.io/')
  .showHelpOnFail(false)

  // Built-in options.
  .help().alias('help', 'h')
  .version(pkg.version).alias('version', 'v')
  .group([ 'help', 'version' ], globalGroup)

  // Commands.
  // Avoid `yargs.commandDir()` as it uses insertion order, not alphabetical.
  .command(require('../cmd/colour-manipulation/background'))
  .command(require('../cmd/channel-manipulation/bandbool'))
  .command(require('../cmd/operations/blur'))
  .command(require('../cmd/operations/boolean'))
  .command(require('../cmd/operations/convolve'))
  .command(require('../cmd/operations/extract'))
  .command(require('../cmd/channel-manipulation/extract'))
  .command(require('../cmd/operations/flip'))
  .command(require('../cmd/operations/flop'))
  .command(require('../cmd/operations/gamma'))
  .command(require('../cmd/colour-manipulation/greyscale'))
  .command(require('../cmd/channel-manipulation/join'))
  .command(require('../cmd/operations/negate'))
  .command(require('../cmd/operations/normalise'))
  .command(require('../cmd/composite'))
  .command(require('../cmd/resize'))
  .command(require('../cmd/operations/rotate'))
  .command(require('../cmd/operations/sharpen'))
  .command(require('../cmd/operations/threshold'))
  .command(require('../cmd/output'))
  .command(require('../cmd/colour-manipulation/tocolourspace'))
  .command(require('../cmd/operations/trim'))

// Override `cli.parse` to handle global options.
const originalParse = cli.parse
cli.parse = (argv, context, callback) => {
  // Context is optional.
  if (typeof context === 'function') {
    callback = context
    context = null
  }

  // Parse and return the arguments.
  return originalParse(argv, context, (err, args, output) => {
    // Handle arguments.
    // NOTE Use queue.unshift to apply global options first.
    console.log(args)
    if (args !== null) {
      // Require at least one input file.
      // NOTE: check here b/c https://github.com/yargs/yargs/issues/403
      if (args.input && args.input.length === 0) {
        err = new Error('Not enough arguments following: i, input')
      }

      // Global Options.

      // @see http://sharp.dimens.io/en/stable/api-input/#limitinputpixels
      if (undefined !== args.limitInputPixels) {
        queue.unshift([ 'limitInputPixels', (sharp) => sharp.limitInputPixels(args.limitInputPixels) ])
      }

      // @see http://sharp.dimens.io/en/stable/api-input/#sequentialread
      if (args.sequentialRead) {
        queue.unshift([ 'sequentialRead', (sharp) => sharp.sequentialRead() ])
      }

      // @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
      if (args.withMetadata) {
        queue.unshift([ 'withMetadata', (sharp) => sharp.withMetadata() ])
      }

      // Output Options.

      // @see http://sharp.dimens.io/en/stable/api-output/#toformat
      if (args.format) {
        queue.unshift([ 'format', (sharp) => sharp.toFormat(args.format) ])
      }

      // @see http://sharp.dimens.io/en/stable/api-output/#jpeg
      if (args.jpeg) {
        const options = Object.assign({ }, args.jpeg, { force: false })
        queue.unshift([ 'jpeg', (sharp) => sharp.jpeg(options) ])
      }

      // @see http://sharp.dimens.io/en/stable/api-output/#png
      if (args.png) {
        const options = Object.assign({ }, args.png, { force: false })
        queue.unshift([ 'png', (sharp) => sharp.png(options) ])
      }

      // @see http://sharp.dimens.io/en/stable/api-output/#tiff
      if (args.tiff) {
        const options = Object.assign({ }, args.tiff, { force: false })
        queue.unshift([ 'tiff', (sharp) => sharp.tiff(options) ])
      }

      // @see http://sharp.dimens.io/en/stable/api-output/#webp
      if (args.webp) {
        const options = Object.assign({ }, args.webp, { force: false })
        queue.unshift([ 'webp', (sharp) => sharp.webp(options) ])
      }
    }

    // Invoke original.
    return callback(err, args, output)
  })
}

// Exports.
module.exports = cli
