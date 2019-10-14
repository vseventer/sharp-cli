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

// @see https://sharp.pixelplumbing.com/en/stable/api-resize/

// Strict mode.
'use strict'

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const options = {
  background: {
    defaultDescription: 'rgba(0, 0, 0, 1)',
    desc: 'Background colour when using a fit of contain, parsed by the color module.',
    type: 'string'
  },
  fastShrinkOnLoad: {
    default: true,
    desc: 'Take greater advantage of the JPEG and WebP shrink-on-load feature',
    type: 'boolean'

  },
  fit: {
    choices: constants.FIT,
    default: 'cover',
    desc: 'How the image should be resized to fit both provided dimensions',
    nargs: 1,
    type: 'string'
  },
  height: {
    desc: 'Number of pixels wide the resultant image should be',
    type: 'number'
  },
  kernel: {
    choices: constants.KERNEL,
    default: 'lanczos3',
    desc: 'The kernel to use for image reduction',
    nargs: 1,
    type: 'string'
  },
  position: {
    choices: [...constants.GRAVITY, ...constants.POSITION, ...constants.STRATEGY],
    default: 'centre',
    desc: 'Position, gravity, or strategy to use when fit is cover or contain',
    nargs: 1,
    type: 'string'
  },
  width: {
    desc: 'Number of pixels high the resultant image should be',
    type: 'number'
  },
  withoutEnlargement: {
    desc: 'Do not enlarge the output image if the input image width or height are already less than the required dimensions',
    type: 'boolean'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 resize --height 100', 'The output will be 100 pixels high, auto-scaled width')
    .example('$0 resize 200 300 --background rgba(255,255,255,0.5) --fit contain --kernel nearest --position "right top"', 'The output will be 200 pixels wide and 300 pixels high containing the nearest-neighbour scaled version contained within the north-east corner of a semi-transparent white canvas')
    .example('$0 resize 200 200 --fit cover --position entropy', 'The output will be a 200px square auto-cropped image')
    .example('$0 resize 200 200 --withoutEnlargement', 'The output will be no wider and no higher than 200 pixels, and no larger than the input image')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/en/stable/api-resize/')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const width = args.width === 0 ? null : args.width // Auto-scale.
  const height = args.height === 0 ? null : (args.height || width) // Auto-scale or square.

  // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
  return queue.push(['resize', (sharp) => {
    return sharp.resize({
      background: args.background,
      fastShrinkOnLoad: args.fastShrinkOnLoad,
      fit: args.fit,
      height,
      kernel: args.kernel,
      position: args.position,
      width,
      withoutEnlargement: args.withoutEnlargement
    })
  }])
}

// Exports.
module.exports = {
  command: 'resize <width> [height]',
  describe: 'Resize image to width × height',
  builder,
  handler
}
