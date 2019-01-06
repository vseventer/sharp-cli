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

// @see https://sharp.dimens.io/en/stable/api-resize/#extend

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  background: {
    defaultDescription: 'rgba(0, 0, 0, 1)',
    desc: 'Background colour, parsed by the color module',
    type: 'string'
  },
  bottom: {
    desc: 'Offset from the bottom edge',
    type: 'number'
  },
  left: {
    desc: 'Offset from the left edge',
    type: 'number'
  },
  right: {
    desc: 'Offset from the right edge',
    type: 'number'
  },
  top: {
    desc: 'Offset from the top edge',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 extend 10 20 10 10 rgba(0,0,0,0)', 'Add 10 transparent pixels to the top, left, and right edges, and 20 to the bottom edge')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/en/stable/api-resize/#extend')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push([ 'extend', (sharp) => {
    return sharp.extend({
      background: args.background,
      bottom: args.bottom,
      left: args.left,
      right: args.right,
      top: args.top
    })
  }])
}

// Exports.
module.exports = {
  command: 'extend <top> <bottom> <left> <right>',
  describe: 'Extends/pads the edges of the image with the provided background colour',
  builder,
  handler
}
