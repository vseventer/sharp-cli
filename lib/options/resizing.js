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
const group = 'Resizing Images';

// @see http://sharp.dimens.io/en/stable/api-resize/#crop
exports.crop = {
  choices  : [ 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'centre', 'center' ],
  defaultDescription: 'centre',
  describe : 'Crop the resized image to the exact size specified.',
  group    : group
};

// @see http://sharp.dimens.io/en/stable/api-resize/#embed
exports.embed = {
  describe : 'Preserving aspect ratio, resize the image to the maximum width or height specified then embed on a background of the exact width and height specified.',
  group    : group,
  implies  : 'background',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-resize/#ignoreaspectratio
exports.ignoreAspectRatio = {
  describe : 'Ignoring the aspect ratio of the input, stretch the image to the exact width and/or height provided via resize.',
  group    : group,
  implies  : 'resize',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-resize/#max
exports.max = {
  describe : 'Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to the width and height specified.',
  group    : group,
  implies  : 'resize',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-resize/#min
exports.min = {
  describe : 'Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to the width and height specified.',
  group    : group,
  implies  : 'resize',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-resize/#resize
exports.resize = {
  describe : 'Resize image to width × height.',
  group    : group,
  nargs    : 2
};
exports['resize.centreSampling'] = {
  alias    : 'resize.centerSampling',
  describe : 'Use *magick centre sampling convention instead of corner sampling.',
  group    : group,
  implies  : 'resize',
  type     : 'boolean'
};
exports['resize.interpolator'] = {
  choices : [ 'nearest', 'bilinear', 'vertexSplitQuadraticBasisSpline', 'bicubic', 'locallyBoundedBicubic', 'nohalo' ],
  defaultDescription: 'bicubic',
  describe : 'The interpolator to use for image enlargement.',
  group    : group,
  implies  : 'resize'
};
exports['resize.kernel'] = {
  choices  : [ 'cubic', 'lanczo2', 'lanczo3' ],
  defaultDescription: 'lanczo3',
  describe : 'The kernel to use for image reduction.',
  group    : group,
  implies  : 'resize'
};

// @see http://sharp.dimens.io/en/stable/api-resize/#withoutenlargement
exports.withoutEnlargement = {
  describe : 'Do not enlarge the output image if the input image width or height are already less than the required dimensions.',
  group    : group,
  type     : 'boolean'
};