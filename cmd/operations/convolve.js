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

// @see https://sharp.pixelplumbing.com/en/stable/api-operation/#convolve

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  height: {
    desc: 'Height of the kernel',
    type: 'number'
  },
  kernel: {
    desc: 'Array of length width × height containing the kernel values',
    defaultDescription: '"-1 0 1 -2 0 2 -1 0 1"',
    type: 'string'
  },
  scale: {
    desc: 'The scale of the kernel',
    defaultDescription: 'sum',
    nargs: 1,
    type: 'number'
  },
  offset: {
    desc: 'The offset of the kernel',
    nargs: 1,
    type: 'number'
  },
  width: {
    desc: 'Width of the kernel',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 convolve 3 3 "-1 0 1 -2 0 2 -1 0 1"', 'The output will be the convolution of the input image with the horizontal Sobel operator')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/en/stable/api-operation/#convolve')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const kernel = args.kernel.split(' ').map((el) => parseInt(el, 10))

  return queue.push(['convolve', (sharp) => {
    return sharp.convolve({
      width: args.width,
      height: args.height,
      kernel,
      scale: args.scale,
      offset: args.offset
    })
  }])
}

// Exports.
module.exports = {
  command: 'convolve <width> <height> <kernel>',
  describe: 'Convolve the image with the specified kernel',
  builder,
  handler
}
