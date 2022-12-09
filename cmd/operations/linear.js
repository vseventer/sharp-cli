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

// @see https://sharp.pixelplumbing.com/api-operation#linear

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  multiplier: {
    desc: 'Multiplier',
    default: 1.0,
    type: 'number'
  }
}

const options = {
  offset: {
    desc: 'Offset',
    type: 'array'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 linear 0.5 --offset 2')
    .example('$0 linear 0.25 0.5 0.75 --offset 150 100 50')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#linear')
    .positional('multiplier', positionals.multiplier)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const multiplier = args.multiplier.length === 1 ? args.multiplier[0] : args.multiplier
  return queue.push(['linear', (sharp) => sharp.linear(multiplier, args.offset)])
}

// Exports.
module.exports = {
  command: 'linear [multiplier..]',
  describe: 'Apply the linear formula a × input + b to the image to adjust image levels',
  builder,
  handler
}
