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

// @see https://sharp.dimens.io/api-resize#extend

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  bottom: {
    desc: 'Pixel count to add to the bottom edge',
    type: 'number'
  },
  left: {
    desc: 'Pixel count to add to the left edge',
    type: 'number'
  },
  right: {
    desc: 'Pixel count to add to the right edge',
    type: 'number'
  },
  top: {
    desc: 'Pixel count to add to the top edge',
    type: 'number'
  }
}

const options = {
  background: {
    defaultDescription: 'rgba(0, 0, 0, 1)',
    desc: 'Background colour, parsed by the color module',
    type: 'string'
  },
  extendWith: {
    choices: constants.EXTEND_WITH,
    default: 'background',
    desc: 'Populate new pixels using this method'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 extend 10 20 10 10 --background rgba(0,0,0,0)', 'Add 10 transparent pixels to the top, left, and right edges, and 20 to the bottom edge')
    .example('$0 extend 0 10 0 0 --background red', 'Add 10 red pixels to the bottom edge.')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/api-resize#extend')
    .positional('top', positionals.top)
    .positional('bottom', positionals.bottom)
    .positional('left', positionals.left)
    .positional('right', positionals.right)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['extend', (sharp) => {
    return sharp.extend({
      background: args.background,
      extendWith: args.extendWith,
      ...pick(args, Object.keys(positionals))
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
