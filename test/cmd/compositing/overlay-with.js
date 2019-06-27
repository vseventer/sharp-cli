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

// @see http://sharp.pixelplumbing.com/en/v0.21.3/api-composite/#overlaywith

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const overlayWith = require('../../../cmd/compositing/overlay-with')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('overlayWith', () => {
  const cli = (new Yargs()).command(overlayWith)

  // Default input (avoid `path.join` to test for input normalizing).
  const input = `${__dirname}/../fixtures/input.jpg`

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<overlay>', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'overlayWith', input ], done))

    // Tests.
    it('must set the overlay flag', () => {
      expect(cli.parsed.argv).to.have.property('overlay', path.normalize(input))
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('overlayWith')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWith(pipeline.overlayWith, path.normalize(input))
    })
  })

  describe('[options]', () => {
    describe('--create', () => {
      // Default configuration.
      const width = '10'
      const height = '20'
      const channels = '3'
      const background = 'rgba(0,0,0,0)'

      beforeEach((done) => {
        return cli.parse([ 'overlayWith', input, '--create', width, height, channels, background ], done)
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
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.overlayWith, sinon.match.any, { create: {
          width: parseInt(width, 10),
          height: parseInt(height, 10),
          channels: parseInt(channels, 10),
          background
        } })
      })
    })

    describe('--cutout', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--cutout' ], done))

      it('must set the cutout flag', () => {
        expect(cli.parsed.argv).to.have.property('cutout', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.overlayWith, sinon.match.any, { cutout: true })
      })
    })

    describe('--gravity', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--gravity', 'centre' ], done))

      it('must set the gravity flag', () => {
        expect(cli.parsed.argv).to.have.property('gravity', 'centre')
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.overlayWith, sinon.match.any, { gravity: 'centre' })
      })
    })

    describe('--offset', () => {
      // Default offset.
      const top = '10'
      const left = '20'

      beforeEach((done) => cli.parse([ 'overlayWith', input, '--offset', top, left ], done))

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
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.overlayWith, sinon.match.any, {
          left: parseInt(left, 10),
          top: parseInt(top, 10)
        })
      })
    })

    describe('--tile', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--tile' ], done))

      it('must set the tile flag', () => {
        expect(cli.parsed.argv).to.have.property('tile', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.overlayWith, sinon.match.any, { tile: true })
      })
    })
  })
})
