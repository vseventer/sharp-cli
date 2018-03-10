/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mark van Seventer
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

// @see http://sharp.pixelplumbing.com/en/stable/api-resize/

// Strict mode.
'use strict'

// Local modules.
const constants = require('../lib/constants')
const queue = require('../lib/queue')

// Configure.
const options = {
  crop: {
    choices: [ ...constants.GRAVITY, ...constants.STRATEGY, undefined ],
    defaultDescription: 'centre',
    desc: 'Crop to an edge/corner, or crop dynamically',
    nargs: 1,
    type: 'string'
  },
  fastShrinkOnLoad: {
    default: true,
    desc: 'Take greater advantage of the JPEG and WebP shrink-on-load feature',
    type: 'boolean'

  },
  height: {
    desc: 'Number of pixels wide the resultant image should be',
    type: 'number'
  },
  ignoreAspectRatio: {
    desc: 'Ignoring the aspect ratio of the input, stretch the image to the exact width and/or height',
    type: 'boolean'
  },
  kernel: {
    choices: constants.KERNEL,
    default: 'lanczos3',
    desc: 'The kernel to use for image reduction',
    nargs: 1,
    type: 'string'
  },
  max: {
    desc: 'Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to the width and height specified',
    type: 'boolean'
  },
  min: {
    desc: 'Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to the width and height specified',
    type: 'boolean'
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
    .example('$0 resize 200 300 --kernel lanczos2', 'The output will be 200 pixels wide and 300 pixels high containing a lanczos2 scaled version of the input')
    .example('$0 resize 200 200 --crop entropy', 'The output will be a 200px square auto-cropped image')
    .example('$0 resize 200 200 --max', 'The output will be no wider than 200 pixels and no higher than 200 pixels regardless of the input image dimensions')
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/en/stable/api-resize/')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const width = args.width === 0 ? null : args.width // Auto-scale.
  const height = args.height === 0 ? null : (args.height || width) // Auto-scale or square.

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#resize
  queue.push([ 'resize', (sharp) => {
    return sharp.resize(width, height, {
      fastShrinkOnLoad: args.fastShrinkOnLoad,
      kernel: args.kernel
    })
  }])

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#crop
  if (args.crop) {
    queue.push([ 'crop', (sharp) => sharp.crop(args.crop) ])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#max
  if (args.max) {
    queue.push([ 'max', (sharp) => sharp.max() ])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#min
  if (args.min) {
    queue.push([ 'min', (sharp) => sharp.min() ])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#ignoreaspectratio
  if (args.ignoreAspectRatio) {
    queue.push([ 'ignoreAspectRatio', (sharp) => sharp.ignoreAspectRatio() ])
  }

  // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#withoutenlargement
  if (args.withoutEnlargement) {
    queue.push([ 'withoutEnlargement', (sharp) => sharp.withoutEnlargement(args.withoutEnlargement) ])
  }

  // Return the queue.
  return queue
}

// Exports.
module.exports = {
  command: 'resize <width> [height]',
  describe: 'Resize image to width × height',
  builder,
  handler
}
