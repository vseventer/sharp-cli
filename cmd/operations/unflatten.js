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

// @see https://sharp.dimens.io/api-operation#unflatten

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 unflatten')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/api-operation#unflatten')
}

// Command handler.
const handler = (args) => queue.push(['unflatten', (sharp) => sharp.unflatten()])

// Exports.
module.exports = {
  command: 'unflatten',
  describe: 'Ensure the image has an alpha channel with all white pixel values made fully transparent',
  builder,
  handler
}
