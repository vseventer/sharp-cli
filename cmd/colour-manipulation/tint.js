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

// @see https://sharp.pixelplumbing.com/api-colour#tint

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  rgb: {
    desc: 'Parsed by the color module to extract chroma values',
    type: 'string'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 tint "rgb(255, 240, 16)"')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-colour#tint')
    .positional('rgb', positionals.rgb)
}

// Command handler.
const handler = (args) => queue.push(['tint', (sharp) => sharp.tint(args.rgb)])

// Exports.
module.exports = {
  command: 'tint <rgb>',
  describe: 'Tint the image using the provided chroma while preserving the image luminance',
  builder,
  handler
}
