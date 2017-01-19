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

// Strict mode.
'use strict'

// Package modules.
const chai = require('chai')
const sinonChai = require('sinon-chai')

// Local modules.
const cli = require('../lib')
const pkg = require('../package.json')
const queue = require('../lib/queue')
const sharp = require('./mocks/sharp')

// Configure.
chai.use(sinonChai)
const expect = chai.expect

// Test suite.
describe(`${pkg.name} [command..] [options]`, () => {
  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('..', () => {
    it('should display cli errors')
    it('should display i/o errors')
    it('should display sharp errors')
    it('should read from stdin')
    it('should write to stdout')
  })

  describe('[command..]', () => {
    it('should update the pipeline')
    it('should execute the pipeline')
  })

  describe('[command] -- [command..]', () => {
    it('should update the pipeline')
    it('should execute the pipeline')
  })

  describe('[options]', () => {
    describe('--help', () => {
      it('should display help')
    })
    describe('--input', () => {
      it('should read from file(s)')
    })
    describe('--limitInputPixels', () => {
      it('should update the pipeline')
      it('should execute the pipeline')
    })
    describe('--output', () => {
      it('should write to file(s)')
    })
    describe('--sequentialRead', () => {
      it('should update the pipeline')
      it('should execute the pipeline')
    })

    describe('--version', () => {
      // Run.
      beforeEach(() => cli([ '-v' ]))

      // Tests.
      it.skip('should display the version number', () => {
        expect('').to.equal(pkg.version)
      })
    })

    describe('--withMetadata', () => {
      it('should execute the pipeline')
      it('should execute the pipeline')
    })
  })
})
