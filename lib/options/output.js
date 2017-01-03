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
const group = 'Output';

// @see http://sharp.dimens.io/en/stable/api-output/#jpeg
exports.jpeg = {
  describe : 'Use these JPEG options for output image.',
  group    : group,
  type     : 'boolean'
};
exports['jpeg.chromaSubsampling'] = {
  defaultDescription: '4:2:0',
  describe : 'Set to \'4:4:4\' to prevent chroma subsampling when quality <= 90.',
  group    : group,
  implies  : 'jpeg',
  type     : 'string'
};
exports['jpeg.optimiseScans'] = {
  alias    : 'jpeg.optimizeScans',
  describe : 'Optimise progressive scans, forces progressive, requires mozjpeg.',
  group    : group,
  implies  : 'jpeg',
  type     : 'boolean'
};
exports['jpeg.overshootDeringing'] = {
  describe : 'Apply overshoot deringing, requires mozjpeg.',
  group    : group,
  implies  : 'jpeg',
  type     : 'boolean'
};
exports['jpeg.progressive'] = {
  describe : 'Use progressive (interlace) scan.',
  group    : group,
  implies  : 'jpeg',
  type     : 'boolean'
};
exports['jpeg.quality'] = {
  defaultDescription: 80,
  describe : 'Quality.',
  group    : group,
  implies  : 'jpeg',
  type     : 'number'
};
exports['jpeg.trellisQuantisation'] = {
  describe : 'Apply trellis quantisation, requires mozjpeg.',
  group    : group,
  implies  : 'jpeg',
  type     : 'boolean'
};
exports['jpeg.force'] = {
  describe : 'Force JPEG output, otherwise attempt to use input format.',
  group    : group,
  implies  : 'jpeg',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-output/#tofile
exports.out = {
  alias     : 'o',
  defaultDescription: 'stdout',
  describe  : 'Write output image data to a file.',
  group     : group,
  normalize : true,
  type      : 'string',
};

// @see http://sharp.dimens.io/en/stable/api-output/#png
exports.png = {
  describe  : 'Use these PNG options for output image.',
  group     : group,
  type      : 'boolean'
};
exports['png.adaptiveFiltering'] = {
  defaultDescription: true,
  describe : 'Use adaptive row filtering.',
  group    : group,
  implies  : 'png',
  type     : 'boolean'
};
exports['png.compressionLevel'] = {
  defaultDescription: 6,
  describe : 'zlib compression level.',
  group    : group,
  implies  : 'png',
  type     : 'number'
};
exports['png.force'] = {
  describe : 'Force PNG output, otherwise attempt to use input format.',
  group    : group,
  implies  : 'png',
  type     : 'boolean'
};
exports['png.progressive'] = {
  describe : 'Use progressive (interlace) scan.',
  group    : group,
  implies  : 'png',
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-output/#raw
exports.raw = {
  describe : 'Force output to be raw, uncompressed uint8 pixel data.',
  group    : group,
  type     : 'boolean'
};

// @see http://sharp.dimens.io/en/stable/api-output/#tiff
exports.tiff = {
  describe : 'Use these TIFF options for output image.',
  group    : group,
  type     : 'boolean'
};
exports['tiff.force'] = {
  describe : 'Force TIFF output, otherwise attempt to use input format.',
  group    : group,
  implies  : 'tiff',
  type     : 'boolean'
};
exports['tiff.quality'] = {
  defaultDescription: 80,
  describe : 'Quality.',
  group    : group,
  implies  : 'tiff',
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-output/#tile
exports.tile = {
  describe : 'Use tile-based deep zoom (image pyramid) output.',
  group    : group,
  type     : 'boolean'
};
exports['tile.container'] = {
  choices  : [ 'fs', 'zlib' ],
  defaultDescription: 'fs',
  describe : 'Tile container.',
  group    : group,
  implies  : 'tile'
};
exports['tile.layout'] = {
  choices  : [ 'dz', 'zoomify', 'google' ],
  defaultDescription: 'dz',
  describe : 'Filesystem layout.',
  group    : group,
  implies  : 'tile'
};
exports['tile.overlap'] = {
  defaultDescription: 8,
  describe : 'Tile overlap in pixels, a value between 0 and 8192.',
  group    : group,
  implies  : 'tile',
  type     : 'number'
};
exports['tile.size'] = {
  defaultDescription: 256,
  describe : 'Tile size in pixels, a value between 1 and 8192.',
  group    : group,
  implies  : 'tile',
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-output/#webp
exports.webp = {
  describe : 'Use these WebP options for output image.',
  group    : group,
  type     : 'boolean'
};
exports['webp.force'] = {
  describe : 'Force WebP output, otherwise attempt to use input format.',
  group    : group,
  implies  : 'webp',
  type     : 'boolean'
};
exports['webp.quality'] = {
  defaultDescription: 80,
  describe : 'Quality.',
  group    : group,
  implies  : 'webp',
  type     : 'number'
};

// @see http://sharp.dimens.io/en/stable/api-output/#withmetadata
exports.withMetadata = {
  describe : 'Include all metadata (EXIF, XMP, IPTC) from the input image in the output image.',
  group    : group,
  type     : 'boolean'
};