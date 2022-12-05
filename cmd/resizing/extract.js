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

// @see https://sharp.dimens.io/api-resize#extract

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  height: {
    desc: 'Height of region to extract',
    type: 'number'
  },
  left: {
    desc: 'Zero-indexed offset from left edge',
    type: 'number'
  },
  top: {
    desc: 'Zero-indexed offset from top edge',
    type: 'number'
  },
  width: {
    desc: 'Width of region to extract',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .epilog('For more information on available options, please visit https://sharp.dimens.io/api-resize#extract')
    .positional('top', positionals.top)
    .positional('left', positionals.left)
    .positional('width', positionals.width)
    .positional('height', positionals.height)
}

// Command handler.
const handler = (args) => {
  return queue.push(['extract', (sharp) => {
    return sharp.extract(pick(args, Object.keys(positionals)))
  }])
}

// Exports.
module.exports = {
  command: 'extract <top> <left> <width> <height>',
  describe: 'Extract a region of the image',
  builder,
  handler
}
