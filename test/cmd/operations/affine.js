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

// @see https://sharp.pixelplumbing.com/api-operation#affine

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const affine = require('../../../cmd/operations/affine')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('affine', () => {
  const cli = (new Yargs()).command(affine)

  // Default matrix.
  const matrix = [1, 0.3, 0.1, 0.7]

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<matrix..>', () => {
    // Run.
    beforeEach((done) => cli.parse(['affine', ...matrix], done))

    // Tests.
    it('must set the matrix flag', () => {
      expect(cli.parsed.argv).to.have.property('matrix')
      expect(cli.parsed.argv.matrix).to.eql(matrix)
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('affine')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.affine, [matrix.slice(0, 2), matrix.slice(2, 4)])
    })
  })

  describe('[options]', () => {
    describe('--background', () => {
      // Default background.
      const background = 'rgba(0,0,0,.5)'

      // Run.
      beforeEach((done) => cli.parse(['affine', ...matrix, '--background', background], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('background', background)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('affine')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, { background })
      })
    })

    ;['idx', 'idy', 'odx', 'ody'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Default value.
        const value = 10

        // Run.
        beforeEach((done) => cli.parse(['affine', ...matrix, `--${alias}`, value], done))

        // Tests.
        it('must set the flat flag', () => {
          expect(cli.parsed.argv).to.have.property(alias, value)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('affine')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, { [alias]: value })
        })
      })
    })

    describe('--interpolate', () => {
      // Default interpolator.
      const interpolator = 'nohalo'

      // Run.
      beforeEach((done) => cli.parse(['affine', ...matrix, '--interpolate', interpolator], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('interpolate', interpolator)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('affine')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, { interpolate: interpolator })
      })
    })
  })
})
