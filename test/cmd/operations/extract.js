/* global describe, it, beforeEach, afterEach */
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

// @see http://sharp.dimens.io/en/stable/api-operation/#extract

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const mustSinon = require('must-sinon')
const Yargs = require('yargs')

// Local modules.
const extract = require('../../../cmd/operations/extract')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Configure.
mustSinon(expect)

// Test suite.
describe('extract', () => {
  const cli = (new Yargs()).command(extract)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<top> <left> <width> <height>', () => {
    // Default offset and dimensions.
    const top = '10'
    const left = '20'
    const width = '30'
    const height = '40'

    // Run.
    beforeEach((done) => cli.parse([ 'extract', top, left, width, height ], done))

    // Tests.
    it('should set the top, left, width, and height flags', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('top', parseInt(args.top, 10))
      expect(args).to.have.property('left', parseInt(args.left, 10))
      expect(args).to.have.property('width', parseInt(args.width, 10))
      expect(args).to.have.property('height', parseInt(args.height, 10))
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('extract')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.extract).to.have.been.calledWith({
        top: parseInt(top, 10),
        left: parseInt(left, 10),
        width: parseInt(width, 10),
        height: parseInt(height, 10)
      })
    })
  })
})
