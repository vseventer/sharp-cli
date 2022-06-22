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
const sharp = require('sharp')
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

  // @see https://sharp.pixelplumbing.com/api-output#png
  compressionLevel: {
    alias: 'c',
    desc: 'zlib compression level',
    defaultDescription: 6,
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  delay: {
    desc: 'Delay(s) between animation frames',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-constructor
  density: {
    desc: 'DPI for vector images',
    defaultDescription: 72,
    group: _global,
    nargs: 1,
    type: 'number'
  },

  dry: {
    alias: 'n',
    desc: 'Do everything except write files',
    group: _global,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#toformat
  format: {
    alias: 'f',
    choices: ['input', ...constants.FORMAT],
    default: 'input',
    desc: 'Force output to a given format',
    group: _global,
    nargs: 1
  },

  // @see https://sharp.pixelplumbing.com/api-constructor/
  input: {
    alias: 'i',
    defaultDescription: 'stdin',
    demand: IS_TEXT_TERMINAL,
    desc: 'Path to (an) image file(s)',
    group: _global,
    implies: 'output',
    type: 'array'
  },

  // @see https://sharp.pixelplumbing.com/api-constructor
  level: {
    desc: 'Level to extract from a multi-level input',
    defaultDescription: 0,
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  loop: {
    default: 0,
    desc: 'Number of animation iterations',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output/
  output: {
    alias: 'o',
    defaultDescription: 'stdout',
    demand: IS_TEXT_TERMINAL,
    desc: 'Directory or URI template to write the image files to',
    group: _global,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-constructor
  page: {
    defaultDescription: 0,
    desc: 'Page number to start extracting from for multi-page input',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-constructor
  pages: {
    defaultDescription: 1,
    desc: 'Number of pages to extract for multi-page input',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  // @see https://sharp.pixelplumbing.com/api-output#png
  progressive: {
    alias: 'p',
    desc: 'Use progressive (interlace) scan',
    group: _global,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  // @see https://sharp.pixelplumbing.com/api-output#tiff
  // @see https://sharp.pixelplumbing.com/api-output#webp
  quality: {
    alias: 'q',
    desc: 'Quality',
    defaultDescription: '80',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#timeout
  timeout: {
    defaultDescription: '0',
    desc: 'Number of seconds after which processing will be stopped',
    group: _global,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#withmetadata
  withMetadata: {
    alias: 'm',
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    global: true,
    group: _global,
    type: 'boolean'
  },

  // Optimization options.

  // @see https://sharp.pixelplumbing.com/api-output#png
  adaptiveFiltering: {
    desc: 'Use adaptive row filtering',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  alphaQuality: {
    desc: 'Quality of alpha layer',
    defaultDescription: '80',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  bitdepth: {
    choices: [1, 2, 4, 8],
    defaultDescription: 8,
    desc: 'Squash 8-bit images down to 1, 2, or 4 bit',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  chromaSubsampling: {
    desc: 'Set to "4:4:4" to prevent chroma subsampling when quality <= 90',
    defaultDescription: '4:4:4 (AVIF) / 4:2:0',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  // @see https://sharp.dimens.io/api-output#png
  colors: {
    alias: 'colours',
    defaultDescription: 256,
    desc: 'Maximum number of palette entries',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  compression: {
    choices: constants.TIFF_COMPRESSION,
    default: 'jpeg',
    desc: 'Compression options',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  // @see https://sharp.dimens.io/api-output#png
  dither: {
    desc: 'Level of Floyd-Steinberg error diffusion',
    defaultDescription: '1.0',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#gif
  // @see https://sharp.pixelplumbing.com/api-output#heif
  // @see https://sharp.pixelplumbing.com/api-output#png
  // @see https://sharp.pixelplumbing.com/api-output#webp
  effort: {
    defaultDescription: '7 (GIF, PNG) / 4',
    desc: 'Level of CPU effort to reduce file size',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#heif
  hcompression: {
    choices: constants.HEIF_COMPRESSION,
    default: 'av1',
    desc: 'Compression format',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#webp
  lossless: {
    desc: 'Use lossless compression mode',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  mozjpeg: {
    desc: 'Use mozjpeg defaults',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  nearLossless: {
    desc: 'Use near_lossless compression mode',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  optimise: {
    alias: 'optimize',
    desc: 'Apply optimiseScans, overshootDeringing, and trellisQuantisation',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  optimiseCoding: {
    alias: 'optimizeCoding',
    default: true,
    desc: 'Optimise Huffman coding tables',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  optimiseScans: {
    alias: 'optimizeScans',
    desc: 'Optimise progressive scans',
    group: optimize,
    implies: 'progressive',
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  overshootDeringing: {
    desc: 'Apply overshoot deringing',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.dimens.io/api-output#png
  palette: {
    desc: 'Quantise to a palette-based image with alpha transparency support',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  predictor: {
    choices: constants.TIFF_PREDICTOR,
    default: 'horizontal',
    desc: 'Compression predictor',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  pyramid: {
    desc: 'Write an image pyramid',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  quantisationTable: {
    alias: 'quantizationTable',
    defaultDescription: '0',
    desc: 'Quantization table to use',
    group: optimize,
    nargs: 1,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output
  resolutionUnit: {
    choices: constants.RESOLUTION_UNIT,
    defaultDescription: 'inch',
    desc: 'Resolution unit',
    group: optimize,
    nargs: 1,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  smartSubsample: {
    desc: 'High quality chroma subsampling',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tile
  tileBackground: {
    defaultDescription: 'rgba(255, 255, 255, 1)',
    desc: 'Background colour, parsed by the color module',
    group: optimize,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  tileHeight: {
    desc: 'Vertical tile size',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  tileWidth: {
    desc: 'Horizontal tile size',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  trellisQuantisation: {
    desc: 'Apply trellis quantisation',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  xres: {
    defaultDescription: '1.0',
    desc: 'Horizontal resolution',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
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
  .example('$0 -i ./input.jpg -o ./out -mq90 rotate 180 -- resize 300 -- flatten "#ff6600" -- composite ./overlay.png --gravity southeast -- sharpen', 'out/input.jpg will be an upside down, 300px wide, alpha channel flattened onto orange background, composited with overlay.png with SE gravity, sharpened, with metadata, 90% quality version of input.jpg')
  .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/')
  .showHelpOnFail(false)

  // Built-in options.
  .help().alias('help', 'h')
  .version(pkg.version).alias('version', 'v')
  .group(['help', 'version'], 'Misc. Options')

  // Commands.
  // Avoid `yargs.commandDir()` as it uses insertion order, not alphabetical.
  .command(require('../cmd/channel-manipulation/bandbool'))
  .command(require('../cmd/operations/blur'))
  .command(require('../cmd/operations/boolean'))
  .command(require('../cmd/operations/clahe'))
  .command(require('../cmd/compositing/composite'))
  .command(require('../cmd/operations/convolve'))
  .command(require('../cmd/channel-manipulation/ensure-alpha'))
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
  .command(require('../cmd/operations/modulate'))
  .command(require('../cmd/operations/negate'))
  .command(require('../cmd/operations/normalise'))
  .command(require('../cmd/colour-manipulation/pipeline-colourspace'))
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

      // @see https://sharp.pixelplumbing.com/api-output#toformat
      if (args.format !== options.format.default) {
        queue.unshift(['format', (sharp) => sharp.toFormat(args.format)])
      }

      // @see https://sharp.pixelplumbing.com/api-output#heif
      const { heif } = sharp.format
      if (args.hcompression !== options.hcompression.default || // HEIF-specific.
        // Ensure libheif is installed before applying generic options.
        (heif.input && heif.input.file && (args.effort || args.lossless || args.quality))) {
        queue.unshift(['heif', (sharp) => {
          return sharp.heif({
            compression: args.hcompression,
            effort: args.effort,
            lossless: args.lossless,
            quality: args.quality
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#avif
      if (args.chromaSubsampling || args.effort || args.lossless || args.quality) {
        queue.unshift(['avif', (sharp) => {
          return sharp.avif({
            chromaSubsampling: args.chromaSubsampling,
            effort: args.effort,
            force: false,
            lossless: args.lossless,
            quality: args.quality
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#gif
      if (args.colors || args.effort || args.dither || args.loop || args.delay) {
        queue.unshift(['gif', (sharp) => {
          return sharp.gif({
            colors: args.colors,
            force: false,
            effort: args.effort,
            dither: args.dither,
            loop: args.loop,
            delay: args.delay
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#jpeg
      if (
        args.chromaSubsampling ||
        args.mozjpeg ||
        args.optimise ||
        args.optimiseCoding !== true ||
        args.optimiseScans ||
        args.overshootDeringing ||
        args.progressive ||
        args.quantisationTable ||
        args.quality ||
        args.trellisQuantisation
      ) {
        queue.unshift(['jpeg', (sharp) => {
          return sharp.jpeg({
            chromaSubsampling: args.chromaSubsampling,
            force: false,
            mozjpeg: args.mozjpeg,
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

      // @see https://sharp.pixelplumbing.com/api-output#png
      if (args.adaptiveFiltering || args.colors || args.compressionLevel ||
       args.dither || args.effort || args.palette || args.progressive) {
        queue.unshift(['png', (sharp) => {
          return sharp.png({
            adaptiveFiltering: args.adaptiveFiltering,
            colors: args.colors,
            compressionLevel: args.compressionLevel,
            dither: args.dither,
            effort: args.effort,
            force: false,
            palette: args.palette,
            progressive: args.progressive
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#tiff
      if (args.bitdepth ||
       args.compression !== options.compression.default ||
       args.predictor !== options.predictor.default ||
       args.pyramid || args.quality || args.resolutionUnit || args.tileBackground ||
       args.tileHeight || args.tileWidth || args.xres || args.yres) {
        queue.unshift(['tiff', (sharp) => {
          return sharp.tiff({
            background: args.tileBackground,
            bitdepth: args.bitdepth,
            compression: args.compression,
            force: false,
            predictor: args.predictor,
            pyramid: args.pyramid,
            quality: args.quality,
            resolutionUnit: args.resolutionUnit,
            tile: args.tileWidth !== undefined || args.tileHeight !== undefined,
            tileHeight: args.tileHeight || args.tileWidth,
            tileWidth: args.tileWidth || args.tileHeight,
            xres: args.xres,
            yres: args.yres
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#webp
      if (args.alphaQuality || args.quality || args.lossless ||
       args.nearLossless || args.effort || args.smartSubsample) {
        queue.unshift(['webp', (sharp) => {
          return sharp.webp({
            alphaQuality: args.alphaQuality,
            effort: args.effort,
            force: false,
            lossless: args.lossless,
            nearLossless: args.nearLossless,
            quality: args.quality,
            smartSubsample: args.smartSubsample
          })
        }])
      }

      // @see https://sharp.pixelplumbing.com/api-output#timeout
      if (args.timeout) {
        queue.unshift(['timeout', (sharp) => sharp.timeout({ seconds: args.timeout })])
      }

      // @see https://sharp.pixelplumbing.com/api-output#withmetadata
      if (args.withMetadata) {
        queue.unshift(['withMetadata', (sharp) => sharp.withMetadata()])
      }
    }

    // Invoke original.
    return callback(err, args, output)
  })
}

// Exports.
module.exports = cli
