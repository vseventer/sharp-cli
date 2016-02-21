/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Mark van Seventer
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
var fs   = require('fs'),
    path = require('path');

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
    inputPixel  = path.join(fixturePath, 'input.png'),
    output      = path.join(fixturePath, 'output.jpg'),
    outputTest  = path.join(fixturePath, 'output.test.jpg');

// Test suite.
describe('runner', function() {
  // Prepopulate flags.
  beforeEach('flags', function() {
    this.flags = { output: output };
  });
  afterEach('flags', function() {
    delete this.flags; // Cleanup.
  });

  // Tests.
  it('should accept a filename.', function() {
    return runner.run(input, this.flags);
  });
  it('should accept a buffer.', function() {
    var buffer = fs.readFileSync(input);
    return runner.run(buffer, this.flags);
  });
  it('should accept a stream.', function() {
    var stream = fs.createReadStream(input);
    return runner.run(stream, this.flags);
  });
  it('should return the output filename.', function() {
    return runner.run(input, this.flags).then(function(outfile) {
      expect(outfile).to.equal(output);
    });
  });
  it('should return nothing when streaming to stdout.', function() {
    var stub = sinon.stub(process.stdout, 'write', function() { });
    return runner.run(input, { }).catch(function(err) {
      // Ensure stub is restored even if an error occurred.
      stub.restore();
      throw err; // Continue with error.
    }).then(function(res) {
      stub.restore();
      expect(stub).to.be.called;
      expect(res).not.to.exist;
    });
  });
  it('should support the same file for input and output.', function() {
    this.flags.output = input;
    return runner.run(input, this.flags);
  });

  // Options.
  describe('options', function() {
    // Manage spies.
    before('spy', function() {
      this.spies = [ ];
      this.spyOn = function(method) {
        // Re-use existing spies.
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

    // Helper to test boolean options.
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
    it('--background <string>', function() {
      var spy = this.spyOn('background');
      this.flags.background = '#FFFFFF';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ '#FFFFFF' ]);
      });
    });
    it('--background <string> (invalid value)', function() {
      var spy = this.spyOn('background');
      this.flags.background = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'foo' ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('unable to parse color');
      });
    });

    it('--blur', testBoolean('blur'));
    it('--blur [number]', function() {
      var spy = this.spyOn('blur');
      this.flags.blur = '1.5';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1.5 ]);
      });
    });
    it('--blur [number] (invalid value)', function() {
      var spy = this.spyOn('blur');
      this.flags.blur = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid blur sigma');
      });
    });

    it('--compressionLevel <number>', function() {
      var spy = this.spyOn('compressionLevel');
      this.flags.compressionLevel = '7';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 7 ]);
      });
    });
    it('--compressionLevel <number> (invalid value)', function() {
      var spy = this.spyOn('compressionLevel');
      this.flags.compressionLevel = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid compressionlevel');
      });
    });

    it('--crop <string>', function() {
      var spy = this.spyOn('crop');
      this.flags.crop = 'north';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'north' ]);
      });
    });
    it('--crop <string> (invalid value)', function() {
      var spy = this.spyOn('crop');
      this.flags.crop = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'foo' ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('unsupported crop gravity');
      });
    });

    it('--embed', testBoolean('embed'));

    it('--extractTop <number>', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = '10';
      this.flags.extractLeft   = '1';
      this.flags.extractWidth  = '1';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 10,
          left   : 1,
          width  : 1,
          height : 1
        }]);
      });
    });
    it('--extractTop <number> (invalid value)', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = 'foo';
      this.flags.extractLeft   = '1';
      this.flags.extractWidth  = '1';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : NaN,
          left   : 1,
          width  : 1,
          height : 1
        }]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('non-integer value for top');
      });
    });
    it('--extractLeft <number>', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = '1';
      this.flags.extractLeft   = '10';
      this.flags.extractWidth  = '1';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : 10,
          width  : 1,
          height : 1
        }]);
      });
    });
    it('--extractLeft <number> (invalid value)', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = '1';
      this.flags.extractLeft   = 'foo';
      this.flags.extractWidth  = '1';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : NaN,
          width  : 1,
          height : 1
        }]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('non-integer value for left');
      });
    });
    it('--extractWidth <number>', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = '1';
      this.flags.extractLeft   = '1';
      this.flags.extractWidth  = '10';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : 1,
          width  : 10,
          height : 1
        }]);
      });
    });
    it('--extractWidth <number> (invalid value)', function() {
      var spy = this.spyOn('extract');
      this.flags.extractTop    = '1';
      this.flags.extractLeft   = '1';
      this.flags.extractWidth  = 'foo';
      this.flags.extractHeight = '1';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : 1,
          width  : NaN,
          height : 1
        }]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('non-integer value for width');
      });
    });
    it('--extractHeight <number>', function() {
      var spy = this.spyOn('extract');
      this.flags.extractHeight = '10';
      this.flags.extractLeft  = '1';
      this.flags.extractTop   = '1';
      this.flags.extractWidth = '1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : 1,
          width  : 1,
          height : 10
        }]);
      });
    });
    it('--extractHeight <number> (invalid value)', function() {
      var spy = this.spyOn('extract');
      this.flags.extractHeight = 'foo';
      this.flags.extractLeft  = '1';
      this.flags.extractTop   = '1';
      this.flags.extractWidth = '1';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([{
          top    : 1,
          left   : 1,
          width  : 1,
          height : NaN
        }]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('non-integer value for height');
      });
    });

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
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('unsupported output format');
      });
    });

    it('--flatten', testBoolean('flatten'));
    it('--flip',    testBoolean('flip'));
    it('--flop',    testBoolean('flop'));

    it('--gamma', testBoolean('gamma'));
    it('--gamma <number>', function() {
      var spy = this.spyOn('gamma');
      this.flags.gamma = '2.1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 2.1 ]);
      });
    });
    it('--gamma <number> (invalid value)', function() {
      var spy = this.spyOn('gamma');
      this.flags.gamma = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid gamma correction');
      });
    });

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

    it('--interpolateWith <string>', function() {
      var spy = this.spyOn('interpolateWith');
      this.flags.interpolateWith = 'bilinear';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'bilinear' ]);
      });
    });
    it('--interpolateWith <string> (invalid value)', function() {
      var spy = this.spyOn('interpolateWith');
      this.flags.interpolateWith = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 'foo' ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid interpolator');
      });
    });

    it('--limitInputPixels <number>', function() {
      var spy = this.spyOn('limitInputPixels');
      this.flags.limitInputPixels = '100000';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 100000 ]);
      });
    });
    it('--limitInputPixels <number> (invalid value)', function() {
      var spy = this.spyOn('limitInputPixels');
      this.flags.limitInputPixels = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid pixel limit');
      });
    });

    it('--max',       testBoolean('max'));
    it('--min',       testBoolean('min'));
    it('--normalize', testBoolean('normalize'));
    it('--negate',    testBoolean('negate'));

    it('--output <string>', function() {
      this.flags.output = outputTest;
      return runner.run(input, this.flags).then(function(dest) {
        var exists = fs.existsSync(dest);
        expect(exists).to.be.true;
      });
    });
    it('--output <string> (invalid value).', function() {
      var spy = this.spyOn('toFile');
      this.flags.output = true;
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).not.to.be.called; // Error occurs in mkdir.
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('path must be a string');
      });
    });

    it('--optimizeScans', testBoolean('optimizeScans'));

    it('--overlay <string>', function() {
      var spy = this.spyOn('overlayWith');
      this.flags.overlay = inputPixel;
      return runner.run(inputPixel, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ inputPixel ]);
      });
    });
    it('--overlay <string> (invalid value)', function() {
      var spy = this.spyOn('overlayWith');
      this.flags.overlay = true;
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ true ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('overlay path must be a string');
      });
    });

    it('--overshootDeringing', testBoolean('overshootDeringing'));
    it('--progressive',        testBoolean('progressive'));

    it('--quality <number>', function() {
      var spy = this.spyOn('quality');
      this.flags.quality = '70';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 70 ]);
      });
    });
    it('--quality <number> (invalid value)', function() {
      var spy = this.spyOn('quality');
      this.flags.quality = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid quality');
      });
    });

    it('--rotate', function() {
      var spy = this.spyOn('rotate');
      this.flags.rotate = '';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ undefined ]);
      });
    });
    it('--rotate <number>', function() {
      var spy = this.spyOn('rotate');
      this.flags.rotate = '180';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 180 ]);
      });
    });
    it('--rotate <number> (invalid value)', function() {
      var spy = this.spyOn('rotate');
      this.flags.rotate = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('unsupported angle');
      });
    });

    it('--sequentialRead', testBoolean('sequentialRead'));

    it('--sharpen', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen = true;
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ undefined, undefined, undefined ]);
      });
    });
    it('--sharpen [number]', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen = '10';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 10, undefined, undefined ]);
      });
    });
    it('--sharpen [number] (invalid value)', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN, undefined, undefined ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid sharpen radius');
      });
    });
    it('--sharpenFlat <number>', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen     = '1';
      this.flags.sharpenFlat = '2.5';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1, 2.5, undefined ]);
      });
    });
    it('--sharpenFlat <number> (invalid value)', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen     = '1';
      this.flags.sharpenFlat = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1, NaN, undefined ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid sharpen level for flat areas');
      });
    });
    it('--sharpenJagged <number>', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen       = '1';
      this.flags.sharpenJagged = '2.5';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1, undefined, 2.5 ]);
      });
    });
    it('--sharpenJagged <number> (invalid value)', function() {
      var spy = this.spyOn('sharpen');
      this.flags.sharpen       = '1';
      this.flags.sharpenJagged = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1, undefined, NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid sharpen level for jagged areas');
      });
    });

    it('--threshold', function() {
      var spy = this.spyOn('threshold');
      this.flags.threshold = '1';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 1 ]);
      });
    });
    it('--threshold <number> (invalid value).', function() {
      var spy = this.spyOn('threshold');
      this.flags.threshold = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid threshold');
      });
    });

    it('--tile', function() {
      var spy = this.spyOn('tile');
      this.flags.tile = true;
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ undefined, undefined ]);
      });
    });
    it('--tile [number]', function() {
      var spy = this.spyOn('tile');
      this.flags.tile = '128';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ 128, undefined ]);
      });
    });
    it('--tile [number] (invalid value)', function() {
      var spy = this.spyOn('tile');
      this.flags.tile = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ NaN, undefined ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid tile size');
      });
    });
    it('--tileOverlap <number>', function() {
      var spy = this.spyOn('tile');
      this.flags.tile        = true;
      this.flags.tileOverlap = '32';
      return runner.run(input, this.flags).then(function() {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ undefined, 32 ]);
      });
    });
    it('--tileOverlap <number> (invalid value)', function() {
      var spy = this.spyOn('tile');
      this.flags.tile        = true;
      this.flags.tileOverlap = 'foo';
      return runner.run(input, this.flags).then(function() {
        throw new Error('TRIGGER REJECTION');
      }).catch(function(err) {
        expect(spy).to.be.calledOnce;
        expect(spy.args[0]).to.eql([ undefined, NaN ]);
        expect(err).to.have.property('message');
        expect(err.message.toLowerCase()).to.contain('invalid tile overlap');
      });
    });

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

    it('--withoutMetadata', function() {
      var spy = this.spyOn('withMetadata');
      this.flags.withoutMetadata = true;
      return runner.run(input, this.flags).then(function() {
        expect(spy).not.to.be.called;
      });
    });
  });
});