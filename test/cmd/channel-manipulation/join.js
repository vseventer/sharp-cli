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

// @see https://sharp.pixelplumbing.com/en/stable/api-channel/#bandbool

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const Yargs = require('yargs')

// Local modules.
const joinChannel = require('../../../cmd/channel-manipulation/join')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Test suite.
describe('join <images..>', () => {
  const cli = (new Yargs()).command(joinChannel)

  // Default input (avoid `path.join` to test for input normalizing).
  const input = `${__dirname}/../../fixtures/input.jpg` // eslint-disable-line n/no-path-concat

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<images..>', () => {
    // Run.
    beforeEach((done) => cli.parse(['joinChannel', input, input], done))

    // Tests.
    it('must set the operator flag', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('images')
      expect(args.images).to.eql([path.normalize(input), path.normalize(input)])
    })
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('joinChannel')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.calledWith(pipeline.joinChannel, [
        path.normalize(input),
        path.normalize(input)
      ])
    })
  })

  describe('[options]', () => {
    describe('--density', () => {
      // Default density.
      const density = '72.1'

      beforeEach((done) => cli.parse(['joinChannel', input, '--density', density], done))

      it('must set the density flag', () => {
        expect(cli.parsed.argv).to.have.property('density', parseFloat(density))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('joinChannel')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.joinChannel, sinon.match.any, {
          density: parseFloat(density)
        })
      })
    })
  })
})
