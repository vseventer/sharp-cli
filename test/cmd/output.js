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

// @see https://sharp.pixelplumbing.com/en/stable/api-output/#tile

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const queue = require('../../lib/queue')
const sharp = require('../mocks/sharp')
const tile = require('../../cmd/output')

// Test suite.
describe('tile', () => {
  const cli = (new Yargs()).command(tile)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('..', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'tile' ], done))

    // Tests.
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('tile')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.called(pipeline.tile)
    })
  })

  describe('[size]', () => {
    // Default size.
    const size = '512'

    // Run.
    beforeEach((done) => cli.parse([ 'tile', size ], done))

    // Tests.
    it('must set the size flag', () => {
      expect(cli.parsed.argv).to.have.property('size', parseInt(size, 10))
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('tile')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.tile, { size: parseInt(size, 10) })
    })
  })

  describe('[options]', () => {
    describe('--angle', () => {
      // Default angle.
      const angle = '90'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--angle', angle ], done))

      // Tests.
      it('must set the angle flag', () => {
        expect(cli.parsed.argv).to.have.property('angle', parseInt(angle, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { angle: parseInt(angle, 10) })
      })
    })

    describe('--container', () => {
      // Default container.
      const container = 'fs'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--container', container ], done))

      // Tests.
      it('must set the container flag', () => {
        expect(cli.parsed.argv).to.have.property('container', container)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { container })
      })
    })

    describe('--depth', () => {
      // Default depth.
      const depth = 'onepixel'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--depth', depth ], done))

      // Tests.
      it('must set the depth flag', () => {
        expect(cli.parsed.argv).to.have.property('depth', depth)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { depth })
      })
    })

    describe('--layout', () => {
      // Default layout.
      const layout = 'dz'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--layout', layout ], done))

      // Tests.
      it('must set the layout flag', () => {
        expect(cli.parsed.argv).to.have.property('layout', layout)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { layout })
      })
    })

    describe('--overlap', () => {
      // Default overlap.
      const overlap = '10'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--overlap', overlap ], done))

      // Tests.
      it('must set the overlap flag', () => {
        expect(cli.parsed.argv).to.have.property('overlap', parseInt(overlap, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { overlap: parseInt(overlap, 10) })
      })
    })
  })
})
