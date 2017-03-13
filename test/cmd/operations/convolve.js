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

// @see http://sharp.dimens.io/en/stable/api-operation/#convolve

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const mustSinon = require('must-sinon')
const Yargs = require('yargs')

// Local modules.
const convolve = require('../../../cmd/operations/convolve')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Configure.
mustSinon(expect)

// Test suite.
describe('convolve', () => {
  const cli = (new Yargs()).command(convolve)

  // Default width, height, and kernel.
  const width = '3'
  const height = '3'
  const kernel = '-1 0 1 -2 0 2 -1 0 1'

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<width> <height> <kernel>', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'convolve', width, height, kernel ], done))

    // Tests.
    it('should set the width, height, and kernel flags', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('width', parseInt(width, 10))
      expect(args).to.have.property('height', parseInt(height, 10))
      expect(args).to.have.property('kernel', kernel)
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('convolve')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.convolve).to.have.been.calledWithMatch({
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        kernel: kernel.split(' ').map((el) => parseInt(el, 10))
      })
    })
  })

  describe('[options]', () => {
    describe('--offset', () => {
      // Default offset.
      const offset = '10'

      beforeEach((done) => cli.parse([ 'convolve', width, height, kernel, '--offset', offset ], done))

      it('should set the offset flag', () => {
        expect(cli.parsed.argv).to.have.property('offset', parseInt(offset, 10))
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('convolve')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.convolve).to.have.been.calledWithMatch({
          offset: parseInt(offset, 10)
        })
      })
    })
    describe('--scale', () => {
      // Default scale.
      const scale = '10'

      beforeEach((done) => cli.parse([ 'convolve', width, height, kernel, '--scale', scale ], done))

      it('should set the scale flag', () => {
        expect(cli.parsed.argv).to.have.property('scale', parseInt(scale, 10))
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('convolve')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.convolve).to.have.been.calledWithMatch({
          scale: parseInt(scale, 10)
        })
      })
    })
  })
})
