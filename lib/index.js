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

// Local modules.
const globalHandler = require('./handler')

// Global options.
const group = 'Global Options'
const options = {
  // @see http://sharp.dimens.io/en/stable/api-constructor/
  input: {
    alias: 'i',
    defaultDescription: 'stdin',
    demand: process.stdin.isTTY, // Demand unless stdin.
    desc: 'Path to (an) image file(s)',
    global: true,
    group: group,
    implies: 'output',
    normalize: true,
    type: 'array'
  },

  // @see http://sharp.dimens.io/en/stable/api-input/#limitinputpixels
  limitInputPixels: {
    alias: 'l',
    defaultDescription: 0x3FFF * 0x3FFF,
    desc: 'Do not process input images where the number of pixels (width x height) exceeds this limit',
    global: true,
    group: group,
    type: 'number'
  },

  // @see http://sharp.dimens.io/en/stable/api-input/#sequentialread
  sequentialRead: {
    desc: 'An advanced setting that switches the libvips access method to VIPS_ACCESS_SEQUENTIAL',
    global: true,
    group: group,
    type: 'boolean'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/
  output: {
    alias: 'o',
    defaultDescription: 'stdout',
    desc: 'Directory to write the image files to',
    global: true,
    group: group,
    normalize: true,
    type: 'string'
  },

  // @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
  withMetadata: {
    alias: 'm',
    desc: 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image',
    global: true,
    group: group,
    type: 'boolean'
  }
}

// Configure.
const cli = yargs
  .strict()
  .usage('$0 [command..] [options]')
  .example('$0 resize 300 200 -i ./input.jpg -o ./', 'output.jpg will be a 300 pixels wide and 200 pixels high image containing a scaled and cropped version of input.jpg')
  .example('$0 rotate 180 -- resize 300 -- background "#ff6600" --flatten -- overlayWith ./overlay.png --gravity southeast -- sharpen -mq 90 -i ./input.jpg -o ./', 'output.jpg will be an upside down, 300px wide, alpha channel flattened onto orange background, composited with overlay.png with SE gravity, sharpened, with metadata, 90% quality version of input.jpg')
  .epilog('For more information on available options, please visit http://sharp.dimens.io/')

  // Error handling.
  .check((argv) => !(argv.input && argv.input.length === 0)) // Require at least one input file.
  .showHelpOnFail(false)
  .fail((msg, err) => {
    if (err) throw err // Preserve stack.
    console.log(msg)
    console.log()
    console.log('Specify --help for available options')
    process.exit(1) // Exit with error.
  })

  // Built-in options.
  .help().alias('help', 'h')
  .version().alias('version', 'v')
  .group([ 'help', 'version' ], group)

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
  .command(require('../cmd/colour-manipulation/tocolourspace'))
  .command(require('../cmd/operations/trim'))

// Exports.
module.exports = (argv) => {
  // Parse arguments, add global options only to last command run.
  const args = multiyargs(cli, argv, (hasNext) => hasNext || cli.options(options))
  const lastCommandArgs = args.pop() // Extract.

  // Run.
  const promises = globalHandler(lastCommandArgs)
  Promise
    .all(promises)
    .catch((err) => console.error(err, err.toString()))
}
