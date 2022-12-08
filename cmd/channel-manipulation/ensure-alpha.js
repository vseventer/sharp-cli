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

// @see https://sharp.pixelplumbing.com/api-channel#ensurealpha

// Strict mode.
'use strict'

// Local modules.
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  alpha: {
    default: 1,
    desc: 'Alpha transparency level',
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 ensureAlpha', 'The output will be a 4 channel image with a fully-opaque alpha channel')
    .example('$0 ensureAlpha 0', 'The output will be a 4 channel image with a fully-transparent alpha channel')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-channel#removealpha')
    .positional('alpha', positionals.alpha)
}

// Command handler.
const handler = (args) => {
  return queue.push(['ensureAlpha', (sharp) => sharp.ensureAlpha(args.alpha)])
}

// Exports.
module.exports = {
  command: 'ensureAlpha [alpha]',
  describe: 'Ensure the output image has an alpha transparency channel',
  builder,
  handler
}
