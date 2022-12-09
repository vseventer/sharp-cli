/* global describe, it, beforeEach, afterEach */
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

// @see https://sharp.dimens.io/api-operation#recomb

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const clahe = require('../../../cmd/operations/clahe')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('clahe', () => {
  const cli = (new Yargs()).command(clahe)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  const width = 20
  const height = 10

  describe('..', () => {
    // Run.
    beforeEach((done) => cli.parse(['clahe', width, height], done))

    // Tests.
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('clahe')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.clahe, { width, height })
    })
  })

  describe('[options]', () => {
    describe('--maxSlope', () => {
      // Default slope.
      const slope = 10

      // Run.
      beforeEach((done) => cli.parse(['clahe', width, height, '--maxSlope', slope], done))

      // Tests.
      it('must set the maxSlope flag', () => {
        expect(cli.parsed.argv).to.have.property('maxSlope', slope)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('clahe')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.clahe, { maxSlope: slope })
      })
    })
  })
})
