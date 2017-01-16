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

// @see http://sharp.dimens.io/en/stable/api-composite/#overlaywith

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const yargs = require('yargs')

// Local modules.
const overlayWith = require('../../cmd/composite')
const queue = require('../../lib/queue')
const sharp = require('../mocks/sharp')

// Configure.
chai.use(sinonChai)
const expect = chai.expect

// Test suite.
describe('overlayWith', () => {
  const cli = yargs.command(overlayWith)

  // Default input (avoid `path.join` to test for input normalizing).
  const input = `${__dirname}/../fixtures/input.jpg`

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<overlay>', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'overlayWith', input ], done))

    // Tests.
    it('should set the overlay flag', () => {
      expect(cli.parsed.argv).to.have.property('overlay', path.normalize(input))
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('overlayWith')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.overlayWith).to.have.been.calledWith(path.normalize(input))
    })
  })

  describe('[options]', () => {
    describe('--cutout', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--cutout' ], done))

      it('should set the cutout flag', () => {
        expect(cli.parsed.argv).to.have.property('cutout', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.overlayWith).to.have.been.calledWithMatch(
          sinon.match.any,
          { cutout: true }
        )
      })
    })

    describe('--gravity', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--gravity', 'centre' ], done))

      it('should set the gravity flag', () => {
        expect(cli.parsed.argv).to.have.property('gravity', 'centre')
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.overlayWith).to.have.been.calledWithMatch(
          sinon.match.any,
          { gravity: 'centre' }
        )
      })
    })

    describe('--offset', () => {
      // Default offset.
      const top = '10'
      const left = '20'

      beforeEach((done) => cli.parse([ 'overlayWith', input, '--offset', top, left ], done))

      it('should set the offset flag', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('offset')
        expect(args.offset).to.deep.equal([
          parseInt(top, 10),
          parseInt(left, 10)
        ])
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.overlayWith).to.have.been.calledWithMatch(
          sinon.match.any,
          {
            left: parseInt(left, 10),
            top: parseInt(top, 10)
          }
        )
      })
    })

    describe('--tile', () => {
      beforeEach((done) => cli.parse([ 'overlayWith', input, '--tile' ], done))

      it('should set the tile flag', () => {
        expect(cli.parsed.argv).to.have.property('tile', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('overlayWith')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.overlayWith).to.have.been.calledWithMatch(
          sinon.match.any,
          { tile: true }
        )
      })
    })
  })
})
