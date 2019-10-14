/* global describe, it, beforeEach, afterEach */
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

// @see https://sharp.dimens.io/en/stable/api-operation/#recomb

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const recomb = require('../../../cmd/operations/recomb')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('recomb', () => {
  const cli = (new Yargs()).command(recomb)

  // Default matrix.
  const matrix = '0.3588 0.7044 0.1368 0.2990 0.5870 0.1140 0.2392 0.4696 0.0912'

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<matrix>', () => {
    // Run.
    beforeEach((done) => cli.parse(['recomb', matrix], done))

    // Tests.
    it('must set the matrix flag', () => {
      expect(cli.parsed.argv).to.have.property('matrix', matrix)
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('recomb')
    })
    it('must execute the pipeline', () => {
      const arg = matrix.split(' ').map((el) => parseFloat(el))
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.recomb, [
        arg.slice(0, 3),
        arg.slice(3, 6),
        arg.slice(6, 9)
      ])
    })
  })
})
