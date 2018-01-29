/* global describe, it, beforeEach, afterEach */
/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mark van Seventer
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

// @see http://sharp.pixelplumbing.com/en/stable/api-resize/

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const background = require('../../../cmd/colour-manipulation/background')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('background', () => {
  const cli = (new Yargs()).command(background)

  // Default rgba.
  const rgba = 'rgba(0,0,0,.5)'

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<rgba>', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'background', rgba ], done))

    // Tests.
    it('must set the rgba flag', () => {
      expect(cli.parsed.argv).to.have.property('rgba', rgba)
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('background')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWith(pipeline.background, rgba)
    })
  })

  describe('[options]', () => {
    // @see http://sharp.pixelplumbing.com/en/stable/api-resize/#embed
    describe('--embed', () => {
      // Default gravity
      const gravity = 'northeast'

      beforeEach((done) => cli.parse([ 'background', rgba, '--embed', gravity ], done))

      it('must set the embed flag', () => {
        expect(cli.parsed.argv).to.have.property('embed', gravity)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('background')
        expect(queue.pipeline).to.include('embed')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWith(pipeline.embed, gravity)
      })
    })

    // @see http://sharp.pixelplumbing.com/en/stable/api-operation/#extend
    describe('--extend', () => {
      // Default padding.
      const top = '10'
      const right = '20'
      const bottom = '30'
      const left = '40'

      beforeEach((done) => cli.parse([ 'background', rgba, '--extend', top, right, bottom, left ], done))

      it('must set the extend flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('extend')
        expect(args.extend).to.eql([
          parseInt(top, 10),
          parseInt(right, 10),
          parseInt(bottom, 10),
          parseInt(left, 10)
        ])
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('background')
        expect(queue.pipeline).to.include('extend')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.extend, {
          top: parseInt(top, 10),
          right: parseInt(right, 10),
          bottom: parseInt(bottom, 10),
          left: parseInt(left, 10)
        })
      })
    })

    // @see http://sharp.pixelplumbing.com/en/stable/api-operation/#flatten
    describe('--flatten', () => {
      beforeEach((done) => cli.parse([ 'background', rgba, '--flatten' ], done))

      it('must set the flatten flag', () => {
        expect(cli.parsed.argv).to.have.property('flatten', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('background')
        expect(queue.pipeline).to.include('flatten')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.called(pipeline.flatten)
      })
    })
  })
})
