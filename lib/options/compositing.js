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
const group = 'Compositing Images';

// @see http://sharp.dimens.io/en/stable/api-composite/#overlaywith
exports.overlay = {
  describe  : 'Overlay (composite) an image over the processed (resized, extracted etc.) image.',
  group     : group,
  normalize : true,
  type      : 'string'
};
exports['overlay.cutout'] = {
  describe : 'Set to true to apply only the alpha channel of the overlay image to the input image, giving the appearance of one image being cut out of another.',
  group     : group,
  implies  : 'overlay',
  type     : 'boolean'
};
exports['overlay.gravity'] = {
  choices  : [ 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'centre', 'center' ],
  defaultDescription: 'centre',
  describe : 'Gravity at which to place the overlay.',
  group     : group,
  implies  : 'overlay'
};
exports['overlay.offset'] = {
  describe : 'The pixel offset from the top and left edges.',
  group     : group,
  implies  : 'overlay',
  nargs    : 2
};
exports['overlay.tile'] = {
  describe : 'Set to true to repeat the overlay image across the entire image with the given gravity.',
  group     : group,
  implies  : 'overlay',
  type     : 'boolean'
};