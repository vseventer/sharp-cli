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
const pick = require('lodash.pick')
const sharp = require('sharp')
const yargs = require('yargs')

// Local modules.
const constants = require('./constants')
const pkg = require('../package.json')
const queue = require('./queue')

// Configure.
const IS_TEXT_TERMINAL = process.stdin.isTTY

// Options.
const global = 'Global Options'
const input = 'Input Options'
const optimize = 'Optimization Options'
const output = 'Output Options'

const globalOptions = {
  // @see https://sharp.pixelplumbing.com/api-constructor/
  input: {
    alias: 'i',
    defaultDescription: 'stdin',
    demand: IS_TEXT_TERMINAL,
    desc: 'Path to (an) image file(s)',
    group: global,
    implies: 'output',
    type: 'array'
  },

  // @see https://sharp.pixelplumbing.com/api-output/
  output: {
    alias: 'o',
    defaultDescription: 'stdout',
    demand: IS_TEXT_TERMINAL,
    desc: 'Directory or URI template to write the image files to',
    group: global,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#timeout
  timeout: {
    desc: 'Number of seconds after which processing will be stopped',
    group: global,
    type: 'number'
  }
}

// @see https://sharp.pixelplumbing.com/api-constructor
const inputOptions = {
  animated: {
    desc: 'Read all frames/pages of an animated image',
    group: input,
    type: 'boolean'
  },
  autoOrient: {
    desc: 'Rotate/flip the image to match EXIF Orientation, if any',
    group: input,
    type: 'boolean'
  },
  failOn: {
    choices: constants.FAIL_ON,
    defaultDescription: 'warning',
    desc: 'Level of sensitivity to invalid images',
    group: input
  },
  density: {
    desc: 'DPI for vector images',
    defaultDescription: 72,
    group: input,
    type: 'number'
  },
  ignoreIcc: {
    default: false,
    desc: 'Should the embedded ICC profile, if any, be ignored',
    group: input,
    type: 'boolean'
  },
  level: {
    desc: 'Level to extract from a multi-level input (OpenSlide), zero based',
    defaultDescription: 0,
    group: input,
    type: 'number'
  },
  limitInputPixels: {
    defaultDescription: 0x3FFF * 0x3FFF,
    desc: 'Do not process input images where the number of pixels (width x height) exceeds this limit',
    group: input,
    type: 'number'
  },
  page: {
    defaultDescription: 0,
    desc: 'Page number to start extracting from for multi-page input',
    group: input,
    type: 'number'
  },
  pages: {
    defaultDescription: 1,
    desc: 'Number of pages to extract for multi-page input',
    group: input,
    type: 'number'
  },
  pdfBackground: {
    desc: 'Background colour to use when PDF is partially transparent',
    group: input,
    type: 'string'
  },
  sequentialRead: {
    default: false,
    desc: 'Use sequential rather than random access where possible',
    group: input,
    type: 'boolean'
  },
  subifd: {
    defaultDescription: -1,
    desc: 'subIFD to extract for OME-TIFF',
    group: input,
    type: 'number'
  },
  unlimited: {
    desc: 'Remove safety features that help prevent memory exhaustion',
    group: input,
    type: 'boolean'
  }
}

const outputOptions = {
  // @see https://sharp.pixelplumbing.com/api-output#png
  compressionLevel: {
    alias: 'c',
    desc: 'zlib compression level',
    defaultDescription: 6,
    group: output,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#toformat
  format: {
    alias: 'f',
    choices: constants.FORMAT,
    defaultDescription: 'input',
    desc: 'Force output to a given format',
    group: output
  },

  // @see https://sharp.pixelplumbing.com/api-output#withmetadata
  metadata: {
    alias: ['m', 'withMetadata'],
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    group: output,
    type: 'boolean'
  },
  'metadata.density': {
    desc: 'Number of pixels per inch (DPI)',
    group: output,
    type: 'number'
  },
  'metadata.exif': {
    defaultDescription: '{}',
    desc: 'Object keyed by IFD0, IFD1 etc. of key/value string pairs to write as EXIF data',
    group: output,
    type: 'object'
  },
  'metadata.icc': {
    defaultDescription: 'sRGB',
    desc: 'Filesystem path to output ICC profile',
    group: output,
    type: 'string'
  },
  'metadata.orientation': {
    desc: 'Used to update the EXIF Orientation tag',
    group: output,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  // @see https://sharp.pixelplumbing.com/api-output#png
  progressive: {
    alias: 'p',
    desc: 'Use progressive (interlace) scan',
    group: output,
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
    group: output,
    type: 'number'
  }
}

const optimizationOptions = {
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
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  bitdepth: {
    choices: [1, 2, 4, 8],
    defaultDescription: 8,
    desc: 'Reduce bitdepth to 1, 2, or 4 bit',
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#jpeg
  chromaSubsampling: {
    desc: 'Set to "4:4:4" to prevent chroma subsampling when quality <= 90',
    defaultDescription: '4:4:4 (AVIF) / 4:2:0',
    group: optimize,
    type: 'string'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  // @see https://sharp.dimens.io/api-output#png
  colors: {
    alias: 'colours',
    defaultDescription: 256,
    desc: 'Maximum number of palette entries',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  compression: {
    choices: constants.TIFF_COMPRESSION,
    default: 'jpeg',
    desc: 'Compression options',
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  delay: {
    desc: 'Delay(s) between animation frames',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  // @see https://sharp.dimens.io/api-output#png
  dither: {
    desc: 'Level of Floyd-Steinberg error diffusion',
    defaultDescription: '1.0',
    group: optimize,
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
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#heif
  hbitdepth: {
    choices: [8, 10, 12],
    defaultDescription: 8,
    desc: 'Set bitdepth to 8, 10, or 12 bit',
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#heif
  hcompression: {
    choices: constants.HEIF_COMPRESSION,
    default: 'av1',
    desc: 'Compression format',
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  interFrameMaxError: {
    desc: 'Maximum inter-frame error for transparency',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  interPaletteMaxError: {
    desc: 'Maximum inter-palette error for palette reuse',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  loop: {
    default: 0,
    desc: 'Number of animation iterations',
    group: optimize,
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#avif
  // @see https://sharp.pixelplumbing.com/api-output#webp
  lossless: {
    desc: 'Use lossless compression mode',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#tiff
  miniswhite: {
    desc: 'Write 1-bit images as miniswhite',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  minSize: {
    desc: 'Prevent use of animation key frames to minimize file size',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  mixed: {
    desc: 'Allow mixture of lossy and lossless animation frames',
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
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  preset: {
    choices: constants.PRESETS,
    default: 'default',
    desc: 'Named preset for preprocessing/filtering',
    group: optimize
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
    type: 'number'
  },

  // @see https://sharp.pixelplumbing.com/api-output#gif
  reuse: {
    alias: ['reoptimise', 'reoptimize'],
    desc: 'Always generate new palettes (slow)',
    group: optimize,
    type: 'boolean'
  },

  // @see https://sharp.pixelplumbing.com/api-output
  resolutionUnit: {
    choices: constants.RESOLUTION_UNIT,
    defaultDescription: 'inch',
    desc: 'Resolution unit',
    group: optimize
  },

  // @see https://sharp.pixelplumbing.com/api-output#webp
  smartDeblock: {
    desc: 'Auto-adjust the deblocking filter, can improve low contrast edges',
    group: optimize,
    type: 'boolean'
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

const options = {
  ...globalOptions,
  ...inputOptions,
  ...outputOptions,
  ...optimizationOptions
}

// Configure.
const cli = yargs
  .parserConfiguration({ 'populate--': true })
  .strict()
  .usage('$0 <options> [command..]')
  .options(options)
  .example('$0 -i ./input.jpg -o ./out resize 300 200', 'out/input.jpg will be a 300 pixels wide and 200 pixels high image containing a scaled and cropped version of input.jpg')
  .example('$0 -i ./input.jpg -o ./out -mq90 rotate 180 -- resize 300 -- flatten "#ff6600" -- composite ./overlay.png --gravity southeast -- sharpen', 'out/input.jpg will be an upside down, 300px wide, alpha channel flattened onto orange background, composited with overlay.png with SE gravity, sharpened, with metadata, 90% quality version of input.jpg')
  .example('$0 -i ./input.jpg -o ./out --metadata', 'Include all metadata in the output image')
  .example('$0 -i ./input.jpg -o ./out --metadata.exif.IFD0.Copyright "Wernham Hogg"', 'Set "IFD0-Copyright" in output EXIF metadata')
  .example('$0 -i ./input.jpg -o ./out --metadata.density 96', 'Set output metadata to 96 DPI')
  .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/')
  .showHelpOnFail(false)
  .wrap(100)

  // Built-in options.
  .help().alias('help', 'h')
  .version(pkg.version).alias('version', 'v')
  .group(['help', 'version'], 'Misc. Options')

  // Commands.
  // Avoid `yargs.commandDir()` as it uses insertion order, not alphabetical.
  .command(require('../cmd/operations/affine'))
  .command(require('../cmd/channel-manipulation/bandbool'))
  .command(require('../cmd/operations/blur'))
  .command(require('../cmd/operations/boolean'))
  .command(require('../cmd/operations/clahe'))
  .command(require('../cmd/compositing/composite'))
  .command(require('../cmd/operations/convolve'))
  .command(require('../cmd/channel-manipulation/ensure-alpha'))
  .command(require('../cmd/resizing/extend'))
  .command(require('../cmd/resizing/extract'))
  .command(require('../cmd/channel-manipulation/extract-channel'))
  .command(require('../cmd/operations/flatten'))
  .command(require('../cmd/operations/flip'))
  .command(require('../cmd/operations/flop'))
  .command(require('../cmd/operations/gamma'))
  .command(require('../cmd/colour-manipulation/greyscale'))
  .command(require('../cmd/channel-manipulation/join-channel'))
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
  .command(require('../cmd/operations/unflatten'))

// Helpers.
const originalParse = cli.parse.bind(cli)
const promisifiedParse = (...args) => {
  return new Promise((resolve, reject) => {
    originalParse(...args, (err, argv, output) => {
      if (err) {
        reject(err)
      }
      if (argv.v || argv.help) {
        reject(output)
      }
      resolve(argv)
    })
  })
}

// Exports.
module.exports = cli
module.exports.inputOptions = Object.keys(inputOptions)
module.exports.parse = function recursiveParse (args, context = {}) {
  return promisifiedParse(args, context).then(argv => {
    // Handle arguments.
    // NOTE Use queue.unshift to apply global options first.

    // Global options.

    // Require at least one input file.
    // NOTE: check here b/c https://github.com/yargs/yargs/issues/403
    if (argv.input && argv.input.length === 0) {
      throw new Error('Not enough arguments following: i, input')
    }

    // @see https://sharp.pixelplumbing.com/api-output#timeout
    if (argv.timeout) {
      queue.unshift(['timeout', (sharp) => sharp.timeout({ seconds: argv.timeout })])
    }

    // Output options.

    // @see https://sharp.pixelplumbing.com/api-output#toformat
    if (argv.format) {
      queue.unshift(['format', (sharp) => sharp.toFormat(argv.format, { compression: argv.hcompression })])
    }

    // @see https://sharp.pixelplumbing.com/api-output#withmetadata
    if (argv.metadata) {
      queue.unshift(['withMetadata', (sharp) => sharp.withMetadata(argv.metadata)])
    }

    // @see https://sharp.pixelplumbing.com/api-output#heif
    const { heif } = sharp.format
    if (argv.hcompression !== optimizationOptions.hcompression.default || // HEIF-specific.
      // Ensure libheif is installed before applying generic options.
      (heif.input && heif.input.file &&
      (argv.effort || argv.hbitdepth || argv.lossless || argv.quality))) {
      queue.unshift(['heif', (sharp) => {
        return sharp.heif({
          bitdepth: argv.hbitdepth,
          compression: argv.hcompression,
          effort: argv.effort,
          force: false,
          lossless: argv.lossless,
          quality: argv.quality
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#avif
    if (argv.chromaSubsampling || argv.effort || argv.lossless || argv.quality) {
      queue.unshift(['avif', (sharp) => {
        return sharp.avif({
          chromaSubsampling: argv.chromaSubsampling,
          effort: argv.effort,
          force: false,
          lossless: argv.lossless,
          quality: argv.quality
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#gif
    if (argv.colors || argv.effort || argv.dither || argv.interFrameMaxError ||
     argv.interPaletteMaxError || argv.loop || argv.delay || argv.progressive || argv.reuse) {
      queue.unshift(['gif', (sharp) => {
        return sharp.gif({
          colors: argv.colors,
          force: false,
          effort: argv.effort,
          dither: argv.dither,
          interFrameMaxError: argv.interFrameMaxError,
          interPaletteMaxError: argv.interPaletteMaxError,
          loop: argv.loop,
          delay: argv.delay,
          progressive: argv.progressive,
          reuse: argv.reuse
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#jpeg
    if (
      argv.chromaSubsampling ||
      argv.mozjpeg ||
      argv.optimise ||
      argv.optimiseCoding !== true ||
      argv.optimiseScans ||
      argv.overshootDeringing ||
      argv.progressive ||
      argv.quantisationTable ||
      argv.quality ||
      argv.trellisQuantisation
    ) {
      queue.unshift(['jpeg', (sharp) => {
        return sharp.jpeg({
          chromaSubsampling: argv.chromaSubsampling,
          force: false,
          mozjpeg: argv.mozjpeg,
          optimiseCoding: argv.optimiseCoding,
          optimiseScans: argv.optimise || argv.optimiseScans,
          overshootDeringing: argv.optimise || argv.overshootDeringing,
          progressive: argv.progressive,
          quality: argv.quality,
          quantisationTable: argv.quantisationTable,
          trellisQuantisation: argv.optimise || argv.trellisQuantisation
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#png
    if (argv.adaptiveFiltering || argv.colors || argv.compressionLevel ||
      argv.dither || argv.effort || argv.palette || argv.progressive) {
      queue.unshift(['png', (sharp) => {
        return sharp.png({
          adaptiveFiltering: argv.adaptiveFiltering,
          colors: argv.colors,
          compressionLevel: argv.compressionLevel,
          dither: argv.dither,
          effort: argv.effort,
          force: false,
          palette: argv.palette,
          progressive: argv.progressive
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#tiff
    if (argv.bitdepth ||
      argv.compression !== optimizationOptions.compression.default ||
      argv.predictor !== optimizationOptions.predictor.default ||
      argv.miniswhite || argv.pyramid || argv.quality || argv.resolutionUnit ||
      argv.tileBackground || argv.tileHeight || argv.tileWidth || argv.xres || argv.yres) {
      queue.unshift(['tiff', (sharp) => {
        return sharp.tiff({
          background: argv.tileBackground,
          bitdepth: argv.bitdepth,
          compression: argv.compression,
          force: false,
          miniswhite: argv.miniswhite,
          predictor: argv.predictor,
          pyramid: argv.pyramid,
          quality: argv.quality,
          resolutionUnit: argv.resolutionUnit,
          tile: argv.tileWidth !== undefined || argv.tileHeight !== undefined,
          tileHeight: argv.tileHeight || argv.tileWidth,
          tileWidth: argv.tileWidth || argv.tileHeight,
          xres: argv.xres,
          yres: argv.yres
        })
      }])
    }

    // @see https://sharp.pixelplumbing.com/api-output#webp
    if (argv.alphaQuality || argv.quality || argv.lossless || argv.minSize ||
      argv.mixed || argv.nearLossless || argv.effort ||
      argv.preset !== optimizationOptions.preset.default || argv.smartDeblock ||
      argv.smartSubsample) {
      queue.unshift(['webp', (sharp) => {
        return sharp.webp({
          alphaQuality: argv.alphaQuality,
          effort: argv.effort,
          force: false,
          lossless: argv.lossless,
          minSize: argv.minSize,
          mixed: argv.mixed,
          nearLossless: argv.nearLossless,
          preset: argv.preset,
          quality: argv.quality,
          smartDeblock: argv.smartDeblock,
          smartSubsample: argv.smartSubsample
        })
      }])
    }

    // Invoke with remaining arguments (if any).
    const { '--': remainingargv = [] } = argv
    if (remainingargv.length > 0) {
      return recursiveParse(remainingargv, {
        ...context,
        ...pick(argv, Object.keys(options)) // Retain options.
      })
    }
    return argv
  })
}
