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

// Strict mode.
'use strict'

// Package modules.
const sharp = require('sharp')

// Exports.
module.exports = {
  BAND: [ 'red', 'green', 'blue' ],
  BOOL: Object.keys(sharp.bool),
  COLOURSPACE: Object.keys(sharp.colourspace),
  CONTAINER: [ 'fs', 'zip' ],
  DEPTH: [ 'onepixel', 'onetile', 'one' ],
  FIT: Object.keys(sharp.fit),
  FORMAT: [ 'jpeg', 'jpg', 'png', 'raw', 'tiff', 'webp' ],
  GRAVITY: Object.keys(sharp.gravity),
  KERNEL: Object.keys(sharp.kernel),
  LAYOUT: [ 'dz', 'google', 'zoomify' ],
  POSITION: Object.keys(sharp.position),
  STRATEGY: Object.keys(sharp.strategy),
  TIFF_COMPRESSION: [ 'ccittfax4', 'deflate', 'jpeg', 'lzw', 'none' ],
  TIFF_PREDICTOR: [ 'float', 'horizontal', 'none' ]
}
