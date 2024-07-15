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

// @see https://sharp.dimens.io/api-resize#trim

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  threshold: {
    desc: 'The allowed difference from the top-left pixel',
    defaultDescription: 10,
    type: 'number'
  }
}

const options = {
  background: {
    defaultDescription: 'top-left pixel',
    desc: 'Background colour, parsed by the color module',
    type: 'string'
  },
  lineArt: {
    default: false,
    desc: 'Does the input more closely resemble line art rather than being photographic',
    type: 'boolean'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 trim', 'Trim pixels with a colour similar to that of the top-left pixel')
    .example('$0 trim 0', 'Trim pixels with the exact same colour as that of the top-left pixel')
    .example('$0 trim --background "#FF0000"', 'Trim pixels with a similar colour to red')
    .example('$0 trim 42 --background yellow', 'Trim all "yellow-ish" pixels')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/api-resize#trim')
    .positional('threshold', positionals.threshold)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['trim', (sharp) => {
    return sharp.trim({ background: args.background, lineArt: args.lineArt, threshold: args.threshold })
  }])
}

// Exports.
module.exports = {
  command: 'trim [threshold]',
  describe: 'Trim pixels from all edges that contain values similar to the given background color, which defaults to that of the top-left pixel',
  builder,
  handler
}
