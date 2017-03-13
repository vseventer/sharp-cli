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

// @see http://sharp.dimens.io/en/stable/api-resize/

// Strict mode.
'use strict'

// Package modules.
const expect = require('must')
const sinon = require('sinon')
const mustSinon = require('must-sinon')
const Yargs = require('yargs')

// Local modules.
const resize = require('../../cmd/resize')
const queue = require('../../lib/queue')
const sharp = require('../mocks/sharp')

// Configure.
mustSinon(expect)

// Test suite.
describe('resize', () => {
  const cli = (new Yargs()).command(resize)

  // Default width × height.
  const x = '100'
  const y = '200'

  // Reset.
  afterEach('queue', () => queue.splice(0))
  afterEach('sharp', sharp.prototype.reset)

  describe('<width> [height]', () => {
    // Run.
    beforeEach((done) => cli.parse([ 'resize', x, y ], done))

    // Tests.
    it('should set the width and height flags', () => {
      const args = cli.parsed.argv
      expect(args).to.have.property('width', parseInt(x, 10))
      expect(args).to.have.property('height', parseInt(y, 10))
    })
    it('should update the pipeline', () => {
      expect(queue.pipeline).to.have.length(1)
      expect(queue.pipeline).to.include('resize')
    })
    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.resize).to.have.been.calledWith(
        parseInt(x, 10),
        parseInt(y, 10)
      )
    })
  })

  describe('<width> [auto-height]', () => {
    beforeEach((done) => cli.parse([ 'resize', x, '0' ], done))

    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.resize).to.have.been.calledWith(parseInt(x, 10), null)
    })
  })

  describe('<auto-width> [height]', () => {
    beforeEach((done) => cli.parse([ 'resize', '0', y ], done))

    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.resize).to.have.been.calledWith(null, parseInt(y, 10))
    })
  })

  describe('<width>', () => {
    beforeEach((done) => cli.parse([ 'resize', x ], done))

    it('should execute the pipeline', () => {
      const pipeline = queue.drain(sharp())
      expect(pipeline.resize).to.have.been.calledWith(
        parseInt(x, 10),
        parseInt(x, 10)
      )
    })
  })

  describe('[options]', () => {
    describe('--centreSampling', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--centreSampling' ], done))

      it('should set the centreSampling and centerSampling flags', () => {
        const args = cli.parsed.argv
        expect(args).to.have.property('centreSampling', true)
        expect(args).to.have.property('centerSampling', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.resize).to.have.been.calledWithMatch(
          sinon.match.any,
          sinon.match.any,
          { centreSampling: true }
        )
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#crop
    describe('--crop', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--crop', 'centre' ], done))

      it('should set the crop flag', () => {
        expect(cli.parsed.argv).to.have.property('crop', 'centre')
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('resize')
        expect(queue.pipeline).to.include('crop')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.crop).to.have.been.calledWith('centre')
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#ignoreaspectratio
    describe('--ignoreAspectRatio', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--ignoreAspectRatio' ], done))

      it('should set the ignoreAspectRatio flag', () => {
        expect(cli.parsed.argv).to.have.property('ignoreAspectRatio', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('resize')
        expect(queue.pipeline).to.include('ignoreAspectRatio')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.ignoreAspectRatio).to.have.been.called()
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#resize
    describe('--interpolator', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--interpolator', 'bicubic' ], done))

      it('should set the interpolator flag', () => {
        expect(cli.parsed.argv).to.have.property('interpolator', 'bicubic')
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.resize).to.have.been.calledWithMatch(
          sinon.match.any,
          sinon.match.any,
          { interpolator: 'bicubic' }
        )
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#resize
    describe('--kernel', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--kernel', 'lanczos3' ], done))

      it('should set the interpolator flag', () => {
        expect(cli.parsed.argv).to.have.property('kernel', 'lanczos3')
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(1)
        expect(queue.pipeline).to.include('resize')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.resize).to.have.been.calledWithMatch(
          sinon.match.any,
          sinon.match.any,
          { kernel: 'lanczos3' }
        )
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#max
    describe('--max', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--max' ], done))

      it('should set the ignoreAspectRatio flag', () => {
        expect(cli.parsed.argv).to.have.property('max', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('resize')
        expect(queue.pipeline).to.include('max')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.max).to.have.been.called()
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#min
    describe('--min', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--min' ], done))

      it('should set the min flag', () => {
        expect(cli.parsed.argv).to.have.property('min', true)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('resize')
        expect(queue.pipeline).to.include('min')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.min).to.have.been.called()
      })
    })

    // @see http://sharp.dimens.io/en/stable/api-resize/#withoutenlargement
    describe('--withoutEnlargement', () => {
      beforeEach((done) => cli.parse([ 'resize', x, y, '--no-withoutEnlargement' ], done))

      it('should set the withoutEnlargement flag', () => {
        expect(cli.parsed.argv).to.have.property('withoutEnlargement', false)
      })
      it('should update the pipeline', () => {
        expect(queue.pipeline).to.have.length(2)
        expect(queue.pipeline).to.include('resize')
        expect(queue.pipeline).to.include('withoutEnlargement')
      })
      it('should execute the pipeline', () => {
        const pipeline = queue.drain(sharp())
        expect(pipeline.withoutEnlargement).to.have.been.calledWith(false)
      })
    })
  })
})
