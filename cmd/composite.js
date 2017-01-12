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

// Local modules.
const baseHandler = require('../lib/handler')
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
    type: 'string'
  },
  left: {
    desc: 'The pixel offset from the left edge',
    type: 'number'
  },
  overlay: { // Hidden option.
    // desc: 'Path to an image file',
    normalize: true,
    type: 'string'
  },
  tile: {
    desc: 'Repeat the overlay image across the entire image with the given gravity',
    type: 'boolean'
  },
  top: {
    desc: 'The pixel offset from the top edge',
    type: 'number'
  }
}

// Command handler.
const handler = (args) => {
  // @see http://sharp.dimens.io/en/stable/api-composite/#overlaywith
  return queue.push([ 'overlayWith', (sharp) => {
    return sharp.overlayWith(args.overlay, {
      gravity: args.gravity,
      top: args.top,
      left: args.left,
      tile: args.tile,
      cutout: args.cutout
    })
  }])
}

// Exports.
module.exports = {
  command: 'overlayWith <overlay>',
  describe: 'Overlay (composite) an image over the processed (resized, extracted etc.) image',
  builder: (yargs) => yargs.strict().options(options),
  handler: baseHandler(handler)
}
