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

// @see https://sharp.pixelplumbing.com/api-resize/

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  width: {
    default: null,
    desc: 'Pixels wide the resultant image should be',
    type: 'number'
  },
  height: {
    default: null,
    desc: 'Pixels high the resultant image should be',
    type: 'number'
  }
}

const options = {
  background: {
    defaultDescription: 'rgba(0, 0, 0, 1)',
    desc: 'Background colour when fit is contain, parsed by the color module.',
    type: 'string'
  },
  fastShrinkOnLoad: {
    defaultDescription: true,
    desc: 'Take greater advantage of the JPEG and WebP shrink-on-load feature',
    type: 'boolean'
  },
  fit: {
    choices: constants.FIT,
    defaultDescription: 'cover',
    desc: 'How the image should be resized to fit both provided dimensions'
  },
  kernel: {
    choices: constants.KERNEL,
    defaultDescription: 'lanczos3',
    desc: 'The kernel to use for image reduction and the inferred interpolator to use for upsampling'
  },
  position: {
    choices: [...constants.GRAVITY, ...constants.POSITION, ...constants.STRATEGY],
    defaultDescription: 'centre',
    desc: 'Position, gravity, or strategy to use when fit is cover or contain'
  },
  withoutEnlargement: {
    desc: 'Do not enlarge if the width or height are already less than the specified dimensions',
    type: 'boolean'
  },
  withoutReduction: {
    desc: 'Do not reduce if the width or height are already greater than the specified dimensions',
    type: 'boolean'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 resize 100', 'The output will be 100 pixels wide, auto-scaled height')
    .example('$0 resize --height 100', 'The output will be 100 pixels high, auto-scaled width')
    .example('$0 resize 200 300 --background rgba(255,255,255,0.5) --fit contain --kernel nearest --position "right top"', 'The output will be 200 pixels wide and 300 pixels high containing a nearest-neighbour scaled version contained within the north-east corner of a semi-transparent white canvas')
    .example('$0 resize 200 200 --fit cover --position entropy', 'The output will be a 200px square auto-cropped image')
    .example('$0 resize 200 200 --withoutEnlargement', 'The output will be no wider and no higher than 200 pixels, and no larger than the input image')
    .example('$0 resize 200 200 --withoutReduction', 'The output will be at least 200 pixels wide and 200 pixels high while maintaining aspect ratio, and no smaller than the input image')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-resize/')
    .positional('width', positionals.width)
    .positional('height', positionals.height)
    .check(argv => {
      if (argv.width === null && argv.height === null) {
        throw new Error('Expected at least one of width and height positionals')
      }
      return true
    })
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  // @see https://sharp.pixelplumbing.com/api-resize#resize
  return queue.push(['resize', (sharp) => {
    return sharp.resize(args.width, args.height, pick(args, optionNames))
  }])
}

// Exports.
module.exports = {
  command: 'resize [width] [height]',
  describe: 'Resize image to width, height, or width × height',
  builder,
  handler
}
