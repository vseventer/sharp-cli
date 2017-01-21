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

// Package modules.
const doWhilst = require('promise-do-whilst')

// Local modules.
const cli = require('./cli')
const queue = require('./queue')

// Exports.
module.exports = (argv) => {
  // Parse arguments.
  let context = { }
  const promise = doWhilst(() => {
    // Determine next argument slice.
    const stopParsing = argv.indexOf('--') + 1
    const slice = stopParsing ? argv.splice(0, stopParsing) : argv.splice(0)

    // Parse the argument slice.
    return cli.parse(slice, context, (err, args, _output) => {
      // Reject on errors or instant output.
      if (err || _output) throw err || _output

      // Update context with required arguments.
      const { input, output, limitInputPixels, sequentialRead, withMetadata } = args
      context = { input, output, limitInputPixels, sequentialRead, withMetadata }
    })
  }, () => argv.length !== 0)

  // Handle io.
  promise
    .then((args) => console.log('RESOLVE', args, context, queue.pipeline))
    .catch((err) => {
      if (err instanceof Error) {
        console.log(err.message)
        console.log()
        console.log('Specify --help for available options')
      } else {
        console.log(err)
      }
    })
}
