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
var path   = require('path'),
    stream = require('stream');

// Package modules.
var mkdir   = require('mkdir-p'),
    Promise = require('bluebird'),
    sharp   = require('sharp'),
    sponge  = require('sponge');

// Define the runner.
var run = function(src, flags) {
  // Initialize Sharp.
  var isStream = src instanceof stream.Readable,
      image    = isStream ? src.pipe(sharp()) : sharp(src);

  // Input options.
  // ==============

  // @see http://sharp.dimens.io/en/stable/api/#sequentialread
  if(flags.sequentialRead) {
    image.sequentialRead();
  }

  // @see http://sharp.dimens.io/en/stable/api/#limitinputpixelspixels
  if(flags.limitInputPixels) {
    var pixels = parseInt(flags.limitInputPixels, 10);
    image.limitInputPixels(pixels);
  }

  // Resize options.
  // ===============

  // @see http://sharp.dimens.io/en/stable/api/#resizewidth-height
  if(flags.height || flags.width) {
    // NOTE: Sharp deals with NaN when width or height are not specified.
    var width  = parseInt(flags.width, 10),
        height = parseInt(flags.height, 10);
    image.resize(width, height);
  }

  // @see http://sharp.dimens.io/en/stable/api/#cropgravity
  if(flags.crop) {
    image.crop(flags.crop);
  }

  // @see http://sharp.dimens.io/en/stable/api/#embed
  if(flags.embed) {
    image.embed();
  }

  // @see http://sharp.dimens.io/en/stable/api/#max
  if(flags.max) {
    image.max();
  }

  // @see http://sharp.dimens.io/en/stable/api/#min
  if(flags.min) {
    image.min();
  }

  // @see http://sharp.dimens.io/en/stable/api/#withoutenlargement
  if(flags.withoutEnlargement) {
    image.withoutEnlargement();
  }

  // @see http://sharp.dimens.io/en/stable/api/#ignoreaspectratio
  if(flags.ignoreAspectRatio) {
    image.ignoreAspectRatio();
  }

  // @see http://sharp.dimens.io/en/stable/api/#interpolatewithinterpolator
  if(flags.interpolateWith) {
    image.interpolateWith(flags.interpolateWith);
  }

  // Operations.
  // ============

  // @see http://sharp.dimens.io/en/stable/api/#extracttop-left-width-height
  if(flags.extractTop || flags.extractLeft || flags.extractWidth || flags.extractHeight) {
    var top     = parseInt(flags.extractTop, 10),
        left    = parseInt(flags.extractLeft, 10),
        eWidth  = parseInt(flags.extractWidth, 10),
        eHeight = parseInt(flags.extractHeight, 10);
    image.extract({ top: top, left: left, width: eWidth, height: eHeight });
  }

  // @see http://sharp.dimens.io/en/stable/api/#backgroundrgba
  if(flags.background) {
    image.background(flags.background);
  }

  // @see http://sharp.dimens.io/en/stable/api/#negate
  if(flags.negate) {
    image.negate();
  }

  // @see http://sharp.dimens.io/en/stable/api/#flatten
  if(flags.flatten) {
    image.flatten();
  }

  // @see http://sharp.dimens.io/en/stable/api/#extendextension
  if(flags.extendTop || flags.extendLeft || flags.extendBottom || flags.extendRight) {
    var eTop    = parseInt(flags.extendTop, 10),
        eLeft   = parseInt(flags.extendLeft, 10),
        eBottom = parseInt(flags.extendBottom, 10),
        eRight  = parseInt(flags.extendRight, 10);
    image.extend({ top: eTop, left: eLeft, bottom: eBottom, right: eRight });
  }

  // @see http://sharp.dimens.io/en/stable/api/#rotateangle
  if(flags.rotate || '' === flags.rotate) {
    var angle = '' !== flags.rotate ? parseInt(flags.rotate, 10) : undefined;
    image.rotate(angle);
  }

  // @see http://sharp.dimens.io/en/stable/api/#flip
  if(flags.flip) {
    image.flip();
  }

  // @see http://sharp.dimens.io/en/stable/api/#flop
  if(flags.flop) {
    image.flop();
  }

  // @see http://sharp.dimens.io/en/stable/api/#blursigma
  if(true === flags.blur) {
    image.blur();
  }
  else if(flags.blur) {
    var sigma = parseFloat(flags.blur);
    image.blur(sigma);
  }

  // @see http://sharp.dimens.io/en/stable/api/#sharpenradius-flat-jagged
  if(flags.sharpen || flags.sharpenFlat || flags.sharpenJagged) {
    var radius = true === flags.sharpen ? undefined : parseInt(flags.sharpen, 10),
        flat   = flags.sharpenFlat   ? parseFloat(flags.sharpenFlat)   : undefined,
        jagged = flags.sharpenJagged ? parseFloat(flags.sharpenJagged) : undefined;
    image.sharpen(radius, flat, jagged);
  }

  // @see http://sharp.dimens.io/en/stable/api/#thresholdthreshold
  if(flags.threshold) {
    var threshold = parseInt(flags.threshold, 10);
    image.threshold(threshold);
  }

  // @see http://sharp.dimens.io/en/stable/api/#gammagamma
  if(true === flags.gamma) {
    image.gamma();
  }
  else if(flags.gamma) {
    var gamma = parseFloat(flags.gamma);
    image.gamma(gamma);
  }

  // @see http://sharp.dimens.io/en/stable/api/#grayscale-greyscale
  if(flags.grayscale) {
    image.grayscale();
  }

  // @see http://sharp.dimens.io/en/stable/api/#normalize-normalise
  if(flags.normalize) {
    image.normalize();
  }

  // @see http://sharp.dimens.io/en/stable/api/#overlaywithfilename
  if(flags.overlay) {
    image.overlayWith(flags.overlay, { gravity: flags.overlayGravity });
  }

  // Output.
  // =======

  // @see http://sharp.dimens.io/en/stable/api/#output
  if(flags.format) {
    image.toFormat(flags.format);
  }

  // @see http://sharp.dimens.io/en/stable/api/#qualityquality
  if(flags.quality) {
    var quality = parseInt(flags.quality, 10);
    image.quality(quality);
  }

  // @see http://sharp.dimens.io/en/stable/api/#progressive
  if(flags.progressive) {
    image.progressive();
  }

  // @see http://sharp.dimens.io/en/stable/api/#withmetadatametadata
  if(false === flags.withoutMetadata) {
    image.withMetadata();
  }

  // @see http://sharp.dimens.io/en/stable/api/#tilesize-overlap
  if(flags.tile) {
    var options = { layout: flags.tileLayout };
    if(true !== flags.tile) {
      options.size = parseInt(flags.tile, 10);
    }
    if(flags.tileOverlap) {
      options.overlap = parseInt(flags.tileOverlap, 10);
    }
    image.tile(options);
  }

  // @see http://sharp.dimens.io/en/stable/api/#withoutchromasubsampling
  if(flags.withoutChromaSubsampling) {
    image.withoutChromaSubsampling();
  }

  // @see http://sharp.dimens.io/en/stable/api/#compressionlevelcompressionlevel
  if(flags.compressionLevel) {
    var compressionLevel = parseInt(flags.compressionLevel, 10);
    image.compressionLevel(compressionLevel);
  }

  // @see http://sharp.dimens.io/en/stable/api/#withoutadaptivefiltering
  if(flags.withoutAdaptiveFiltering) {
    image.withoutAdaptiveFiltering();
  }

  // @see http://sharp.dimens.io/en/stable/api/#trellisquantisation-trellisquantization
  if(flags.trellisQuantization) {
    image.trellisQuantization();
  }

  // @see http://sharp.dimens.io/en/stable/api/#overshootderinging
  if(flags.overshootDeringing) {
    image.overshootDeringing();
  }

  // @see http://sharp.dimens.io/en/stable/api/#optimisescans-optimizescans
  if(flags.optimizeScans) {
    image.optimizeScans();
  }

  // @see http://sharp.dimens.io/en/stable/api/#tofilefilename-callback
  var dest   = null,
      target = process.stdout; // Default: stream to stdout.
  if(flags.output) {
    // Determine whether the specified flag indicates a file or directory.
    var isDir = !(src instanceof Buffer) && '' === path.extname(flags.output);
    dest = isDir ? path.join(flags.output, path.basename(src)) : flags.output;

    // Ensure the destination directory exists.
    mkdir.sync(path.dirname(dest));

    // Override target stream.
    target = sponge(dest);
  }

  // Pipe to stdout.
  return Promise.fromNode(function(callback) {
    image.once('error', callback); // Continue with error.
    image.on('end', function() {
      callback(null, dest); // Continue with outfile.
    });
    image.pipe(target);
  });
};

// Exports.
module.exports = {
  run: function(src, flags) {
    // Wrap in Promise so exceptions turn into proper promise rejections.
    return new Promise(function(resolve) {
      return resolve(run(src, flags));
    });
  }
};