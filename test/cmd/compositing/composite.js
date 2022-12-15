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

// @see http://sharp.pixelplumbing.com/api-composite#composite

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const composite = require('../../../cmd/compositing/composite')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('composite', () => {
  const cli = (new Yargs()).command(composite)

  // Default input (avoid `path.join` to test for input normalizing).
  const input = `${__dirname}/../fixtures/input.jpg` // eslint-disable-line n/no-path-concat

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('[images..]', () => {
    // Run.
    beforeEach((done) => cli.parse(['composite', input], done))

    // Tests.
    it('must set the images flag', () => {
      expect(cli.parsed.argv).to.have.property('images')
      expect(cli.parsed.argv.images[0]).to.equal(path.normalize(input))
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('composite')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input', path.normalize(input)))
    })
  })

  describe('[options]', () => {
    it('should roll over when using multiple inputs', (done) => {
      cli.parse([
        'composite', '--create.width', 20, '--create.width', 30, '--create.height', 40, '--create.background', 'red',
        input, '--blend', 'in', '--gravity', 'southeast', input, '--blend', 'out'
      ], (err) => {
        if (err) {
          return done(err)
        }

        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.width', 20))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.height', 40))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].blend', 'in'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].gravity', 'southeast'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[1].input.create.width', 30))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[1].input.create.height', 40))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[1].blend', 'out'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[1].gravity', 'southeast'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[2].input', path.normalize(input)))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[2].blend', 'out'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[2].gravity', 'southeast'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[3].input', path.normalize(input)))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[3].blend', 'out'))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[3].gravity', 'southeast'))
        done()
      })
    })

    describe('--blend', () => {
      // Default blend.
      const blend = 'add'

      beforeEach((done) => cli.parse(['composite', input, '--blend', blend], done))

      it('must set the blend flag', () => {
        expect(cli.parsed.argv).to.have.property('blend', blend)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].blend', blend))
      })
    })

    describe('--create', () => {
      // Default configuration.
      const width = 10
      const height = 20
      const channels = 3
      const background = 'rgba(0,0,0,0)'

      beforeEach((done) => {
        return cli.parse([
          'composite', '--create.width', width, '--create.height', height,
          '--create.channels', channels, '--create.background', background
        ], done)
      })

      describe('--create.width', () => {
        it('must set the create.width flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('create')
          expect(args.create).to.have.property('width', width)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('composite')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.width', width))
        })
      })

      describe('--create.height', () => {
        it('must set the create.height flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('create')
          expect(args.create).to.have.property('height', height)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('composite')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.height', height))
        })
      })

      describe('--create.channels', () => {
        it('must set the create.channels flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('create')
          expect(args.create).to.have.property('channels', channels)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('composite')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.channels', channels))
        })
      })

      describe('--create.background', () => {
        it('must set the create.background flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('create')
          expect(args.create).to.have.property('background', background)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('composite')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].input.create.background', background))
        })
      })
    })

    describe('--density', () => {
      // Default density.
      const density = 72.1

      beforeEach((done) => cli.parse(['composite', input, '--density', density], done))

      it('must set the density flag', () => {
        expect(cli.parsed.argv).to.have.property('density', density)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].density', density))
      })
    })

    describe('--gravity', () => {
      beforeEach((done) => cli.parse(['composite', input, '--gravity', 'centre'], done))

      it('must set the gravity flag', () => {
        expect(cli.parsed.argv).to.have.property('gravity', 'centre')
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].gravity', 'centre'))
      })
    })

    describe('--left', () => {
      // Default left.
      const left = 20

      beforeEach((done) => cli.parse(['composite', input, '--left', left, '--top', 10], done))

      it('must set the left flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('left', left)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].left', left))
      })
    })

    describe('--premultiplied', () => {
      beforeEach((done) => cli.parse(['composite', input, '--premultiplied'], done))

      it('must set the premultiplied flag', () => {
        expect(cli.parsed.argv).to.have.property('premultiplied', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].premultiplied', true))
      })
    })

    describe('--tile', () => {
      beforeEach((done) => cli.parse(['composite', input, '--tile'], done))

      it('must set the tile flag', () => {
        expect(cli.parsed.argv).to.have.property('tile', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].tile', true))
      })
    })

    describe('--top', () => {
      // Default top.
      const top = 20

      beforeEach((done) => cli.parse(['composite', input, '--left', 10, '--top', top], done))

      it('must set the top flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('top', top)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].top', top))
      })
    })
  })
})
