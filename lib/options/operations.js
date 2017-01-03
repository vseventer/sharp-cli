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

// Configure.
const group = 'Image Operations';

// @see http://sharp.dimens.io/en/stable/api-operation/#blur
exports.blur = {
  describe : 'Blur the image.',
  group    : group,
  type     : 'boolean'
};
exports['blur.sigma'] = {
  defaultDescription: '1 + radius / 2',
  describe : 'A value between 0.3 and 1000 representing the sigma of the Gaussian mask.',
  group    : group,
  implies  : 'blur',
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#convolve
exports.convolve = {
  describe : 'Convolve the image with the specified kernel.',
  group    : group,
  implies  : 'convolve.kernel',
  nargs    : 2
};
exports['convolve.kernel'] = {
  describe : 'Array of length width × height containing the kernel values.',
  group    : group,
  implies  : 'convolve',
  type     : 'array'
};
exports['convolve.scale'] = {
  defaultDescription: 'sum',
  describe : 'The scale of the kernel in pixels.',
  group    : group,
  type     : 'number'
};
exports['convolve.offset'] = {
  defaultDescription: '0',
  describe : 'The offset of the kernel in pixels.',
  group    : group,
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#extend
exports.extend = {
  describe : 'Extends/pads the edges of the image with the colour provided to the background method.',
  group    : group,
  implies  : 'background',
  nargs    : 4,
  type     : 'array'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#extract
exports.extract = {
  describe : 'Extract a region of the image.',
  group    : group,
  nargs    : 4,
  type     : 'array'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#flatten
exports.flatten = {
  describe : 'Merge alpha transparency channel, if any, with background.',
  group    : group,
  implies  : 'background',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#flip
exports.flip = {
  describe : 'Flip the image about the vertical Y axis.',
  group    : group,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#flop
exports.flop = {
  describe : 'Flop the image about the horizontal X axis.',
  group    : group,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#gamma
exports.gamma = {
  defaultDescription : 2.2,
  describe : 'Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of 1/gamma then increasing the encoding (brighten) post-resize at a factor of gamma.',
  group    : group,
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#negate
exports.negate = {
  describe : 'Produce the "negative" of the image.',
  group    : group,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#normalise
exports.normalise = {
  alias    : 'normalize',
  describe : 'Enhance output image contrast by stretching its luminance to cover the full dynamic range.',
  group    : group,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#rotate
exports.rotate = {
  choices  : [ 0, 90, 180, 270 ],
  defaultDescription: 'auto',
  describe : 'Rotate the output image by either an explicit angle or auto-orient based on the EXIF Orientation tag.',
  group    : group
};

// @see http://sharp.dimens.io/en/stable/api-operation/#sharpen
exports.sharpen = {
  describe : 'Sharpen the image.',
  group    : group,
  type     : 'boolean'
};
exports['sharpen.flat'] = {
  defaultDescription: '1.0',
  describe : 'The level of sharpening to apply to "flat" areas.',
  group    : group,
  implies  : 'sharpen',
  type     : 'number'
};
exports['sharpen.jagged'] = {
  defaultDescription: '2.0',
  describe : 'The level of sharpening to apply to "jagged" areas.',
  group    : group,
  implies  : 'sharpen',
  type     : 'number'
};
exports['sharpen.sigma'] = {
  defaultDescription: '1 + radius / 2',
  describe : 'The sigma of the Gaussian mask.',
  group    : group,
  implies  : 'sharpen',
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#threshold
exports.threshold = {
  defaultDescription: 128,
  describe : 'Any pixel value greather than or equal to the threshold value will be set to 255, otherwise it will be set to 0.',
  group    : group,
  type     : 'number'
};
exports['threshold.greyscale'] = {
  alias    : 'threshold.grayscale',
  describe : 'Convert to single channel greyscale.',
  group    : group,
  implies  : 'threshold',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-operation/#trim
exports.trim = {
  defaultDescription: 10,
  describe : 'Trim "boring" pixels from all edges that contain values within a percentage similarity of the top-left pixel.',
  group    : group,
  type     : 'number'
};