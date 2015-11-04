/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mark van Seventer
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
'use strict';

// Standard lib.
var path = require('path');

// Package modules.
var chai      = require('chai'),
    sharp     = require('sharp'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai');

// Local modules.
var runner = require('../lib/runner');

// Configure.
chai.use(sinonChai);
var expect = chai.expect;

// Fixtures.
var fixturePath = path.join(__dirname, './fixtures'),
    input       = path.join(fixturePath, 'input.jpg'),
    output      = path.join(fixturePath, 'output.jpg');

// Test suite.
describe('runner', function() {
  // Tests.
  it('should run.', function() {
    expect(runner.run).to.exist;
  });

  // Options.
  describe('options', function() {
    // Prepopulate flags.
    beforeEach('flags', function() {
      this.flags = { output: output };
    });
    afterEach('flags', function() {
      delete this.flags; // Cleanup.
    });

    // Manage spies.
    before('spy', function() {
      this.spies = [ ];
      this.spyOn = function(method) {
        // Re-use existing spy.
        if(sharp.prototype[method].isSinonProxy) {
          return sharp.prototype[method];
        }

        // Create a new spy.
        var spy = sinon.spy(sharp.prototype, method);
        this.spies.push(spy);
        return spy;
      };
    });
    afterEach('spy', function() {
      this.spies.forEach(function(spy) {
        spy.reset();
      });
    });
    after('spy', function() {
      while(undefined !== this.spies[0]) {
        this.spies.shift().restore();
      }
      delete this.spies; // Cleanup.
    });

    // Helper method to test simple boolean flags.
    var testBoolean = function(name) {
      return /* mocha:it */ function() {
        var spy = this.spyOn(name);
        this.flags[name] = true;
        return runner.run(input, this.flags).then(function() {
          expect(spy).to.be.calledOnce;
          expect(spy.args[0]).to.be.empty;
        });
      };
    };

    // Tests.
    it('--background <string>');
    it('--background <string> (invalid value)');
    it('--blur', testBoolean('blur'));
    it('--blur [number] (invalid value)');
    it('--compressionLevel <number>');
    it('--compressionLevel <number> (invalid value)');
    it('--crop', testBoolean('crop'));
    it('--crop [string]');
    it('--crop [string] (invalid value)');
    it('--embed', testBoolean('embed'));
    it('--extractHeight <number>');
    it('--extractHeight <number> (invalid value)');
    it('--extractLeft <number>');
    it('--extractLeft <number> (invalid value)');
    it('--extractTop <number>');
    it('--extractTop <number> (invalid value)');
    it('--extractWidth <number>');
    it('--extractWidth <number> (invalid value)');
    it('--format <string>', function() {
      var spy = this.spyOn('toFormat');
      this.flags.format = 'jpeg';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'jpeg' ]);
      });
    });
    it('--format <string> (invalid value)', function() {
      var spy = this.spyOn('toFormat');
      this.flags.format = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'foo' ]);
        expect(err).to.have.property('message', 'Unsupported format foo');
      });
    });
    it('--flatten', testBoolean('flatten'));
    it('--flip',    testBoolean('flip'));
    it('--flop',    testBoolean('flop'));
    it('--gamma',   testBoolean('gamma'));
    it('--gamma <number>');
    it('--gamma <number> (invalid value)');
    it('--grayscale', testBoolean('grayscale'));
    it('--height <number>', function() {
      var spy = this.spyOn('resize');
      this.flags.height = 100;
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN, 100 ]);
      });
    });
    it('--height <number> (invalid value)', function() {
      var spy = this.spyOn('resize');
      this.flags.height = 'foo';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN, NaN ]);
      });
    });
    it('--ignoreAspectRatio', testBoolean('ignoreAspectRatio'));
    it('--interpolateWith <string>');
    it('--interpolateWith <string> (invalid value)');
    it('--limitInputPixels <number>');
    it('--limitInputPixels <number> (invalid value)');
    it('--max', testBoolean('max'));
    it('--max', testBoolean('min'));
    it('--max', testBoolean('normalize'));
    it('--output <string>');
    it('--output <string> (invalid value).');
    it('--optimizeScans', testBoolean('optimizeScans'));
    it('--overlay <string>');
    it('--overlay <string> (invalid value)');
    it('--overshootDeringing', testBoolean('overshootDeringing'));
    it('--progressive',        testBoolean('progressive'));
    it('--quality <number>');
    it('--quality <number> (invalid value)');
    it('--rotate <number>');
    it('--rotate <number> (invalid value)');
    it('--sequentialRead', testBoolean('sequentialRead'));
    it('--sharpen',        testBoolean('sharpen'));
    it('--sharpen [number]');
    it('--sharpen [number] (invalid value)');
    it('--sharpenFlat <number>');
    it('--sharpenFlat <number> (invalid value)');
    it('--sharpenJagged <number>');
    it('--sharpenJagged <number> (invalud value)');
    it('--tile', testBoolean('tile'));
    it('--tile [number]');
    it('--tile [number] (invalid value)');
    it('--tileOverlap <number>');
    it('--tileOverlap <number> (invalid value)');
    it('--trellisQuantization', testBoolean('trellisQuantization'));
    it('--width <number>', function() {
      var spy = this.spyOn('resize');
      this.flags.width = 100;
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 100, NaN ]);
      });
    });
    it('--width <number> (invalid value)', function() {
      var spy = this.spyOn('resize');
      this.flags.width = 'foo';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN, NaN ]);
      });
    });
    it('--withoutAdaptiveFiltering', testBoolean('withoutAdaptiveFiltering'));
    it('--withoutChromaSubsampling', testBoolean('withoutChromaSubsampling'));
    it('--withoutEnlargement',       testBoolean('withoutEnlargement'));
    it('--withoutMetadata');
  });
});