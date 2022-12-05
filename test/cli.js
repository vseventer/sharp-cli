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
  // Defaults (avoid path.join` to test for input normalizing).
  /* eslint-disable n/no-path-concat */
  const input = `${__dirname}/../test/fixtures/input.jpg`
  const output = `${__dirname}/../test/`
  /* eslint-enable n/no-path-concat */
  const ioFlags = ['-i', input, '-o', output]

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<options>', () => {
    describe('--adaptiveFiltering', () => {
      // Run.
      beforeEach(() => cli.parse(['--adaptiveFiltering', ...ioFlags]))

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
      beforeEach(() => cli.parse(['--alphaQuality', alphaQuality, ...ioFlags]))

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

    describe('--bitdepth', () => {
      // Default bitdepth.
      const bitdepth = '4'

      // Run.
      beforeEach(() => cli.parse(['--bitdepth', bitdepth, ...ioFlags]))

      // Tests.
      it('must set the bitdepth flag', () => {
        expect(cli.parsed.argv).to.have.property('bitdepth', parseInt(bitdepth, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { bitdepth: parseInt(bitdepth, 10) })
      })
    })

    describe('--chromaSubsampling', () => {
      // Default chromaSubsampling.
      const chromaSubsampling = '4:4:4'

      // Run.
      beforeEach(() => cli.parse(['--chromaSubsampling', chromaSubsampling, ...ioFlags]))

      // Tests.
      it('must set the chromaSubsampling flag', () => {
        expect(cli.parsed.argv).to.have.property('chromaSubsampling', chromaSubsampling)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('avif')
        expect(queue.pipeline).to.include('jpeg')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.jpeg, { chromaSubsampling })
      })
    })

    ;['colors', 'colours'].forEach(alias => {
      // Run.
      describe(`--${alias}`, () => {
        // Default colors.
        const colors = '128'

        // Run.
        beforeEach(() => cli.parse([`--${alias}`, colors, ...ioFlags]))

        // Tests.
        it('must set the colors flag', () => {
          expect(cli.parsed.argv).to.have.property('colors', parseInt(colors, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(2)
          expect(queue.pipeline).to.include('gif')
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
      beforeEach(() => cli.parse(['--compression', compression, ...ioFlags]))

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

    ;['c', 'compressionLevel'].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default level.
        const level = '6'

        // Run.
        beforeEach(() => cli.parse([`--${alias}`, level, ...ioFlags]))

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

    describe('--delay', () => {
      // Default delay.
      const delay = '1'

      // Run.
      beforeEach(() => cli.parse(['--delay', delay, ...ioFlags]))

      // Tests.
      it('must set the delay flag', () => {
        expect(cli.parsed.argv).to.have.property('delay', parseInt(delay, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('gif')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.gif, { delay: parseInt(delay, 10) })
      })
    })

    describe('--density', () => {
      // Default density.
      const density = '300'

      // Run.
      beforeEach(() => cli.parse(['--density', density, ...ioFlags]))

      // Tests.
      it('must set the density flag', () => {
        expect(cli.parsed.argv).to.have.property('density', parseInt(density, 10))
      })
    })

    describe('--dither', () => {
      // Default dither.
      const dither = '0.5'

      // Run.
      beforeEach(() => cli.parse(['--dither', dither, ...ioFlags]))

      // Tests.
      it('must set the dither flag', () => {
        expect(cli.parsed.argv).to.have.property('dither', parseFloat(dither))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('gif')
        expect(queue.pipeline).to.include('png')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.gif, { dither: parseFloat(dither), force: false })
        sinon.assert.calledWithMatch(pipeline.png, { dither: parseFloat(dither), force: false })
      })
    })

    describe('--effort', () => {
      // Default effort.
      const effort = '1'

      // Run.
      beforeEach(() => cli.parse(['--effort', effort, ...ioFlags]))

      // Tests.
      it('must set the effort flag', () => {
        expect(cli.parsed.argv).to.have.property('effort', parseInt(effort, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(5)
        expect(queue.pipeline).to.include('avif')
        expect(queue.pipeline).to.include('gif')
        expect(queue.pipeline).to.include('heif')
        expect(queue.pipeline).to.include('png')
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.avif, { effort: parseInt(effort, 10) })
      })
    })

    ;['f', 'format'].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default format.
        const format = 'jpeg'

        // Run.
        beforeEach(() => cli.parse([`--${alias}`, format, ...ioFlags]))

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

    ;['h', 'help'].forEach((alias) => {
      describe(`--${alias}`, () => {
        it('must display help', () => {
          const promise = cli.parse([`--${alias}`])
          return expect(promise).to.reject.to.contain('Commands')
        })
      })
    })

    describe('--hcompression', () => {
      // Default compression.
      const compression = 'hevc'

      // Run.
      beforeEach(() => cli.parse(['--hcompression', compression, ...ioFlags]))

      // Tests.
      it('must set the compression flag', () => {
        expect(cli.parsed.argv).to.have.property('hcompression', compression)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('heif')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.heif, { compression })
      })
    })

    ;['i', 'input'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, input, input, '-o', output]))

        // Tests.
        it('must set the input flag', () => {
          const args = cli.parsed.argv
          expect(args).to.have.property('input')
          expect(args.input).to.eql([input, input])
        })

        it('must fail when no input is given', () => {
          const promise = cli.parse([`--${alias}`, '-o', output])
          return expect(promise).to.reject.to.match('Not enough arguments')
        })
      })
    })

    describe('--level', () => {
      // Default level.
      const level = '2'

      // Run.
      beforeEach(() => cli.parse(['--level', level, ...ioFlags]))

      // Tests.
      it('must set the level flag', () => {
        expect(cli.parsed.argv).to.have.property('level', parseInt(level, 10))
      })
    })

    describe('--loop', () => {
      // Default dither.
      const loop = '2'

      // Run.
      beforeEach(() => cli.parse(['--loop', loop, ...ioFlags]))

      // Tests.
      it('must set the loop flag', () => {
        expect(cli.parsed.argv).to.have.property('loop', parseInt(loop, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('gif')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.gif, { loop: parseInt(loop, 10) })
      })
    })

    describe('--lossless', () => {
      // Run.
      beforeEach(() => cli.parse(['--lossless', ...ioFlags]))

      // Tests.
      it('must set the lossless flag', () => {
        expect(cli.parsed.argv).to.have.property('lossless', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(3)
        expect(queue.pipeline).to.include('avif')
        expect(queue.pipeline).to.include('heif')
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.heif, { lossless: true })
        sinon.assert.calledWithMatch(pipeline.webp, { lossless: true })
      })
    })

    describe('--minSize', () => {
      // Run.
      beforeEach(() => cli.parse(['--minSize', ...ioFlags]))

      // Tests.
      it('must set the minSize flag', () => {
        expect(cli.parsed.argv).to.have.property('minSize', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { minSize: true })
      })
    })

    describe('--mixed', () => {
      // Run.
      beforeEach(() => cli.parse(['--mixed', ...ioFlags]))

      // Tests.
      it('must set the lossless flag', () => {
        expect(cli.parsed.argv).to.have.property('mixed', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { mixed: true })
      })
    })

    describe('--mozjpeg', () => {
      // Run.
      beforeEach(() => cli.parse(['--mozjpeg', ...ioFlags]))

      // Tests.
      it('must set the mozjpeg flag', () => {
        expect(cli.parsed.argv).to.have.property('mozjpeg', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('jpeg')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.jpeg, { mozjpeg: true })
      })
    })

    describe('--nearLossless', () => {
      // Run.
      beforeEach(() => cli.parse(['--nearLossless', ...ioFlags]))

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

    ;['optimise', 'optimize'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, ...ioFlags]))

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

    ;['optimiseCoding', 'optimizeCoding'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--no-${alias}`, ...ioFlags]))

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

    ;['optimiseScans', 'optimizeScans'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run (implies --progressive).
        beforeEach(() => cli.parse([`--${alias}`, '-p', ...ioFlags]))

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

    ;['o', 'output'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, output, '-i', input]))

        // Tests.
        it('must set the output flag', () => {
          expect(cli.parsed.argv).to.have.property('output', output)
        })
      })
    })

    describe('--overshootDeringing', () => {
      // Run.
      beforeEach(() => cli.parse(['--overshootDeringing', ...ioFlags]))

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

    describe('--page', () => {
      // Default page.
      const page = '2'

      // Run.
      beforeEach(() => cli.parse(['--page', page, ...ioFlags]))

      // Tests.
      it('must set the page flag', () => {
        expect(cli.parsed.argv).to.have.property('page', parseInt(page, 10))
      })
    })

    describe('--pages', () => {
      // Default pages.
      const pages = '2'

      // Run.
      beforeEach(() => cli.parse(['--pages', pages, ...ioFlags]))

      // Tests.
      it('must set the pages flag', () => {
        expect(cli.parsed.argv).to.have.property('pages', parseInt(pages, 10))
      })
    })

    describe('--palette', () => {
      // Run.
      beforeEach(() => cli.parse(['--palette', ...ioFlags]))

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
      beforeEach(() => cli.parse(['--predictor', predictor, ...ioFlags]))

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
      beforeEach(() => cli.parse(['--pyramid', ...ioFlags]))

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

    ;['p', 'progressive'].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, ...ioFlags]))

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

    ;['q', 'quality'].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default quality.
        const quality = '80'

        // Run.
        beforeEach(() => cli.parse([`--${alias}`, quality, ...ioFlags]))

        // Tests.
        it('must set the format flag', () => {
          expect(cli.parsed.argv).to.have.property('quality', parseInt(quality, 10))
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(5)
          expect(queue.pipeline).to.include('avif')
          expect(queue.pipeline).to.include('heif')
          expect(queue.pipeline).to.include('jpeg')
          expect(queue.pipeline).to.include('tiff')
          expect(queue.pipeline).to.include('webp')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.avif, { force: false, quality: parseInt(quality, 10) })
          // sharp.avif === sharp.heif - so ensure flags are always passed correctly.
          sinon.assert.alwaysCalledWithMatch(pipeline.heif, { force: false, quality: parseInt(quality, 10) })
          sinon.assert.calledWithMatch(pipeline.jpeg, { force: false, quality: parseInt(quality, 10) })
          sinon.assert.calledWithMatch(pipeline.tiff, { force: false, quality: parseInt(quality, 10) })
          sinon.assert.calledWithMatch(pipeline.webp, { force: false, quality: parseInt(quality, 10) })
        })
      })
    })

    ;['quantisationTable', 'quantizationTable'].forEach((alias) => {
      // Default quantisation table.
      const table = '1'

      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, table, ...ioFlags]))

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

    ;['reoptimise', 'reoptimize'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, `--${alias}`, ...ioFlags]))

        // Tests.
        it('must set the reoptimise flag', () => {
          expect(cli.parsed.argv).to.have.property('reoptimise', true)
        })
        it('must update the pipeline', () => {
          expect(queue.pipeline).to.have.length(1)
          expect(queue.pipeline).to.include('gif')
        })
        it('must execute the pipeline', () => {
          const pipeline = queue.drain(sharp())
          sinon.assert.calledWithMatch(pipeline.gif, { reoptimise: true })
        })
      })
    })

    describe('--resolutionUnit', () => {
      // Default unit.
      const unit = 'cm'

      // Run.
      beforeEach(() => cli.parse(['--resolutionUnit', unit, ...ioFlags]))

      // Tests.
      it('must set the smartSubsample flag', () => {
        expect(cli.parsed.argv).to.have.property('resolutionUnit', unit)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { resolutionUnit: unit })
      })
    })

    describe('--smartSubsample', () => {
      // Run.
      beforeEach(() => cli.parse(['--smartSubsample', ...ioFlags]))

      // Tests.
      it('must set the smartSubsample flag', () => {
        expect(cli.parsed.argv).to.have.property('smartSubsample', true)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('webp')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.webp, { smartSubsample: true })
      })
    })

    describe('--tileBackground', () => {
      // Default tileBackground.
      const tileBackground = 'rgb(0, 0, 0)'

      // Run.
      beforeEach(() => cli.parse(['--tileBackground', tileBackground, ...ioFlags]))

      // Tests.
      it('must set the tileBackground flag', () => {
        expect(cli.parsed.argv).to.have.property('tileBackground', tileBackground)
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('tiff')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.tiff, { background: tileBackground })
      })
    })

    describe('--tileHeight', () => {
      // Default tileHeight.
      const tileHeight = '100'

      // Run.
      beforeEach(() => cli.parse(['--tileHeight', tileHeight, ...ioFlags]))

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
      beforeEach(() => cli.parse(['--tileHeight', tileHeight, '--tileWidth', tileWidth, ...ioFlags]))

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
      beforeEach(() => cli.parse(['--trellisQuantisation', ...ioFlags]))

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

    ;['v', 'version'].forEach((alias) => {
      describe(`--${alias}`, () => {
        it('must set the version flag', (done) => {
          cli.parse([`--${alias}`], (err, args, output) => {
            expect(args).to.have.property('version', true)
            done(err)
          })
        })
        it('must display the version number', (done) => {
          cli.parse([`--${alias}`], (err, args, output) => {
            expect(output).to.equal(pkg.version)
            done(err)
          })
        })
      })
    })

    describe('--timeout', () => {
      // Default timeout.
      const timeout = '2'

      // Run.
      beforeEach(() => cli.parse(['--timeout', timeout, ...ioFlags]))

      // Tests.
      it('must set the timeout flag', () => {
        expect(cli.parsed.argv).to.have.property('timeout', parseInt(timeout, 10))
      })
      it('must update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('timeout')
      })
      it('must execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        sinon.assert.calledWithMatch(pipeline.timeout, { seconds: parseInt(timeout, 10) })
      })
    })

    ;['m', 'withMetadata'].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        beforeEach(() => cli.parse([`--${alias}`, ...ioFlags]))

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
      beforeEach(() => cli.parse(['--xres', xRes, ...ioFlags]))

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
      beforeEach(() => cli.parse(['--yres', yRes, ...ioFlags]))

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
    beforeEach(() => cli.parse(['flip', ...ioFlags]))

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
