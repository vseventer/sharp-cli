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

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  sigma: {
    desc: 'The sigma of the Gaussian mask',
    defaultDescription: '1 + radius / 2',
    type: 'number'
  }
}

const options = {
  m1: {
    alias: 'flat',
    desc: 'The level of sharpening to apply to "flat" areas',
    defaultDescription: 1.0,
    type: 'number'
  },
  m2: {
    alias: 'jagged',
    desc: 'The level of sharpening to apply to "jagged" areas',
    defaultDescription: 2.0,
    type: 'number'
  },
  x1: {
    desc: 'The threshold between "flat" and "jagged" areas',
    defaultDescription: 2.0,
    type: 'number'
  },
  y2: {
    desc: 'The maximum amount of brightening',
    defaultDescription: 10.0,
    type: 'number'
  },
  y3: {
    desc: 'The maximum amount of darkening',
    defaultDescription: 20.0,
    type: 'number'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 sharpen')
    .example('$0 sharpen 2')
    .example('$0 sharpen 2 --m1 0 --m2 3 --x1 3 --y2 15 --y3 15')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#sharpen')
    .positional('sigma', positionals.sigma)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const options = {
    ...pick(args, Object.keys(positionals)),
    ...pick(args, optionNames)
  }

  return queue.push(['sharpen', (sharp) => {
    if (Object.keys(options).length === 0) {
      return sharp.sharpen()
    }
    return sharp.sharpen(options)
  }])
}

// Exports.
module.exports = {
  command: 'sharpen [sigma]',
  describe: 'Sharpen the image',
  builder,
  handler
}
