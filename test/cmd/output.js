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

// @see https://sharp.pixelplumbing.com/api-output#tile

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
    beforeEach(() => cli.parse(['tile']))

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
    const size = 512

    // Run.
    beforeEach(() => cli.parse(['tile', size]))

    // Tests.
    it('must set the size flag', () => {
      expect(cli.parsed.argv).to.have.property('size', size)
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('tile')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.tile, { size })
    })
  })

  describe('[options]', () => {
    describe('--angle', () => {
      // Default angle.
      const angle = 90

      // Run.
      beforeEach(() => cli.parse(['tile', '--angle', angle]))

      // Tests.
      it('must set the angle flag', () => {
        expect(cli.parsed.argv).to.have.property('angle', angle)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { angle })
      })
    })

    describe('--background', () => {
      // Default background.
      const background = 'rgba(0,0,0,.5)'

      // Run.
      beforeEach((done) => cli.parse(['tile', '--background', background], done))

      // Tests.
      it('must set the background flag', () => {
        expect(cli.parsed.argv).to.have.property('background', background)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { background })
      })
    })

    describe('--basename', () => {
      // Default basename.
      const basename = 'tiles'

      // Run.
      beforeEach(() => cli.parse(['tile', '--basename', basename]))

      // Tests.
      it('must set the id flag', () => {
        expect(cli.parsed.argv).to.have.property('basename', basename)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { basename })
      })
    })

    ;['center', 'centre'].forEach((alias) => {
      describe(`--${alias}`, () => {
        beforeEach(() => cli.parse(['tile', `--${alias}`]))

        it('must set the center flag', () => {
          expect(cli.parsed.argv).to.have.property('center', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('tile')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.tile, { center: true })
        })
      })
    })

    describe('--container', () => {
      // Default container.
      const container = 'fs'

      // Run.
      beforeEach(() => cli.parse(['tile', '--container', container]))

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
      beforeEach(() => cli.parse(['tile', '--depth', depth]))

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

    describe('--id', () => {
      // Default id.
      const id = 'http://www.example.com'

      // Run.
      beforeEach(() => cli.parse(['tile', '--id', id]))

      // Tests.
      it('must set the id flag', () => {
        expect(cli.parsed.argv).to.have.property('id', id)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { id })
      })
    })

    describe('--layout', () => {
      // Default layout.
      const layout = 'dz'

      // Run.
      beforeEach(() => cli.parse(['tile', '--layout', layout]))

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
      const overlap = 10

      // Run.
      beforeEach(() => cli.parse(['tile', '--overlap', overlap]))

      // Tests.
      it('must set the overlap flag', () => {
        expect(cli.parsed.argv).to.have.property('overlap', overlap)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { overlap })
      })
    })

    describe('--skipBlanks', () => {
      // Default skip.
      const skip = 10

      // Run.
      beforeEach(() => cli.parse(['tile', '--skipBlanks', skip]))

      // Tests.
      it('must set the overlap flag', () => {
        expect(cli.parsed.argv).to.have.property('skipBlanks', skip)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tile')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tile, { skipBlanks: skip })
      })
    })
  })
})
