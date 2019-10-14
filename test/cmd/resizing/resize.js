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

// @see https://sharp.pixelplumbing.com/en/stable/api-resize/

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const resize = require('../../../cmd/resizing/resize')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('resize', () => {
  const cli = (new Yargs()).command(resize)

  // Default width × height.
  const x = '100'
  const y = '200'

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<width> [height]', () => {
    // Run.
    beforeEach((done) => cli.parse(['resize', x, y], done))

    // Tests.
    it('must set the width and height flags', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('width', parseInt(x, 10))
      expect(args).to.have.property('height', parseInt(y, 10))
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('resize')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.resize, {
        width: parseInt(x, 10),
        height: parseInt(y, 10)
      })
    })
  })

  describe('<width> [auto-height]', () => {
    beforeEach((done) => cli.parse(['resize', x, '0'], done))

    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.resize, {
        width: parseInt(x, 10),
        height: null
      })
    })
  })

  describe('<auto-width> [height]', () => {
    beforeEach((done) => cli.parse(['resize', '0', y], done))

    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.resize, {
        width: null,
        height: parseInt(y, 10)
      })
    })
  })

  describe('<width>', () => {
    beforeEach((done) => cli.parse(['resize', x], done))

    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.resize, {
        width: parseInt(x, 10),
        height: parseInt(x, 10)
      })
    })
  })

  describe('[options]', () => {
    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
    describe('--background', () => {
      // Default background.
      const background = 'rgba(0,0,0,.5)'

      // Run.
      beforeEach((done) => cli.parse(['resize', x, y, '--background', background], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('background', background)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { background })
      })
    })

    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
    describe('--fastShrinkOnLoad', () => {
      beforeEach((done) => cli.parse(['resize', x, y, '--no-fastShrinkOnLoad'], done))

      it('must set the fastShrinkOnLoad flag', () => {
        expect(cli.parsed.argv).to.have.property('fastShrinkOnLoad', false)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { fastShrinkOnLoad: false })
      })
    })

    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
    describe('--fit', () => {
      // Default fit.
      const fit = 'fill'

      beforeEach((done) => cli.parse(['resize', x, y, '--fit', fit], done))

      it('must set the fit flag', () => {
        expect(cli.parsed.argv).to.have.property('fit', fit)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { fit })
      })
    })

    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
    describe('--kernel', () => {
      // Default kernel.
      const kernel = 'lanczos3'

      beforeEach((done) => cli.parse(['resize', x, y, '--kernel', kernel], done))

      it('must set the kernel flag', () => {
        expect(cli.parsed.argv).to.have.property('kernel', kernel)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { kernel })
      })
    })

    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#resize
    describe('--position', () => {
      // Default position.
      const position = 'centre'

      beforeEach((done) => cli.parse(['resize', x, y, '--position', position], done))

      it('must set the position flag', () => {
        expect(cli.parsed.argv).to.have.property('position', position)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { position })
      })
    })

    // @see https://sharp.pixelplumbing.com/en/stable/api-resize/#withoutenlargement
    describe('--withoutEnlargement', () => {
      beforeEach((done) => cli.parse(['resize', x, y, '--withoutEnlargement'], done))

      it('must set the withoutEnlargement flag', () => {
        expect(cli.parsed.argv).to.have.property('withoutEnlargement', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.resize, { withoutEnlargement: true })
      })
    })
  })
})
