/* global describe, it, before, after, beforeEach, afterEach */
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
const tempy = require('tempy')

// Local modules.
const convert = require('../lib/convert')

// Test suite.
describe('convert', () => {
  // Default input.
  const input = path.join(__dirname, './fixtures/input.jpg')

  describe('files', () => {
    // Default output.
    let copy, dest
    before(() => { dest = tempy.directory() })
    beforeEach(() => { copy = tempy.file() })
    beforeEach((done) => { fs.copy(input, copy, done) })
    afterEach((done) => fs.remove(copy, done))
    afterEach((done) => fs.emptyDir(dest, done))
    after((done) => fs.remove(dest, done))

    // Tests.
    it('must convert a file', () => {
      return convert
        .files([input], dest)
        .then(([info]) => expect(fs.existsSync(info.path)).to.be.true)
    })
    it('must convert a file and output to an existing directory', () => {
      // Negative test for directory that does not exist.
      const rand = '' + Math.random()
      return convert
        .files([input, input], rand)
        .then(() => { throw new Error('STOP') })
        .catch((err) => {
          expect(err).to.exist()
          expect(err).to.have.property('message')
          expect(err.message).to.contain(`${rand}/input.jpg`)
          expect(err.message).to.contain('no such file or directory')
        })
    })
    it('must convert multiple files', () => {
      return convert
        .files([input, input], dest)
        .then((info) => expect(info).to.have.length(2))
    })
    it('must support output templates', () => {
      const rand = Math.random()
      return convert
        .files([input], path.join(dest, `{name}-${rand}{ext}`))
        .then(([info]) => expect(info.path).to.contain(`input-${rand}.jpg`))
    })
    it('must allow the same file as input and output', () => {
      return convert
        .files([copy], path.dirname(copy))
    })
  })
  describe('stream', () => {
    // Default output.
    let dest
    beforeEach(() => { dest = tempy.file() })
    afterEach((done) => fs.remove(dest, done))

    // Tests.
    it('must convert a file', () => {
      return convert
        .stream(fs.createReadStream(input), fs.createWriteStream(dest))
        .then((info) => {
          expect(info.format).to.exist()
          expect(info.path).not.to.exist()
          expect(fs.existsSync(dest)).to.be.true()
        })
    })
  })
})
