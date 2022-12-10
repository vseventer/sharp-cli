/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Mark van Seventer
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

// @see https://sharp.pixelplumbing.com/api-operation#affine

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const constants = require('../../lib/constants')
const queue = require('../../lib/queue')

// Configure.
const placeholders = {
  matrix: {
    desc: 'Affine transformation matrix',
    nargs: 2 * 2,
    type: 'number'
  }
}

const options = {
  background: {
    defaultDescription: '#000000',
    desc: 'String parsed by the color module to extract values for red, green, blue and alpha',
    type: 'string'
  },
  idx: {
    defaultDescription: '0',
    desc: 'The input horizontal offset',
    type: 'number'
  },
  idy: {
    defaultDescription: '0',
    desc: 'The input vertical offset',
    type: 'number'
  },
  odx: {
    defaultDescription: '0',
    desc: 'The output horizontal offset',
    type: 'number'
  },
  ody: {
    defaultDescription: '0',
    desc: 'The output vertical offset',
    type: 'number'
  },
  interpolate: {
    choices: constants.INTERPOLATORS,
    defaultDescription: 'bicubic',
    desc: 'The input horizontal offset'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 affine 1 0.3 0.1 0.7 --background white --interpolate nohalo')
    .epilog('For more information on available options, please visit https://sharp.dimens.io/api-operation#affine')
    .check(argv => {
      if (!(Array.isArray(argv.matrix) && argv.matrix.length === 4)) {
        throw new Error('Expected matrix positional to have 4 values')
      }
      return true
    })
    .positional('matrix', placeholders.matrix)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['affine', (sharp) => {
    const { matrix } = args
    return sharp.affine([matrix.slice(0, 2), matrix.slice(2, 4)], pick(args, optionNames))
  }])
}

// Exports.
module.exports = {
  command: 'affine <matrix..>',
  describe: 'Perform an affine transform on an image',
  builder,
  handler
}
