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
const channelGroup = 'Channel Manipulation';
const colorGroup   = 'Colour Manipulation';

// @see http://sharp.dimens.io/en/stable/api-colour/#background
exports.background = {
  describe : 'Set the background for the embed, flatten and extend operations.',
  group    : colorGroup,
  nargs    : 4
};

// @see http://sharp.dimens.io/en/stable/api-channel/#bandbool
exports.bandbool = {
  choices  : [ 'and', 'or', 'eor' ],
  describe : 'Perform a bitwise boolean operation on all input image channels (bands) to produce a single channel output image.',
  group    : channelGroup
};

// @see http://sharp.dimens.io/en/stable/api-channel/#extractchannel
exports.extractChannel = {
  choices  : [ 0, 1, 2, 'red', 'green', 'blue' ],
  describe : 'Extract a single channel from a multi-channel image.',
  group    : channelGroup
};

// @see http://sharp.dimens.io/en/stable/api-colour/#greyscale
exports.greyscale = {
  alias    : 'grayscale',
  describe : 'Convert to 8-bit greyscale; 256 shades of grey.',
  group    : colorGroup,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-channel/#joinchannel
exports.joinChannel = {
  describe  : 'Join one or more channels to the image.',
  group     : channelGroup,
  implies   : 'toColourspace',
  normalize : true,
  type      : 'array'
};
exports['joinChannel.density'] = {
  defaultDescription: 72,
  describe : 'Integral number representing the DPI for vector images.',
  group    : channelGroup,
  implies  : 'joinChannel',
  type     : 'number'
};
exports['joinChannel.raw'] = {
  describe : 'Describes raw pixel image data.',
  group    : channelGroup,
  implies  : 'joinChannel',
  nargs    : 3
};

// @see http://sharp.dimens.io/en/stable/api-colour/#tocolourspace
exports.toColourspace = {
  alias    : 'toColorspace',
  choices  : [ 'multiband', 'b-w', 'histogram', 'xyz', 'lab', 'cmyk', 'labq', 'rgb', 'cmc', 'lch', 'labs', 'srgb', 'yxy', 'fourier', 'rgb16', 'grey16', 'matrix', 'scrgb', 'hsv', 'last' ],
  defaultDescription: 'srgb',
  describe : 'Set the output colourspace.',
  group    : colorGroup
};