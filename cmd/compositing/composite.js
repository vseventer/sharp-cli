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

// @see http://sharp.pixelplumbing.com/en/stable/api-composite/#composite

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const options = {
  blend: {
    choices: constants.BLEND,
    default: 'over',
    desc: 'How to blend this image with the image below',
    nargs: 1,
    type: 'string'
  },
  create: {
    desc: 'Describes a blank overlay to be created',
    defaultDescription: 'width, height, channels, background',
    nargs: 4,
    type: 'array'
  },
  density: {
    desc: 'Number representing the DPI for vector images',
    defaultDescription: 72,
    nargs: 1,
    type: 'number'
  },
  gravity: {
    choices: constants.GRAVITY,
    default: 'centre',
    desc: 'Gravity at which to place the overlay',
    nargs: 1,
    type: 'string'
  },
  image: {
    coerce: path.normalize, // Positional arguments need manual normalization.
    desc: 'Path to an image file',
    normalize: true,
    type: 'string'
  },
  offset: {
    desc: 'The pixel offset from the top and left edges',
    nargs: 2,
    type: 'array'
  },
  premultiplied: {
    desc: 'Avoid premultiplying the image',
    type: 'boolean'
  },
  tile: {
    desc: 'Repeat the overlay image across the entire image with the given gravity',
    type: 'boolean'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 composite ./input.png --gravity southeast', 'The output will be the input composited with ./input.png with SE gravity')
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/en/stable/api-composite/#composite')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const [top, left] = args.offset || []
  const [width, height, channels, background] = args.create || []

  // @see http://sharp.pixelplumbing.com/en/stable/api-composite/#composite
  return queue.push(['composite', (sharp) => {
    return sharp.composite([{
      input: args.image,
      blend: args.blend,
      create: args.create && { width, height, channels, background },
      density: args.density,
      gravity: args.gravity,
      left,
      premultiplied: args.premultiplied,
      tile: args.tile,
      top
    }])
  }])
}

// Exports.
module.exports = {
  command: 'composite <image>',
  describe: 'Composite image over the processed (resized, extracted etc.) image',
  builder,
  handler
}
