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

// @see http://sharp.dimens.io/en/stable/api-operation/#threshold

// Strict mode.
'use strict'

// Package modules.
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const yargs = require('yargs')

// Local modules.
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')
const threshold = require('../../../cmd/operations/threshold')

// Configure.
chai.use(sinonChai)
const expect = chai.expect

// Test suite.
describe('threshold', () => {
  const cli = yargs.command(threshold)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('..', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'threshold' ], done))

    // Tests.
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('threshold')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.threshold).to.have.been.called
    })
  })

  describe('[value]', () => {
    // Default value.
    const value = '128'

    // Run.
    beforeEach((done) => cli.parse([ 'threshold', value ], done))

    // Tests.
    it('should set the factor flag', () => {
      expect(cli.parsed.argv).to.have.property('value', parseInt(value, 10))
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('threshold')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.threshold).to.have.been.calledWith(parseInt(value, 10))
    })
  })

  describe('[options]', () => {
    void [ 'grayscale', 'greyscale' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        beforeEach((done) => cli.parse([ 'threshold', `--${alias}` ], done))

        it('should set the greyscale flag', () => {
          expect(cli.parsed.argv).to.have.property('greyscale', true)
        })
        it('should update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('threshold')
        })
        it('should execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          expect(pipeline.threshold).to.have.been.calledWith(sinon.match.any, { greyscale: true })
        })
      })
    })
  })
})
