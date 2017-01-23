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

// @see http://sharp.dimens.io/en/stable/api-output/#tile

// Strict mode.
'use strict'

// Package modules.
const chai = require('chai')
const sinonChai = require('sinon-chai')
const Yargs = require('yargs')

// Local modules.
const queue = require('../../lib/queue')
const sharp = require('../mocks/sharp')
const tile = require('../../cmd/output')

// Configure.
chai.use(sinonChai)
const expect = chai.expect

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
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('tile')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.tile).to.have.been.called
    })
  })

  describe('[size]', () => {
    // Default size.
    const size = '512'

    // Run.
    beforeEach((done) => cli.parse([ 'tile', size ], done))

    // Tests.
    it('should set the size flag', () => {
      expect(cli.parsed.argv).to.have.property('size', parseInt(size, 10))
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('tile')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.tile).to.have.been.calledWithMatch({
        size: parseInt(size, 10)
      })
    })
  })

  describe('[options]', () => {
    describe('--container', () => {
      // Default container.
      const container = 'fs'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--container', container ], done))

      // Tests.
      it('should set the container flag', () => {
        expect(cli.parsed.argv).to.have.property('container', container)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.tile).to.have.been.calledWithMatch({ container: container })
      })
    })

    describe('--layout', () => {
      // Default layout.
      const layout = 'dz'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--layout', layout ], done))

      // Tests.
      it('should set the layout flag', () => {
        expect(cli.parsed.argv).to.have.property('layout', layout)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.tile).to.have.been.calledWithMatch({ layout: layout })
      })
    })

    describe('--overlap', () => {
      // Default overlap.
      const overlap = '10'

      // Run.
      beforeEach((done) => cli.parse([ 'tile', '--overlap', overlap ], done))

      // Tests.
      it('should set the overlap flag', () => {
        expect(cli.parsed.argv).to.have.property('overlap', parseInt(overlap, 10))
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.tile).to.have.been.calledWithMatch({
          overlap: parseInt(overlap, 10)
        })
      })
    })
  })
})
