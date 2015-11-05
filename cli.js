#!/usr/bin/env node
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
var fs   = require('fs'),
    path = require('path');

// Package modules.
var glob     = require('glob'),
    isFile   = require('is-file'),
    meow     = require('meow'),
    Promise  = require('bluebird');

// Local modules.
var runner = require('./lib/runner');

// Configure.
var helpFile = path.join(__dirname, './help.txt'),
    help     = fs.readFileSync(helpFile, 'utf8');

// Run.
var cli = meow(help, {
  boolean: [
    'embed',
    'flatten',
    'flip',
    'flop',
    'help',
    'ignoreAspectRatio',
    'max',
    'min',
    'normalize',
    'optimizeScans',
    'overshootDeringing',
    'sequentialRead',
    'trellisQuantisation',
    'verbose',
    'withoutAdaptiveFiltering',
    'withoutChromaSubsampling',
    'withoutEnlargement',
    'withoutMetadata'
  ],
  string: [
    'background',
    'backgroundAlpha',
    'blur',
    'compressionLevel',
    'crop',
    'extractHeight',
    'extractLeft',
    'extractTop',
    'extractWidth',
    'format',
    'gamma',
    'height',
    'interpolateWith',
    'limitInputPixels',
    'output',
    'overlay',
    'progressive',
    'quality',
    'rotate',
    'sharpen',
    'sharpenFlat',
    'sharpenJagged',
    'tile',
    'tileOverlap',
    'width'
  ],
  alias: {
    // Shortcuts.
    f : 'format',
    h : 'height',
    o : 'output',
    q : 'quality',
    v : 'verbose',
    w : 'width',

    // American vs. UK English.
    greyscale     : 'grayscale',
    normalise     : 'normalize',
    optimiseScans : 'optimizeScans',
    trellisQuantization: 'trellisQuantisation'
  }
});

// Error if no input file was specified.
if(0 === cli.input.length && process.stdin.isTTY) {
  console.error('No input files.');
  process.exit(1); // Exit with failure.
}

// Pipe from stdin.
else if(0 === cli.input.length) {
  runner.run(process.stdin, cli.flags).catch(function(err) {
    console.error(err);
    process.exit(1); // Exit with failure.
  });
}

// Read from input.
else {
  // Evaluate source patterns.
  var src = cli.input.reduce(function(prev, current) {
    var files = isFile(current) ? [ current ] : glob.sync(current);
    prev.push.apply(prev, files);
    return prev;
  }, [ ]);

  // Ensure output flag is set.
  if(1 < src.length && false === cli.flags.output) {
    console.error('Batch operation requires the use of --output.');
    process.exit(1); // Exit with failure.
  }

  // Invoke runner for each src.
  var promises = src.map(function(file) {
    return runner.run(file, cli.flags).then(function(m) {
      if(cli.flags.verbose) {
        var size = Math.round(m.size / 1024);
        console.log('  %s -> %s (%d×%d, %dkb)', file, m.src, m.width, m.height, size);
      }
      return m; // Continue.
    });
  });

  // Run.
  Promise.all(promises).catch(function(err) {
    console.error(err);
    process.exit(1); // Exit with failure.
  });
}