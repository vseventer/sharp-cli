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

// @see http://sharp.pixelplumbing.com/en/stable/api-composite/#composite

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
  const input = `${__dirname}/../fixtures/input.jpg`

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<image>', () => {
    // Run.
    beforeEach((done) => cli.parse(['composite', input], done))

    // Tests.
    it('must set the image flag', () => {
      expect(cli.parsed.argv).to.have.property('image', path.normalize(input))
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
    describe('--blend', () => {
      // Default blend.
      const blend = 'add'

      beforeEach((done) => cli.parse(['composite', input, '--blend', blend], done))

      it('must set the gravity flag', () => {
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
      const width = '10'
      const height = '20'
      const channels = '3'
      const background = 'rgba(0,0,0,0)'

      beforeEach((done) => {
        return cli.parse(['composite', input, '--create', width, height, channels, background], done)
      })

      it('must set the create flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('create')
        expect(args.create).to.eql([
          parseInt(width, 10),
          parseInt(height, 10),
          parseInt(channels, 10),
          background
        ])
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].create', {
          width: parseInt(width, 10),
          height: parseInt(height, 10),
          channels: parseInt(channels, 10),
          background
        }))
      })
    })

    describe('--density', () => {
      // Default density.
      const density = '72.1'

      beforeEach((done) => cli.parse(['composite', input, '--density', density], done))

      it('must set the density flag', () => {
        expect(cli.parsed.argv).to.have.property('density', parseFloat(density))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].density', parseFloat(density)))
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

    describe('--limitInputPixels', () => {
      // Default value.
      const value = '10'

      beforeEach((done) => cli.parse(['composite', input, '--limitInputPixels', value], done))

      it('must set the offset flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('limitInputPixels', parseInt(value, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].limitInputPixels', parseInt(value, 10)))
      })
    })

    describe('--offset', () => {
      // Default offset.
      const top = '10'
      const left = '20'

      beforeEach((done) => cli.parse(['composite', input, '--offset', top, left], done))

      it('must set the offset flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('offset')
        expect(args.offset).to.eql([
          parseInt(top, 10),
          parseInt(left, 10)
        ])
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('composite')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].left', parseInt(left, 10)))
        sinon.assert.calledWithMatch(pipeline.composite, sinon.match.hasNested('[0].top', parseInt(top, 10)))
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
  })
})
