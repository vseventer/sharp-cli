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

// @see http://sharp.pixelplumbing.com/en/stable/api-operation/#modulate

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')
const modulate = require('../../../cmd/operations/modulate')

// Test suite.
describe('modulate', () => {
  const cli = (new Yargs()).command(modulate)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('..', () => {
    // Run.
    beforeEach((done) => cli.parse(['modulate'], done))

    // Tests.
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('modulate')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.called(pipeline.modulate)
    })
  })

  describe('[options]', () => {
    ['brightness', 'saturation', 'hue', 'lightness'].forEach((option) => {
      describe(`--${option}`, () => {
        // Default value.
        const value = '10'

        beforeEach((done) => cli.parse(['modulate', `--${option}`, value], done))

        it(`must set the ${option} flag`, () => {
          expect(cli.parsed.argv).to.have.property(option, parseInt(value, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('modulate')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWith(pipeline.modulate, {
            [[option]]: parseInt(value, 10)
          })
        })
      })
    })
  })
})
