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

// @see https://sharp.pixelplumbing.com/en/stable/api-output/#tile

// Strict mode.
'use strict'

// Local modules.
const constants = require('../lib/constants')
const queue = require('../lib/queue')

// Configure.
const options = {
  angle: {
    choices: [0, 90, 180, 270],
    default: 0,
    desc: 'Tile angle of rotation',
    nargs: 1
  },
  container: {
    choices: constants.CONTAINER,
    default: 'fs',
    desc: 'Tile container',
    nargs: 1
  },
  depth: {
    choices: constants.DEPTH,
    defaultDescription: 'auto',
    desc: 'Pyramid depth',
    nargs: 1
  },
  layout: {
    choices: constants.LAYOUT,
    default: 'dz',
    desc: 'Filesystem layout',
    nargs: 1
  },
  overlap: {
    desc: 'Tile overlap in pixels',
    defaultDescription: '0',
    nargs: 1,
    type: 'number'
  },
  size: {
    desc: 'Tile size in pixels',
    defaultDescription: 256,
    nargs: 1,
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  const optionNames = Object.keys(options)
  return yargs
    .strict()
    .example('$0 tile 512', 'output.dz is the Deep Zoom XML definition, output_files contains 512×512 tiles grouped by zoom level')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/en/stable/api-output/#tile')
    .options(options)
    .global(optionNames, false)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['tile', (sharp) => {
    return sharp.tile({
      size: args.size,
      overlap: args.overlap,
      angle: args.angle,
      depth: args.depth,
      container: args.container,
      layout: args.layout
    })
  }])
}

// Exports.
module.exports = {
  command: 'tile [size]',
  describe: 'Use tile-based deep zoom (image pyramid) output',
  builder,
  handler
}
