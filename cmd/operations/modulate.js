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

// @see http://sharp.pixelplumbing.com/en/stable/api-operation/#modulate

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  brightness: {
    defaultDescription: 1,
    desc: 'Brightness multiplier',
    type: 'number'
  },
  saturation: {
    defaultDescription: 1,
    desc: 'Saturation multiplier',
    type: 'number'
  },
  hue: {
    defaultDescription: '0',
    desc: 'Degrees for hue rotation',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/en/stable/api-operation/#modulate')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  const options = { }
  if (undefined !== args.brightness) options.brightness = args.brightness
  if (undefined !== args.saturation) options.saturation = args.saturation
  if (undefined !== args.hue) options.hue = args.hue
  return queue.push(['modulate', (sharp) => {
    return sharp.modulate(options)
  }])
}

// Exports.
module.exports = {
  command: 'modulate',
  describe: 'Transforms the image using brightness, saturation and hue rotation',
  builder,
  handler
}
