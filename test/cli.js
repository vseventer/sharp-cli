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

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const expect = require('must')
const sinon = require('sinon')

// Local modules.
const cli = require('../lib/cli')
const pkg = require('../package.json')
const queue = require('../lib/queue')
const sharp = require('./mocks/sharp')

// Test suite.
describe(`${pkg.name} <options> [command..]`, () => {
  // Defaults (avoid `path.join` to test for input normalizing).
  const input = `${__dirname}/../test/fixtures/input.jpg`
  const output = `${__dirname}/../test/`
  const ioFlags = [ '-i', input, '-o', output ]

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<options>', () => {
    describe('--adaptiveFiltering', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--adaptiveFiltering', ...ioFlags ], done))

      // Tests.
      it('must set the adaptiveFiltering flag', () => {
        expect(cli.parsed.argv).to.have.property('adaptiveFiltering', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('png')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.png, { adaptiveFiltering: true })
      })
    })

    describe('--alphaQuality', () => {
      // Default quality.
      const alphaQuality = '80'

      // Run.
      beforeEach((done) => cli.parse([ '--alphaQuality', alphaQuality, ...ioFlags ], done))

      // Tests.
      it('must set the alphaQuality flag', () => {
        expect(cli.parsed.argv).to.have.property('alphaQuality', parseInt(alphaQuality, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { alphaQuality: parseInt(alphaQuality, 10) })
      })
    })

    describe('--chromaSubsampling', () => {
      // Default chromaSubsampling.
      const chromaSubsampling = '4:4:4'

      // Run.
      beforeEach((done) => cli.parse([ '--chromaSubsampling', chromaSubsampling, ...ioFlags ], done))

      // Tests.
      it('must set the chromaSubsampling flag', () => {
        expect(cli.parsed.argv).to.have.property('chromaSubsampling', chromaSubsampling)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('jpeg')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.jpeg, { chromaSubsampling })
      })
    })

    void [ 'colors', 'colours' ].forEach(alias => {
      // Run.
      describe(`--${alias}`, () => {
        // Default colors.
        const colors = '128'

        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, colors, ...ioFlags ], done))

        // Tests.
        it('must set the colors flag', () => {
          expect(cli.parsed.argv).to.have.property('colors', parseInt(colors, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('png')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.png, { colors: parseInt(colors, 10) })
        })
      })
    })

    describe('--compression', () => {
      // Default compression.
      const compression = 'deflate'

      // Run.
      beforeEach((done) => cli.parse([ '--compression', compression, ...ioFlags ], done))

      // Tests.
      it('must set the compression flag', () => {
        expect(cli.parsed.argv).to.have.property('compression', compression)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { compression })
      })
    })

    void [ 'c', 'compressionLevel' ].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default level.
        const level = '6'

        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, level, ...ioFlags ], done))

        // Tests.
        it('must set the format flag', () => {
          expect(cli.parsed.argv).to.have.property('compressionLevel', parseInt(level, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('png')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.png, { compressionLevel: parseInt(level, 10) })
        })
      })
    })

    describe('--dither', () => {
      // Default dither.
      const dither = '0.5'

      // Run.
      beforeEach((done) => cli.parse([ '--dither', dither, ...ioFlags ], done))

      // Tests.
      it('must set the dither flag', () => {
        expect(cli.parsed.argv).to.have.property('dither', parseFloat(dither))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('png')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.png, { dither: parseFloat(dither) })
      })
    })

    void [ 'f', 'format' ].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default format.
        const format = 'jpeg'

        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, format, ...ioFlags ], done))

        // Tests.
        it('must set the format flag', () => {
          expect(cli.parsed.argv).to.have.property('format', format)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('format')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWith(pipeline.toFormat, format)
        })
      })
    })

    void [ 'h', 'help' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        it('must set the help flag', (done) => {
          cli.parse([ `--${alias}` ], (err, args, output) => {
            expect(args).to.have.property('help', true)
            done(err)
          })
        })
        it('must display help', (done) => {
          cli.parse([ `--${alias}` ], (err, args, output) => {
            expect(output).to.exist()
            expect(output).to.contain('Commands')
            expect(output).to.contain('Options')
            expect(output).to.contain('Example')
            done(err)
          })
        })
      })
    })

    void [ 'i', 'input' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, input, input, '-o', output ], done))

        // Tests.
        it('must set the input flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('input')
          expect(args.input).to.eql([ path.normalize(input), path.normalize(input) ])
        })

        it('must fail when no input is given', (done) => {
          cli.parse([ `--${alias}`, '-o', output ], (err) => {
            expect(err).to.exist()
            expect(err).to.have.property('message')
            expect(err.message).to.contain('Not enough arguments')
            done()
          })
        })
      })
    })

    void [ 'l', 'limitInputPixels' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, '10', ...ioFlags ], done))

        // Tests.
        it('must set the limitInputPixels flag', () => {
          expect(cli.parsed.argv).to.have.property('limitInputPixels', 10)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('limitInputPixels')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.called(pipeline.limitInputPixels)
        })
      })
    })

    describe('--lossless', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--lossless', ...ioFlags ], done))

      // Tests.
      it('must set the lossless flag', () => {
        expect(cli.parsed.argv).to.have.property('lossless', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { lossless: true })
      })
    })

    describe('--nearLossless', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--nearLossless', ...ioFlags ], done))

      // Tests.
      it('must set the nearLossless flag', () => {
        expect(cli.parsed.argv).to.have.property('nearLossless', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { nearLossless: true })
      })
    })

    void [ 'optimise', 'optimize' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, ...ioFlags ], done))

        // Tests.
        it('must set the optimise flag', () => {
          expect(cli.parsed.argv).to.have.property('optimise', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('jpeg')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, {
            optimiseScans: true,
            overshootDeringing: true,
            trellisQuantisation: true
          })
        })
      })
    })

    void [ 'optimiseCoding', 'optimizeCoding' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--no-${alias}`, ...ioFlags ], done))

        // Tests.
        it('must set the optimiseScans flag', () => {
          expect(cli.parsed.argv).to.have.property('optimiseCoding', false)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('jpeg')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, { optimiseCoding: false })
        })
      })
    })

    void [ 'optimiseScans', 'optimizeScans' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run (implies --progressive).
        beforeEach((done) => cli.parse([ `--${alias}`, '-p', ...ioFlags ], done))

        // Tests.
        it('must set the optimiseScans flag', () => {
          expect(cli.parsed.argv).to.have.property('optimiseScans', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(2)
          expect(queue.pipeline).to.include('jpeg')
          expect(queue.pipeline).to.include('png') // Because: -p.
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, { optimiseScans: true })
        })
      })
    })

    void [ 'o', 'output' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, output, '-i', input ], done))

        // Tests.
        it('must set the output flag', () => {
          expect(cli.parsed.argv).to.have.property('output', path.normalize(output))
        })
      })
    })

    describe('--overshootDeringing', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--overshootDeringing', ...ioFlags ], done))

      // Tests.
      it('must set the overshootDeringing flag', () => {
        expect(cli.parsed.argv).to.have.property('overshootDeringing', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('jpeg')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.jpeg, { overshootDeringing: true })
      })
    })

    describe('--palette', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--palette', ...ioFlags ], done))

      // Tests.
      it('must set the palette flag', () => {
        expect(cli.parsed.argv).to.have.property('palette', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('png')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.png, { palette: true })
      })
    })

    describe('--predictor', () => {
      // Default predictor.
      const predictor = 'float'

      // Run.
      beforeEach((done) => cli.parse([ '--predictor', predictor, ...ioFlags ], done))

      // Tests.
      it('must set the predictor flag', () => {
        expect(cli.parsed.argv).to.have.property('predictor', predictor)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { predictor })
      })
    })

    describe('--pyramid', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--pyramid', ...ioFlags ], done))

      // Tests.
      it('must set the pyramid flag', () => {
        expect(cli.parsed.argv).to.have.property('pyramid', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { pyramid: true })
      })
    })

    void [ 'p', 'progressive' ].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, ...ioFlags ], done))

        // Tests.
        it('must set the format flag', () => {
          expect(cli.parsed.argv).to.have.property('progressive', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(2)
          expect(queue.pipeline).to.include('jpeg')
          expect(queue.pipeline).to.include('png')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, { progressive: true })
          sinon.assert.calledWithMatch(pipeline.png, { progressive: true })
        })
      })
    })

    void [ 'q', 'quality' ].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default quality.
        const quality = '80'

        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, quality, ...ioFlags ], done))

        // Tests.
        it('must set the format flag', () => {
          expect(cli.parsed.argv).to.have.property('quality', parseInt(quality, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(3)
          expect(queue.pipeline).to.include('jpeg')
          expect(queue.pipeline).to.include('tiff')
          expect(queue.pipeline).to.include('webp')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, { quality: parseInt(quality, 10) })
          sinon.assert.calledWithMatch(pipeline.tiff, { quality: parseInt(quality, 10) })
          sinon.assert.calledWithMatch(pipeline.webp, { quality: parseInt(quality, 10) })
        })
      })
    })

    void [ 'quantisationTable', 'quantizationTable' ].forEach((alias) => {
      // Default quantisation table.
      const table = '1'

      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, table, ...ioFlags ], done))

        // Tests.
        it('must set the quantisationTable flag', () => {
          expect(cli.parsed.argv).to.have.property('quantisationTable', parseInt(table, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('jpeg')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.jpeg, { quantisationTable: parseInt(table, 10) })
        })
      })
    })

    describe('--sequentialRead', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--sequentialRead', ...ioFlags ], done))

      // Tests.
      it('must set the sequentialRead flag', () => {
        expect(cli.parsed.argv).to.have.property('sequentialRead', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('sequentialRead')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.called(pipeline.sequentialRead)
      })
    })

    describe('--squash', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--squash', ...ioFlags ], done))

      // Tests.
      it('must set the squash flag', () => {
        expect(cli.parsed.argv).to.have.property('squash', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { squash: true })
      })
    })

    describe('--tileHeight', () => {
      // Default tileHeight.
      const tileHeight = '100'

      // Run.
      beforeEach((done) => cli.parse([ '--tileHeight', tileHeight, ...ioFlags ], done))

      // Tests.
      it('must set the tileHeight flag', () => {
        expect(cli.parsed.argv).to.have.property('tileHeight', parseInt(tileHeight, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, {
          tile: true,
          tileHeight: parseInt(tileHeight, 10),
          tileWidth: parseInt(tileHeight, 10)
        })
      })
    })

    describe('--tileWidth', () => {
      // Default tileHeight and tileWidth.
      const tileHeight = '100'
      const tileWidth = '50'

      // Run.
      beforeEach((done) => cli.parse([ '--tileHeight', tileHeight, '--tileWidth', tileWidth, ...ioFlags ], done))

      // Tests.
      it('must set the tileWidth flag', () => {
        expect(cli.parsed.argv).to.have.property('tileWidth', parseInt(tileWidth, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, {
          tile: true,
          tileHeight: parseInt(tileHeight, 10),
          tileWidth: parseInt(tileWidth, 10)
        })
      })
    })

    describe('--trellisQuantisation', () => {
      // Run.
      beforeEach((done) => cli.parse([ '--trellisQuantisation', ...ioFlags ], done))

      // Tests.
      it('must set the trellisQuantisation flag', () => {
        expect(cli.parsed.argv).to.have.property('trellisQuantisation', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('jpeg')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.jpeg, { trellisQuantisation: true })
      })
    })

    void [ 'v', 'version' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        it('must set the version flag', (done) => {
          cli.parse([ `--${alias}` ], (err, args, output) => {
            expect(args).to.have.property('version', true)
            done(err)
          })
        })
        it('must display the version number', (done) => {
          cli.parse([ `--${alias}` ], (err, args, output) => {
            expect(output).to.equal(pkg.version)
            done(err)
          })
        })
      })
    })

    void [ 'm', 'withMetadata' ].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach((done) => cli.parse([ `--${alias}`, ...ioFlags ], done))

        // Tests.
        it('must set the withMetadata flag', () => {
          expect(cli.parsed.argv).to.have.property('withMetadata', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('withMetadata')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.called(pipeline.withMetadata)
        })
      })
    })

    describe('--xres', () => {
      // Default horizontal resolution.
      const xRes = '1.5'

      // Run.
      beforeEach((done) => cli.parse([ '--xres', xRes, ...ioFlags ], done))

      // Tests.
      it('must set the xres flag', () => {
        expect(cli.parsed.argv).to.have.property('xres', parseFloat(xRes))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { xres: parseFloat(xRes) })
      })
    })

    describe('--yres', () => {
      // Default vertical resolution.
      const yRes = '1.5'

      // Run.
      beforeEach((done) => cli.parse([ '--yres', yRes, ...ioFlags ], done))

      // Tests.
      it('must set the yres flag', () => {
        expect(cli.parsed.argv).to.have.property('yres', parseFloat(yRes))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { yres: parseFloat(yRes) })
      })
    })
  })

  describe('[command]', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'flip', ...ioFlags ], done))

    // Tests.
    it('must update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('flip')
    })
    it('must execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      sinon.assert.called(pipeline.flip)
    })
  })
})
