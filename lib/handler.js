/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
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

// Strict mode.
'use strict'

// Local modules.
const queue = require('./queue')

// Exports.
module.exports = (childHandler) => {
  // Return a composite handler handling both global options and command itself.
  return (args) => {
    // @see http://sharp.dimens.io/en/stable/api-input/#limitinputpixels
    if (args.limitInputPixels) {
      queue.push([ 'limitInputPixels', (sharp) => sharp.limitInputPixels(args.limitInputPixels) ])
    }

    // @see http://sharp.dimens.io/en/stable/api-input/#sequentialread
    if (args.sequentialRead) {
      queue.push([ 'sequentialRead', (sharp) => sharp.sequentialRead() ])
    }

    // @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
    if (args.withMetadata) {
      queue.push([ 'withMetadata', (sharp) => sharp.withMetadata() ])
    }

    // Invoke the child handler.
    return childHandler(args)
  }
}
