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

// @see https://sharp.pixelplumbing.com/api-operation#sharpen

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  m1: {
    alias: 'flat',
    desc: 'The level of sharpening to apply to "flat" areas',
    defaultDescription: '1.0',
    nargs: 1,
    type: 'number'
  },
  m2: {
    alias: 'jagged',
    desc: 'The level of sharpening to apply to "jagged" areas',
    defaultDescription: '2.0',
    nargs: 1,
    type: 'number'
  },
  sigma: {
    desc: 'The sigma of the Gaussian mask',
    defaultDescription: '1 + radius / 2',
    type: 'number'
  },
  x1: {
    desc: 'The threshold between "flat" and "jagged" areas',
    defaultDescription: '2.0',
    nargs: 1,
    type: 'number'
  },
  y2: {
    desc: 'The maximum amount of brightening',
    defaultDescription: '10.0',
    nargs: 1,
    type: 'number'
  },
  y3: {
    desc: 'The maximum amount of darkening',
    defaultDescription: '20.0',
    nargs: 1,
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#sharpen')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['sharpen', (sharp) => {
    if (args.sigma || args.m1 || args.m2 || args.x1 || args.y2 || args.y3) {
      return sharp.sharpen({
        sigma: args.sigma,
        m1: args.m1,
        m2: args.m2,
        x1: args.x1,
        y2: args.y2,
        y3: args.y3
      })
    }
    return sharp.sharpen()
  }])
}

// Exports.
module.exports = {
  command: 'sharpen [sigma]',
  describe: 'Sharpen the image',
  builder,
  handler
}
