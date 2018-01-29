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

// @see http://sharp.pixelplumbing.com/en/stable/api-operation/#sharpen

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')
const sharpen = require('../../../cmd/operations/sharpen')

// Test suite.
describe('sharpen', () => {
  const cli = (new Yargs()).command(sharpen)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('..', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'sharpen' ], done))

    // Tests.
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('sharpen')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.called(pipeline.sharpen)
    })
  })

  describe('[sigma]', () => {
    // Default sigma.
    const sigma = '1.1'

    // Run.
    beforeEach((done) => cli.parse([ 'sharpen', sigma ], done))

    // Tests.
    it('must set the sigma flag', () => {
      expect(cli.parsed.argv).to.have.property('sigma', parseFloat(sigma))
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('sharpen')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWith(pipeline.sharpen, parseFloat(sigma))
    })
  })

  describe('[options]', () => {
    describe('--flat', () => {
      // Default flat.
      const flat = '1.1'

      // Run.
      beforeEach((done) => cli.parse([ 'sharpen', '--flat', flat ], done))

      // Tests.
      it('must set the flat flag', () => {
        expect(cli.parsed.argv).to.have.property('flat', parseFloat(flat))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('sharpen')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWith(pipeline.sharpen, sinon.match.any, parseFloat(flat))
      })
    })

    describe('--jagged', () => {
      // Default jagged.
      const jagged = '1.1'

      // Run.
      beforeEach((done) => cli.parse([ 'sharpen', '--jagged', jagged ], done))

      // Tests.
      it('must set the jagged flag', () => {
        expect(cli.parsed.argv).to.have.property('jagged', parseFloat(jagged))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('sharpen')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWith(pipeline.sharpen, sinon.match.any, sinon.match.any, parseFloat(jagged))
      })
    })
  })
})
