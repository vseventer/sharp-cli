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

// @see http://sharp.dimens.io/en/stable/api-channel/#bandbool

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const mustSinon = require('must-sinon')
const Yargs = require('yargs')

// Local modules.
const bandbool = require('../../../cmd/channel-manipulation/bandbool')
const queue = require('../../../lib/queue')
const sharp = require('../../mocks/sharp')

// Configure.
mustSinon(expect)

// Test suite.
describe('bandbool <operator>', () => {
  const cli = (new Yargs()).command(bandbool)

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  // Run.
  beforeEach((done) => cli.parse([ 'bandbool', 'and' ], done))

  // Tests.
  it('should set the operator flag', () => {
    expect(cli.parsed.argv).to.have.property('operator', 'and')
  })
  it('should update the pipeline', () => {
    expect(queue.pipeline).to.have.length(1)
    expect(queue.pipeline).to.include('bandbool')
  })
  it('should execute the pipeline', () => {
    const pipeline = queue.drain(sharp())
    expect(pipeline.bandbool).to.have.been.calledWith('and')
  })
})
