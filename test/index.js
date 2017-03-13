/* global describe, it, before, after, afterEach */
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

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const fs = require('fs-extra')
const mustSinon = require('must-sinon')
const tempfile = require('tempfile')

// Local modules.
const cli = require('../lib')
const logger = require('./mocks/logger')
const pkg = require('../package.json')

// Configure.
mustSinon(expect)

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
  afterEach('error', () => logger.error.reset())
  afterEach('log', () => logger.log.reset())

  it('should run', () => {
    return cli([
      '-i', input,
      '-o', dest,
      'resize', '100', '--crop', 'south', '--',
      'greyscale', '--',
      'sharpen'
    ], { logger }).then(() => {
      expect(fs.existsSync(dest)).to.be.true()
      expect(logger.log).to.be.calledWithMatch(dest)
      expect(logger.error).not.to.be.called()
    })
  })
  it('should display output', () => {
    return cli([ '-v' ], { logger })
      .then(() => {
        expect(logger.log).to.have.been.calledWith(pkg.version)
        expect(logger.error).not.to.be.called()
      })
  })
  it('should display errors', () => {
    return cli([ ], { logger })
      .then(() => {
        expect(logger.log).not.to.be.called()
        expect(logger.error).to.have.been.calledWithMatch('Missing required arguments')
        expect(logger.error).to.have.been.calledWithMatch('Specify --help for available options')
      })
  })
})
