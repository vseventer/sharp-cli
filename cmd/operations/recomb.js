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

// @see https://sharp.dimens.io/en/stable/api-operation/#recomb

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  matrix: {
    desc: 'Recombination matrix',
    type: 'string'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 recomb "0.3588 0.7044 0.1368 0.2990 0.5870 0.1140 0.2392 0.4696 0.0912"', 'The recomb will be applied to the output, in this case a sepia filter has been applied')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/en/stable/api-operation/#recomb')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const matrix = args.matrix.split(' ').map((el) => parseFloat(el))

  return queue.push(['recomb', (sharp) => {
    return sharp.recomb([
      matrix.slice(0, 3),
      matrix.slice(3, 6),
      matrix.slice(6, 9)
    ])
  }])
}

// Exports.
module.exports = {
  command: 'recomb <matrix>',
  describe: 'Recomb the image with the specified matrix',
  builder,
  handler
}
