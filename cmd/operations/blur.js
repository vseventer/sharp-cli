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

// @see https://sharp.pixelplumbing.com/api-operation#blur

// Strict mode.
'use strict'

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
  minAmplitude: {
    defaultDescription: 0.2,
    desc: 'A smaller value will generate a larger, more accurate mask',
    type: 'number'
  },
  precision: {
    choices: ['approximate', 'float', 'integer'],
    defaultDescription: 'integer',
    desc: 'How accurate the operation should be'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 blur', 'The output will be a fast 3x3 box blurred image')
    .example('$0 blur 5', 'The output will be a slower but more accurate Gaussian blurred image')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#blur')
    .positional('sigma', positionals.sigma)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['blur', (sharp) => {
    if (args.minAmplitude || args.precision) {
      return sharp.blur({
        minAmplitude: args.minAmplitude,
        precision: args.precision,
        sigma: args.sigma
      })
    }
    return sharp.blur(args.sigma)
  }])
}

// Exports.
module.exports = {
  command: 'blur [sigma]',
  describe: 'Blur the image',
  builder,
  handler
}
