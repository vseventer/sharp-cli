/* global describe, it, before, after, afterEach */
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

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const fs = require('fs-extra')
const sinon = require('sinon')
const tempfile = require('tempfile')

// Local modules.
const cli = require('../lib')
const logger = require('./mocks/logger')
const pkg = require('../package.json')

// Test suite.
describe('CLI', () => {
  // Default input.
  const input = path.join(__dirname, './fixtures/input.jpg')

  // Default output.
  let dest
  before(() => { dest = tempfile() })
  before((done) => fs.ensureDir(dest, done))
  afterEach((done) => fs.emptyDir(dest, done))
  after((done) => fs.remove(dest, done))

  // Reset.
  afterEach('error', () => logger.error.resetHistory())
  afterEach('log', () => logger.log.resetHistory())

  it('must run', () => {
    return cli([
      '-i', input,
      '-o', dest,
      'resize', '100', '--position', 'south', '--',
      'greyscale', '--',
      'sharpen'
    ], { logger }).then(() => {
      expect(fs.existsSync(dest)).to.be.true()
      sinon.assert.calledWithMatch(logger.log, dest)
      sinon.assert.notCalled(logger.error)
    })
  })
  it('must display output', () => {
    return cli(['-v'], { logger })
      .then(() => {
        sinon.assert.calledWith(logger.log, pkg.version)
        sinon.assert.notCalled(logger.error)
        expect(process.exitCode).not.to.equal(1)
      })
  })
  it('must display errors', () => {
    return cli([], { logger })
      .then(() => {
        sinon.assert.notCalled(logger.log)
        sinon.assert.calledWithMatch(logger.error, 'Missing required arguments')
        sinon.assert.calledWithMatch(logger.error, 'Specify --help for available options')
        expect(process.exitCode).to.equal(1)
      })
  })
})
