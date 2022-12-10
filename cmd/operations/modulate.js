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

// @see http://sharp.pixelplumbing.com/api-operation#modulate

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const options = {
  brightness: {
    desc: 'Brightness multiplier',
    type: 'number'
  },
  hue: {
    desc: 'Degrees for hue rotation',
    type: 'number'
  },
  lightness: {
    desc: 'Lightness addend',
    type: 'number'
  },
  saturation: {
    desc: 'Saturation multiplier',
    type: 'number'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 modulate --brightness 2', 'Increase brightness by a factor of 2')
    .example('$0 modulate --hue 180', 'Hue-rotate by 180 degrees')
    .example('$0 modulate --lightness 50', 'Increase lightness by +50')
    .example('$0 modulate --brightness 0.5 --saturation 0.5 --hue 90', 'Decrease brightness and saturation while also hue-rotating by 90 degrees')
    .epilog('For more information on available options, please visit http://sharp.pixelplumbing.com/api-operation#modulate')
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => queue.push(['modulate', (sharp) => sharp.modulate(pick(args, optionNames))])

// Exports.
module.exports = {
  command: 'modulate',
  describe: 'Transforms the image using brightness, saturation, hue rotation, and lightness',
  builder,
  handler
}
