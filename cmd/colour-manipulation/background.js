/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mark van Seventer
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

// @see http://sharp.pixelplumbing.com/en/stable/api-colour/#background

// Strict mode.
'use strict'

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const options = {
  embed: {
    choices: constants.GRAVITY,
    default: 'centre',
    desc: 'Preserving aspect ratio, resize the image to the maximum width or height specified then embed on the background of the exact width and height specified',
    nargs: 1,
    type: 'string'
  },
  extend: {
    desc: 'Extends/pads the edges of the image with the colour in the background',
    defaultDescription: 'top, right, bottom, left',
    nargs: 4,
    type: 'array'
  },
  flatten: {
    desc: 'Merge alpha transparency channel with the background',
    type: 'boolean'
  },
  rgba: {
    desc: 'String parsed by the color module to extract values for red, green, blue and alpha',
    type: 'string'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 background rgba(0,0,0,0) --embed centre', 'The output will be embedded on a transparent canvas')
    .example('$0 background rgba(0,0,0,0) --extend 10 20 10 10', 'The output will have 10 transparent pixels to the top, left, and right edges and 20 to the bottom edge')
    .example('$0 background rgba(0,0,0,0) --flatten')
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/en/stable/api-colour/#background')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  // @see http://sharp.pixelplumbing.com/en/stable/api-colour/#background
  queue.push([ 'background', (sharp) => sharp.background(args.rgba) ])

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#embed
  if (args.embed !== options.embed.default) {
    queue.push([ 'embed', (sharp) => sharp.embed(args.embed) ])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-operation/#extend
  if (args.extend) {
    queue.push([ 'extend', (sharp) => {
      const [ top, right, bottom, left ] = args.extend
      return sharp.extend({ top, bottom, left, right })
    }])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-operation/#flatten
  if (args.flatten) {
    queue.push([ 'flatten', (sharp) => sharp.flatten() ])
  }

  // Return the queue.
  return queue
}

// Exports.
module.exports = {
  command: 'background <rgba>',
  describe: 'Set the background to embed, extend, or flatten the image with',
  builder,
  handler
}
