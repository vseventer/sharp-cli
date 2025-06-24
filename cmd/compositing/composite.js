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

// @see http://sharp.pixelplumbing.com/api-composite#composite

// Strict mode.
'use strict'

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Helpers.
function getValueAt (arrayLike, index) {
  if (Array.isArray(arrayLike)) {
    return arrayLike[Math.min(index, arrayLike.length - 1)]
  }
  return arrayLike
}

function hasOwnProperty (obj, prop) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, prop)
}

// Configure.
const positionals = {
  images: {
    desc: 'Path to an image file',
    normalize: true,
    type: 'string'
  }
}

const options = {
  blend: {
    choices: constants.BLEND,
    defaultDescription: 'over',
    desc: 'How to blend this image with the image below'
  },
  create: {
    desc: 'Describes a blank overlay to be created',
    hidden: true,
    type: 'boolean'
  },
  'create.background': {
    desc: 'Background of the blank overlay to be created, parsed by the color module',
    type: 'string'
  },
  'create.channels': {
    choices: [3, 4],
    default: 3,
    desc: 'Number of channels of the blank overlay to be created'
  },
  'create.height': {
    desc: 'Height of the blank overlay to be created',
    type: 'number'
  },
  'create.width': {
    desc: 'Width of the blank overlay to be created',
    type: 'number'
  },
  density: {
    desc: 'Number representing the DPI for vector images',
    defaultDescription: 72,
    type: 'number'
  },
  gravity: {
    choices: constants.GRAVITY,
    defaultDescription: 'centre',
    desc: 'Gravity at which to place the overlay'
  },
  left: {
    desc: 'The pixel offset from the left edge',
    implies: 'top',
    type: 'number'
  },
  premultiplied: {
    desc: 'Avoid premultiplying the image',
    type: 'boolean'
  },
  tile: {
    desc: 'Repeat the overlay image across the entire image with the given gravity',
    type: 'boolean'
  },
  top: {
    desc: 'The pixel offset from the top edge',
    implies: 'left',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 composite ./input.png --gravity southeast', 'The output will be the input composited with ./input.png with SE gravity')
    .example('$0 composite ./layer1.png --gravity northwest ./layer2.png --gravity southeast', 'The output will be the input composited with ./layer1.png with NW gravity and ./layer2.png with SE gravity')
    .example('$0 composite ./overlay.png --tile --blend saturate', 'The output will be the input composited with ./overlay.png saturated over the entire image')
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/api-composite#composite')
    .positional('images', positionals.images)
    .check(argv => {
      if ((!argv.images || argv.images.length === 0) && !hasOwnProperty(argv.create, 'width')) {
        throw new Error('Expected at least one of images positional or create option')
      }
      return true
    })
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  if ((hasOwnProperty(args.create, 'width') && !hasOwnProperty(args.create, 'height')) ||
   (hasOwnProperty(args.create, 'height') && !hasOwnProperty(args.create, 'width'))) {
    throw new Error('Expected both of create.width and create.height options')
  }

  const inputs = []
  if (hasOwnProperty(args.create, 'width')) {
    const { channels, background, width, height } = args.create
    const length = Math.max(width.length ?? 0, height.length ?? 0)
    if (length > 0) { // Width or height (or both) is an array.
      inputs.push(...Array.from({ length }, (_, idx) => idx).map(idx => ({
        create: {
          width: getValueAt(width, idx),
          height: getValueAt(height, idx),
          channels: getValueAt(channels, idx),
          background: getValueAt(background, idx)
        }
      })))
    } else { // Both width and height are numbers.
      inputs.push({ create: args.create })
    }
  }
  if (args.images) inputs.push(...args.images)

  // @see http://sharp.pixelplumbing.com/api-composite#composite
  return queue.push(['composite', (sharp) => {
    return sharp.composite(
      inputs.map((input, idx) => ({
        animated: args.animated,
        autoOrient: args.autoOrient,
        blend: getValueAt(args.blend, idx),
        density: getValueAt(args.density, idx),
        failOn: args.failOn,
        gravity: getValueAt(args.gravity, idx),
        ignoreIcc: getValueAt(args.ignoreIcc),
        input,
        left: getValueAt(args.left, idx),
        limitInputPixels: args.limitInputPixels,
        pdfBackground: args.pdfBackground,
        premultiplied: getValueAt(args.premultiplied, idx),
        tile: getValueAt(args.tile, idx),
        top: getValueAt(args.top, idx)
      }))
    )
  }])
}

// Exports.
module.exports = {
  command: 'composite [images..]',
  describe: 'Composite image(s) over the processed (resized, extracted etc.) image',
  builder,
  handler
}
