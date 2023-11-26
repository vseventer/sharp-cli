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

// @see https://sharp.dimens.io/api-resize#extend

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const extend = require('../../../cmd/resizing/extend')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('extend', () => {
  const cli = (new Yargs()).command(extend)

  // Default offsets.
  const top = 10
  const bottom = 20
  const left = 10
  const right = 10

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<top> <bottom> <left> <right>', () => {
    // Run.
    beforeEach((done) => cli.parse(['extend', top, bottom, left, right], done))

    // Tests.
    it('must set the top, bottom, left, and right flags', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('top', args.top)
      expect(args).to.have.property('bottom', args.bottom)
      expect(args).to.have.property('left', args.left)
      expect(args).to.have.property('right', args.right)
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('extend')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.extend, { top, bottom, left, right })
    })
  })

  describe('[options]', () => {
    describe('--background', () => {
      // Default background.
      const background = 'rgba(0,0,0,.5)'

      // Run.
      beforeEach((done) => cli.parse(['extend', top, bottom, left, right, '--background', background], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('background', background)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('extend')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.extend, { background })
      })
    })

    describe('--extendWith', () => {
      // Default mode.
      const mode = 'copy'

      // Run.
      beforeEach((done) => cli.parse(['extend', top, bottom, left, right, '--extendWith', mode], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('extendWith', mode)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('extend')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.extend, { extendWith: mode })
      })
    })
  })
})
