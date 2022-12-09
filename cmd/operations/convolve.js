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

// @see https://sharp.pixelplumbing.com/api-operation#convolve

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  height: {
    desc: 'Height of the kernel in pixels',
    type: 'number'
  },
  kernel: {
    desc: 'Array of length width × height containing the kernel values',
    defaultDescription: '"-1 0 1 -2 0 2 -1 0 1"',
    type: 'number'
  },
  width: {
    desc: 'Width of the kernel in pixels',
    type: 'number'
  }
}
const positionalNames = Object.keys(positionals)

const options = {
  scale: {
    desc: 'The scale of the kernel in pixels',
    defaultDescription: 'sum',
    type: 'number'
  },
  offset: {
    desc: 'The offset of the kernel in pixels',
    defaultDescription: '0',
    type: 'number'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 convolve 3 3 "-1 0 1 -2 0 2 -1 0 1"', 'The output will be the convolution of the input image with the horizontal Sobel operator')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#convolve')
    .check(argv => {
      const length = argv.width * argv.height
      if (!(Array.isArray(argv.kernel) && argv.kernel.length === length)) {
        throw new Error(`Expected kernel positional to have ${length} values`)
      }
      return true
    })
    .options(options)
    .positional('kernel', positionals.kernel)
    .positional('height', positionals.height)
    .positional('width', positionals.width)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['convolve', (sharp) => {
    return sharp.convolve({
      ...pick(args, positionalNames),
      ...pick(args, optionNames)
    })
  }])
}

// Exports.
module.exports = {
  command: 'convolve <width> <height> <kernel..>',
  describe: 'Convolve the image with the specified kernel',
  builder,
  handler
}
