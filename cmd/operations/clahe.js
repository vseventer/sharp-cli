/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Mark van Seventer
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

// @see https://sharp.pixelplumbing.com/api-operation#clahe

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  height: {
    desc: 'Height of the region',
    type: 'number'
  },
  width: {
    desc: 'Width of the region',
    type: 'number'
  }
}

const options = {
  maxSlope: {
    defaultDescription: 3,
    desc: 'Maximum value for the slope of the cumulative histogram',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 clahe 3 3')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#clahe')
    .positional('height', positionals.height)
    .positional('width', positionals.width)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['clahe', (sharp) => {
    return sharp.clahe({
      width: args.width,
      height: args.height,
      maxSlope: args.maxSlope
    })
  }])
}

// Exports.
module.exports = {
  command: 'clahe <width> <height>',
  describe: 'Perform contrast limiting adaptive histogram equalization CLAHE',
  builder,
  handler
}
