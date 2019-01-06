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

// Package modules.
const yargs = require('yargs')

// Local modules.
const constants = require('./constants')
const pkg = require('../package.json')
const queue = require('./queue')

// Configure.
const IS_TEXT_TERMINAL = process.stdin.isTTY

// Options.
const _global = 'Global Options'
const optimize = 'Optimization Options'
const options = {
  // Global options.

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#png
  compressionLevel: {
    alias: 'c',
    desc: 'zlib compression level',
    defaultDescription: 9,
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#toformat
  format: {
    alias: 'f',
    choices: [ 'input', ...constants.FORMAT ],
    default: 'input',
    desc: 'Force output to a given format',
    group: _global,
    nargs: 1
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-constructor/
  input: {
    alias: 'i',
    defaultDescription: 'stdin',
    demand: IS_TEXT_TERMINAL,
    desc: 'Path to (an) image file(s)',
    group: _global,
    implies: 'output',
    normalize: true,
    type: 'array'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-input/#limitinputpixels
  limitInputPixels: {
    alias: 'l',
    defaultDescription: 0x3FFF * 0x3FFF,
    desc: 'Do not process input images where the number of pixels (width x height) exceeds this limit',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/
  output: {
    alias: 'o',
    defaultDescription: 'stdout',
    demand: IS_TEXT_TERMINAL,
    desc: 'Directory or URI template to write the image files to',
    group: _global,
    nargs: 1,
    normalize: true,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#png
  progressive: {
    alias: 'p',
    desc: 'Use progressive (interlace) scan',
    group: _global,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#webp
  quality: {
    alias: 'q',
    desc: 'Quality',
    defaultDescription: '80',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#withmetadata
  withMetadata: {
    alias: 'm',
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    global: true,
    group: _global,
    type: 'boolean'
  },

  // Optimization options.

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#png
  adaptiveFiltering: {
    desc: 'Use adaptive row filtering',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#webp
  alphaQuality: {
    desc: 'Quality of alpha layer',
    defaultDescription: '80',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  chromaSubsampling: {
    desc: 'Set to "4:4:4" to prevent chroma subsampling when quality <= 90',
    defaultDescription: '4:2:0',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  compression: {
    choices: constants.TIFF_COMPRESSION,
    default: 'jpeg',
    desc: 'Compression options',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#webp
  lossless: {
    desc: 'Use lossless compression mode',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#webp
  nearLossless: {
    desc: 'use near_lossless compression mode',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  optimise: {
    alias: 'optimize',
    desc: 'Apply optimiseScans, overshootDeringing, and trellisQuantisation',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  optimiseCoding: {
    alias: 'optimizeCoding',
    default: true,
    desc: 'Optimise Huffman coding tables',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  optimiseScans: {
    alias: 'optimizeScans',
    desc: 'Optimise progressive scans',
    group: optimize,
    implies: 'progressive',
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  overshootDeringing: {
    desc: 'Apply overshoot deringing',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  predictor: {
    choices: constants.TIFF_PREDICTOR,
    default: 'horizontal',
    desc: 'Compression predictor',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  pyramid: {
    desc: 'Write an image pyramid',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  quantisationTable: {
    alias: 'quantizationTable',
    defaultDescription: '0',
    desc: 'Quantization table to use',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-input/#sequentialread
  sequentialRead: {
    desc: 'An advanced setting that switches the libvips access method to VIPS_ACCESS_SEQUENTIAL',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  squash: {
    desc: 'Squash 8-bit images down to 1 bit',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  tileHeight: {
    desc: 'Vertical tile size',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  tileWidth: {
    desc: 'Horizontal tile size',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
  trellisQuantisation: {
    desc: 'Apply trellis quantisation',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  xres: {
    defaultDescription: '1.0',
    desc: 'Horizontal resolution',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
  yres: {
    defaultDescription: '1.0',
    desc: 'Vertical resolution',
    group: optimize,
    type: 'number'
  }
}

// Configure.
const cli = yargs
  .strict()
  .usage('$0 <options> [command..]')
  .options(options)
  .example('$0 -i ./input.jpg -o ./out resize 300 200', 'out/input.jpg will be a 300 pixels wide and 200 pixels high image containing a scaled and cropped version of input.jpg')
  .example('$0 -i ./input.jpg -o ./out -mq90 rotate 180 -- resize 300 -- flatten "#ff6600" -- overlayWith ./overlay.png --gravity southeast -- sharpen', 'out/input.jpg will be an upside down, 300px wide, alpha channel flattened onto orange background, composited with overlay.png with SE gravity, sharpened, with metadata, 90% quality version of input.jpg')
  .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/')
  .showHelpOnFail(false)

  // Built-in options.
  .help().alias('help', 'h')
  .version(pkg.version).alias('version', 'v')
  .group([ 'help', 'version' ], 'Misc. Options')

  // Commands.
  // Avoid `yargs.commandDir()` as it uses insertion order, not alphabetical.
  .command(require('../cmd/channel-manipulation/bandbool'))
  .command(require('../cmd/operations/blur'))
  .command(require('../cmd/operations/boolean'))
  .command(require('../cmd/operations/convolve'))
  .command(require('../cmd/resizing/extend'))
  .command(require('../cmd/resizing/extract'))
  .command(require('../cmd/channel-manipulation/extract'))
  .command(require('../cmd/operations/flatten'))
  .command(require('../cmd/operations/flip'))
  .command(require('../cmd/operations/flop'))
  .command(require('../cmd/operations/gamma'))
  .command(require('../cmd/colour-manipulation/greyscale'))
  .command(require('../cmd/channel-manipulation/join'))
  .command(require('../cmd/operations/linear'))
  .command(require('../cmd/operations/median'))
  .command(require('../cmd/operations/negate'))
  .command(require('../cmd/operations/normalise'))
  .command(require('../cmd/composite'))
  .command(require('../cmd/operations/recomb'))
  .command(require('../cmd/channel-manipulation/remove-alpha'))
  .command(require('../cmd/resizing/resize'))
  .command(require('../cmd/operations/rotate'))
  .command(require('../cmd/operations/sharpen'))
  .command(require('../cmd/operations/threshold'))
  .command(require('../cmd/colour-manipulation/tint'))
  .command(require('../cmd/output'))
  .command(require('../cmd/colour-manipulation/tocolourspace'))
  .command(require('../cmd/resizing/trim'))
  .wrap(100)

// Override `cli.parse` to handle global options.
const originalParse = cli.parse
cli.parse = (argv, context, callback) => {
  // Context is optional.
  if (typeof context === 'function') {
    callback = context
    context = { }
  }

  // Parse and return the arguments.
  return originalParse(argv, context, (err, args, output) => {
    // Handle arguments.
    // NOTE Use queue.unshift to apply global options first.
    if (args !== null) {
      // Require at least one input file.
      // NOTE: check here b/c https://github.com/yargs/yargs/issues/403
      if (args.input && args.input.length === 0) {
        err = new Error('Not enough arguments following: i, input')
      }

      // Global Options.

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#toformat
      if (args.format !== options.format.default) {
        queue.unshift([ 'format', (sharp) => sharp.toFormat(args.format) ])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg
      if (
        args.chromaSubsampling ||
        args.optimise ||
        args.optimiseCoding !== true ||
        args.optimiseScans ||
        args.overshootDeringing ||
        args.progressive ||
        args.quantisationTable ||
        args.quality ||
        args.trellisQuantisation
      ) {
        queue.unshift([ 'jpeg', (sharp) => {
          return sharp.jpeg({
            chromaSubsampling: args.chromaSubsampling,
            force: false,
            optimiseCoding: args.optimiseCoding,
            optimiseScans: args.optimise || args.optimiseScans,
            overshootDeringing: args.optimise || args.overshootDeringing,
            progressive: args.progressive,
            quality: args.quality,
            quantisationTable: args.quantisationTable,
            trellisQuantisation: args.optimise || args.trellisQuantisation
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-input/#limitinputpixels
      if (undefined !== args.limitInputPixels) {
        queue.unshift([ 'limitInputPixels', (sharp) => sharp.limitInputPixels(args.limitInputPixels) ])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#png
      if (args.adaptiveFiltering || args.compressionLevel || args.progressive) {
        queue.unshift([ 'png', (sharp) => {
          return sharp.png({
            adaptiveFiltering: args.adaptiveFiltering,
            compressionLevel: args.compressionLevel,
            force: false,
            progressive: args.progressive
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-input/#sequentialread
      if (args.sequentialRead) {
        queue.unshift([ 'sequentialRead', (sharp) => sharp.sequentialRead() ])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#tiff
      if (args.compression !== options.compression.default ||
       args.predictor !== options.predictor.default ||
       args.pyramid || args.quality || args.squash || args.tileHeight ||
       args.tileWidth || args.xres || args.yres) {
        queue.unshift([ 'tiff', (sharp) => {
          return sharp.tiff({
            compression: args.compression,
            force: false,
            predictor: args.predictor,
            pyramid: args.pyramid,
            quality: args.quality,
            squash: args.squash,
            tile: args.tileWidth !== undefined || args.tileHeight !== undefined,
            tileHeight: args.tileHeight || args.tileWidth,
            tileWidth: args.tileWidth || args.tileHeight,
            xres: args.xres,
            yres: args.yres
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#webp
      if (args.alphaQuality || args.quality || args.lossless || args.nearLossless) {
        queue.unshift([ 'webp', (sharp) => {
          return sharp.webp({
            alphaQuality: args.alphaQuality,
            force: false,
            lossless: args.lossless,
            nearLossless: args.nearLossless,
            quality: args.quality
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/en/stable/api-output/#withmetadata
      if (args.withMetadata) {
        queue.unshift([ 'withMetadata', (sharp) => sharp.withMetadata() ])
      }
    }

    // Invoke original.
    return callback(err, args, output)
  })
}

// Exports.
module.exports = cli
