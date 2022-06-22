# sharp-cli
> CLI for [sharp](https://www.npmjs.com/package/sharp), a high performance Node.js image processing module.

## Install
`$ npm install sharp-cli`

## Usage
```
sharp <options> [command..]

Commands:
  sharp bandbool <operator>                    Perform a bitwise boolean operation on all input
                                               image channels (bands) to produce a single channel
                                               output image
  sharp blur [sigma]                           Blur the image
  sharp boolean <operand> <operator>           Perform a bitwise boolean operation with operand
                                               image
  sharp clahe <width> <height>                 Perform contrast limiting adaptive histogram
                                               equalization CLAHE
  sharp composite <image>                      Composite image over the processed (resized,
                                               extracted etc.) image
  sharp convolve <width> <height> <kernel>     Convolve the image with the specified kernel
  sharp ensureAlpha                            Ensure alpha channel, if missing
  sharp extend <top> <bottom> <left> <right>   Extends/pads the edges of the image with the provided
                                               background colour
  sharp extract <top> <left> <width> <height>  Extract a region of the image
  sharp extractChannel <band>                  Extract a single channel from a multi-channel image
  sharp flatten [background]                   Merge alpha transparency channel, if any, with a
                                               background
  sharp flip                                   Flip the image about the vertical Y axis
  sharp flop                                   Flop the image about the horizontal X axis
  sharp gamma [factor] [factorOut]             Apply a gamma correction by reducing the encoding
                                               (darken) pre-resize then increasing the encoding
                                               (brighten) post-resize
  sharp greyscale                              Convert to 8-bit greyscale; 256 shades of grey
                                                                                [aliases: grayscale]
  sharp joinChannel <images..>                 Join one or more channels to the image
  sharp linear [multiplier] [offset]           Apply the linear formula a × input + b to the image
  sharp median [size]                          Apply median filter
  sharp modulate                               Transforms the image using brightness, saturation,
                                               hue rotation, and lightness
  sharp negate                                 Produce the "negative" of the image
  sharp normalise                              Enhance output image contrast by stretching its
                                               luminance to cover the full dynamic range
                                                                                [aliases: normalize]
  sharp pipelineColourspace <colourspace>      Set the pipeline colourspace
                                                                       [aliases: pipelineColorspace]
  sharp recomb <matrix>                        Recomb the image with the specified matrix
  sharp removeAlpha                            Remove alpha channel, if any
  sharp resize <width> [height]                Resize image to width × height
  sharp rotate [angle]                         Rotate the output image
  sharp sharpen [sigma]                        Sharpen the image
  sharp threshold [value]                      Any pixel value greather than or equal to the
                                               threshold value will be set to 255, otherwise it will
                                               be set to 0
  sharp tint <rgb>                             Tint the image using the provided chroma while
                                               preserving the image luminance
  sharp tile [size]                            Use tile-based deep zoom (image pyramid) output
  sharp toColourspace <colourspace>            Set the output colourspace    [aliases: toColorspace]
  sharp trim [threshold]                       Trim "boring" pixels from all edges that contain
                                               values within a percentage similarity of the top-left
                                               pixel

Global Options
  --compressionLevel, -c  zlib compression level                               [number] [default: 6]
  --delay                 Delay(s) between animation frames                                 [number]
  --density               DPI for vector images                               [number] [default: 72]
  --dry, -n               Do everything except write files                                 [boolean]
  --format, -f            Force output to a given format
    [choices: "input", "avif", "gif", "heif", "jpeg", "jpg", "png", "raw", "tiff", "webp"] [default:
                                                                                            "input"]
  --input, -i             Path to (an) image file(s)             [array] [required] [default: stdin]
  --level                 Level to extract from a multi-level input                         [number]
  --loop                  Number of animation iterations                       [number] [default: 0]
  --output, -o            Directory or URI template to write the image files to
                                                               [string] [required] [default: stdout]
  --page                  Page number to start extracting from for multi-page input         [number]
  --pages                 Number of pages to extract for multi-page input      [number] [default: 1]
  --progressive, -p       Use progressive (interlace) scan                                 [boolean]
  --quality, -q           Quality                                             [number] [default: 80]
  --timeout               Number of seconds after which processing will be stopped
                                                                               [number] [default: 0]
  --withMetadata, -m      Include all metadata (EXIF, XMP, IPTC) from the input image in the output
                          image                                                            [boolean]

Optimization Options
  --adaptiveFiltering                       Use adaptive row filtering                     [boolean]
  --alphaQuality                            Quality of alpha layer            [number] [default: 80]
  --bitdepth                                Squash 8-bit images down to 1, 2, or 4 bit
                                                         [number] [choices: 1, 2, 4, 8] [default: 8]
  --chromaSubsampling                       Set to "4:4:4" to prevent chroma subsampling when
                                            quality <= 90   [string] [default: 4:4:4 (AVIF) / 4:2:0]
  --colors, --colours                       Maximum number of palette entries[number] [default: 256]
  --compression                             Compression options
                 [string] [choices: "ccittfax4", "deflate", "jpeg", "lzw", "none"] [default: "jpeg"]
  --dither                                  Level of Floyd-Steinberg error diffusion
                                                                             [number] [default: 1.0]
  --effort                                  Level of CPU effort to reduce file size
                                                                [number] [default: 7 (GIF, PNG) / 4]
  --hcompression                            Compression format
                                                  [string] [choices: "hevc", "av1"] [default: "av1"]
  --lossless                                Use lossless compression mode                  [boolean]
  --mozjpeg                                 Use mozjpeg defaults                           [boolean]
  --nearLossless                            Use near_lossless compression mode             [boolean]
  --optimise, --optimize                    Apply optimiseScans, overshootDeringing, and
                                            trellisQuantisation                            [boolean]
  --optimiseCoding, --optimizeCoding        Optimise Huffman coding tables [boolean] [default: true]
  --optimiseScans, --optimizeScans          Optimise progressive scans                     [boolean]
  --overshootDeringing                      Apply overshoot deringing                      [boolean]
  --palette                                 Quantise to a palette-based image with alpha
                                            transparency support                           [boolean]
  --predictor                               Compression predictor
                           [string] [choices: "float", "horizontal", "none"] [default: "horizontal"]
  --pyramid                                 Write an image pyramid                         [boolean]
  --quantisationTable, --quantizationTable  Quantization table to use          [number] [default: 0]
  --resolutionUnit                          Resolution unit
                                                    [string] [choices: "cm", "inch"] [default: inch]
  --smartSubsample                          High quality chroma subsampling                [boolean]
  --tileBackground                          Background colour, parsed by the color module
                                                          [string] [default: rgba(255, 255, 255, 1)]
  --tileHeight                              Vertical tile size                              [number]
  --tileWidth                               Horizontal tile size                            [number]
  --trellisQuantisation                     Apply trellis quantisation                     [boolean]
  --xres                                    Horizontal resolution            [number] [default: 1.0]
  --yres                                    Vertical resolution              [number] [default: 1.0]

Misc. Options
  --help, -h     Show help                                                                 [boolean]
  --version, -v  Show version number                                                       [boolean]

Examples:
  sharp -i ./input.jpg -o ./out resize 300 200        out/input.jpg will be a 300 pixels wide and
                                                      200 pixels high image containing a scaled and
                                                      cropped version of input.jpg
  sharp -i ./input.jpg -o ./out -mq90 rotate 180 --   out/input.jpg will be an upside down, 300px
  resize 300 -- flatten "#ff6600" -- composite        wide, alpha channel flattened onto orange
  ./overlay.png --gravity southeast -- sharpen        background, composited with overlay.png with
                                                      SE gravity, sharpened, with metadata, 90%
                                                      quality version of input.jpg

For more information on available options, please visit https://sharp.pixelplumbing.com/
```

## Input and output
* The CLI supports input streams.
* [Glob](https://www.npmjs.com/package/glob) patterns are allowed, for example `--input './images/**/*.jpg'`. Make sure you quote the pattern when using the CLI.
* Supported output macros: `{root}`, `{dir}`, `{base}`, `{name}`, and `{ext}` (from [Node.js path](https://nodejs.org/api/path.html#path_path_parse_path)), for example: `--output {dir}` will overwrite original files.

```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

## Related
* [sharp](http://sharp.pixelplumbing.com/) - API for this module

## Changelog
See the [Changelog](./CHANGELOG.md) for a list of changes.

## License
    The MIT License (MIT)

    Copyright (c) 2019 Mark van Seventer

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
