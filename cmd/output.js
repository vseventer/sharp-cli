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

// @see https://sharp.pixelplumbing.com/api-output#tile

// Strict mode.
'use strict'

// Package modules.
const pick = require('lodash.pick')

// Local modules.
const constants = require('../lib/constants')
const queue = require('../lib/queue')

// Configure.
const positionals = {
  size: {
    desc: 'Tile size in pixels',
    defaultDescription: 256,
    type: 'number'
  }
}

const options = {
  angle: {
    choices: [0, 90, 180, 270],
    defaultDescription: '0',
    desc: 'Tile angle of rotation'
  },
  background: {
    defaultDescription: 'rgb(255, 255, 255, 1)',
    desc: 'Background colour, parsed by the color module',
    type: 'string'
  },
  basename: {
    desc: 'The name of the directory within the zip file',
    type: 'string'
  },
  center: {
    alias: 'centre',
    desc: 'Center images in tile',
    type: 'boolean'
  },
  container: {
    choices: constants.CONTAINER,
    defaultDescription: 'fs',
    desc: 'Tile container'
  },
  depth: {
    choices: constants.DEPTH,
    defaultDescription: 'auto',
    desc: 'Pyramid depth'
  },
  id: {
    defaultDescription: 'https://example.com/iiif',
    desc: 'Set the @id/id attribute of info.json',
    type: 'string'
  },
  layout: {
    choices: constants.LAYOUT,
    defaultDescription: 'dz',
    desc: 'Filesystem layout'
  },
  overlap: {
    desc: 'Tile overlap in pixels',
    defaultDescription: '0',
    type: 'number'
  },
  skipBlanks: {
    defaultDescription: -1,
    desc: 'Threshold to skip tile generation',
    type: 'number'
  }
}
const optionNames = Object.keys(options)

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 tile 512', 'output.dz is the Deep Zoom XML definition, output_files contains 512×512 tiles grouped by zoom level')
    .epilog('For more information on available options, please visit https://sharp.pixelplumbing.com/api-output#tile')
    .positional('size', positionals.size)
    .options(options)
    .group(optionNames, 'Command Options')
}

// Command handler.
const handler = (args) => {
  return queue.push(['tile', (sharp) => {
    return sharp.tile({
      size: args.size,
      ...pick(args, optionNames)
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
