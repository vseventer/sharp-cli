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

// @see http://sharp.dimens.io/en/stable/api-composite/

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Local modules.
const constants = require('../lib/constants')
const queue = require('../lib/queue')

// Configure.
const options = {
  cutout: {
    desc: 'Apply only the alpha channel of the overlay image to the input image, giving the appearance of one image being cut out of another',
    type: 'boolean'
  },
  gravity: {
    choices: constants.GRAVITY,
    desc: 'Gravity at which to place the overlay',
    defaultDescription: 'centre',
    nargs: 1,
    type: 'string'
  },
  offset: {
    desc: 'The pixel offset from the top and left edges',
    nargs: 2,
    type: 'array'
  },
  overlay: { // Hidden option.
    coerce: path.normalize, // Positional arguments need manual normalization.
    // desc: 'Path to an image file',
    normalize: true,
    type: 'string'
  },
  tile: {
    desc: 'Repeat the overlay image across the entire image with the given gravity',
    type: 'boolean'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 overlayWith ./input.png --gravity southeast', 'The output will be the input composited with ./input.png with SE gravity')
    .epilog('For more information on available options, please visit http://sharp.dimens.io/en/stable/api-composite/')
    .options(options)
}

// Command handler.
const handler = (args) => {
  const [ top, left ] = args.offset || [ ]

  // @see http://sharp.dimens.io/en/stable/api-composite/#overlaywith
  return queue.push([ 'overlayWith', (sharp) => {
    return sharp.overlayWith(args.overlay, {
      gravity: args.gravity,
      top,
      left,
      tile: args.tile,
      cutout: args.cutout
    })
  }])
}

// Exports.
module.exports = {
  command: 'overlayWith <overlay>',
  describe: 'Overlay (composite) an image over the processed (resized, extracted etc.) image',
  builder,
  handler
}
