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

// @see https://sharp.pixelplumbing.com/api-operation#boolean

// Strict mode.
'use strict'

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const positionals = {
  operand: {
    desc: 'Path to an image file',
    normalize: true,
    type: 'string'
  },
  operator: {
    choices: constants.BOOL,
    desc: 'Operator to perform that bitwise operation'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-operation#boolean')
    .positional('operand', positionals.operand)
    .positional('operator', positionals.operator)
}

// Command handler.
const handler = (args) => {
  return queue.push(['boolean', (sharp) => sharp.boolean(args.operand, args.operator)])
}

// Exports.
module.exports = {
  command: 'boolean <operand> <operator>',
  describe: 'Perform a bitwise boolean operation with operand image',
  builder,
  handler
}
