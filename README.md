# sharp-cli
> CLI for [sharp](https://www.npmjs.com/package/sharp).

*Issues with the output should be reported on the `sharp` [issue tracker](https://github.com/lovell/sharp/issues).*

## Install
`$ npm install sharp-cli`

## Usage
```
sharp <options> [command..]

Commands:
  background <rgba>                      Set the background to embed, extend, or flatten the image
                                         with
  bandbool <operator>                    Perform a bitwise boolean operation on all input image
                                         channels (bands) to produce a single channel output image
  blur [sigma]                           Blur the image
  boolean <operand> <operator>           Perform a bitwise boolean operation with operand image
  convolve <width> <height> <kernel>     Convolve the image with the specified kernel
  extract <top> <left> <width> <height>  Extract a region of the image
  extractChannel <band>                  Extract a single channel from a multi-channel image
  flip                                   Flip the image about the vertical Y axis
  flop                                   Flop the image about the horizontal X axis
  gamma [factor]                         Apply a gamma correction by reducing the encoding (darken)
                                         pre-resize then increasing the encoding (brighten)
                                         post-resize
  greyscale                              Convert to 8-bit greyscale; 256 shades of grey
                                                                                [aliases: grayscale]
  joinChannel <images..>                 Join one or more channels to the image
  negate                                 Produce the "negative" of the image
  normalise                              Enhance output image contrast by stretching its luminance
                                         to cover the full dynamic range        [aliases: normalize]
  overlayWith <overlay>                  Overlay (composite) an image over the processed (resized,
                                         extracted etc.) image
  resize <width> [height]                Resize image to width × height
  rotate [angle]                         Rotate the output image
  sharpen [sigma]                        Sharpen the image
  threshold [value]                      Any pixel value greather than or equal to the threshold
                                         value will be set to 255, otherwise it will be set to 0
  tile [size]                            Use tile-based deep zoom (image pyramid) output
  toColourspace <colourspace>            Set the output colourspace          [aliases: toColorspace]
  trim [tolerance]                       Trim "boring" pixels from all edges that contain values
                                         within a percentage similarity of the top-left pixel

Global Options
  --compressionLevel, -c  zlib compression level                               [number] [default: 6]
  --format, -f            Force output to a given format
                                    [choices: "jpeg", "png", "raw", "tiff", "webp"] [default: input]
  --input, -i             Path to (an) image file(s)             [array] [required] [default: stdin]
  --limitInputPixels, -l  Do not process input images where the number of pixels (width x height)
                          exceeds this limit                           [number] [default: 268402689]
  --output, -o            Directory or URI template to write the image files to
                                                               [string] [required] [default: stdout]
  --progressive, -p       Use progressive (interlace) scan                                 [boolean]
  --quality, -q           Quality                                             [number] [default: 80]
  --withMetadata, -m      Include all metadata (EXIF, XMP, IPTC) from the input image in the output
                          image                                                            [boolean]

Optimization Options
  --adaptiveFiltering               Use adaptive row filtering                             [boolean]
  --alphaQuality                    Quality of alpha layer                    [number] [default: 80]
  --chromaSubsampling               Set to "4:4:4" to prevent chroma subsampling when quality <= 90
                                                                           [string] [default: 4:2:0]
  --lossless                        Use lossless compression mode                          [boolean]
  --nearLossless                    use near_lossless compression mode                     [boolean]
  --optimise, --optimize            Apply optimiseScans, overshootDeringing, and trellisQuantisation
                                                                                           [boolean]
  --optimiseScans, --optimizeScans  Optimise progressive scans                             [boolean]
  --overshootDeringing              Apply overshoot deringing                              [boolean]
  --sequentialRead                  An advanced setting that switches the libvips access method to
                                    VIPS_ACCESS_SEQUENTIAL                                 [boolean]
  --squash                          Squash 8-bit images down to 1 bit                      [boolean]
  --trellisQuantisation             Apply trellis quantisation                             [boolean]
  --xres                            Horizontal resolution                    [number] [default: 1.0]
  --yres                            Vertical resolution                      [number] [default: 1.0]

Misc. Options
  --help, -h     Show help                                                                 [boolean]
  --version, -v  Show version number                                                       [boolean]

Examples:
  sharp -i ./input.jpg -o ./out resize 300 200        out/input.jpg will be a 300 pixels wide and
                                                      200 pixels high image containing a scaled and
                                                      cropped version of input.jpg
  sharp -i ./input.jpg -o ./out -mq90 rotate 180 --   out/input.jpg will be an upside down, 300px
  resize 300 -- background "#ff6600" --flatten --     wide, alpha channel flattened onto orange
  overlayWith ./overlay.png --gravity southeast --    background, composited with overlay.png with
  sharpen                                             SE gravity, sharpened, with metadata, 90%
                                                      quality version of input.jpg

For more information on available options, please visit http://sharp.dimens.io/
```

## Related
* [sharp](http://sharp.dimens.io/) - API for this module

## Changelog
See the [Changelog](./CHANGELOG.md) for a list of changes.

## License
    The MIT License (MIT)

    Copyright (c) 2018 Mark van Seventer

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.