# sharp-cli

> CLI for [sharp](https://www.npmjs.com/package/sharp), a high performance Node.js image processing module.

## Install

`$ npm install sharp-cli`

## Usage

```
sharp <options> [command..]

Commands:
  sharp affine <matrix..>                      Perform an affine transform on an image
  sharp bandbool <operator>                    Perform a bitwise boolean operation on all input imag
                                               e channels (bands) to produce a single channel output
                                                image
  sharp blur [sigma]                           Blur the image
  sharp boolean <operand> <operator>           Perform a bitwise boolean operation with operand imag
                                               e
  sharp clahe <width> <height>                 Perform contrast limiting adaptive histogram equaliza
                                               tion CLAHE
  sharp composite [images..]                   Composite image(s) over the processed (resized, extra
                                               cted etc.) image
  sharp convolve <width> <height> <kernel..>   Convolve the image with the specified kernel
  sharp dilate [width]                         Expand foreground objects using the dilate morphologi
                                               cal operator
  sharp ensureAlpha [alpha]                    Ensure the output image has an alpha transparency cha
                                               nnel
  sharp erode [width]                          Shrink foreground objects using the erode morphologic
                                               al operator
  sharp extend <top> <bottom> <left> <right>   Extends/pads the edges of the image with the provided
                                                background colour
  sharp extract <top> <left> <width> <height>  Extract a region of the image
  sharp extractChannel <channel>               Extract a single channel from a multi-channel image
  sharp flatten [background]                   Merge alpha transparency channel, if any, with a back
                                               ground
  sharp flip                                   Flip the image about the vertical Y axis
  sharp flop                                   Flop the image about the horizontal X axis
  sharp gamma [gamma] [gammaOut]               Apply a gamma correction by reducing the encoding (da
                                               rken) pre-resize then increasing the encoding (bright
                                               en) post-resize
  sharp greyscale                              Convert to 8-bit greyscale; 256 shades of grey
                                                                                [aliases: grayscale]
  sharp joinChannel <images..>                 Join one or more channels to the image
  sharp linear [multiplier..]                  Apply the linear formula a × input + b to the image t
                                               o adjust image levels
  sharp median [size]                          Apply median filter
  sharp modulate                               Transforms the image using brightness, saturation, hu
                                               e rotation, and lightness
  sharp negate                                 Produce the "negative" of the image
  sharp normalise                              Enhance output image contrast by stretching its lumin
                                               ance to cover the full dynamic range
                                                                                [aliases: normalize]
  sharp pipelineColourspace <colourspace>      Set the pipeline colourspace
                                                                       [aliases: pipelineColorspace]
  sharp recomb <matrix..>                      Recomb the image with the specified matrix
  sharp removeAlpha                            Remove alpha channel, if any
  sharp resize [width] [height]                Resize image to width, height, or width × height
  sharp rotate [angle]                         Rotate the output image
  sharp sharpen [sigma]                        Sharpen the image
  sharp threshold [value]                      Any pixel value greater than or equal to the threshol
                                               d value will be set to 255, otherwise it will be set
                                               to 0
  sharp tint <rgb>                             Tint the image using the provided chroma while preser
                                               ving the image luminance
  sharp tile [size]                            Use tile-based deep zoom (image pyramid) output
  sharp toColourspace <colourspace>            Set the output colourspace    [aliases: toColorspace]
  sharp trim [threshold]                       Trim pixels from all edges that contain values simila
                                               r to the given background color, which defaults to th
                                               at of the top-left pixel
  sharp unflatten                              Ensure the image has an alpha channel with all white
                                               pixel values made fully transparent

Global Options
  -n, --dry      Process images without writing output files                               [boolean]
      --print    Print input and output metadata as JSON                                   [boolean]
  -i, --input    Path to (an) image file(s)                      [array] [required] [default: stdin]
  -o, --output   Directory or URI template to write the image files to
                                                               [string] [required] [default: stdout]
      --timeout  Number of seconds after which processing will be stopped                   [number]

Input Options
      --animated            Read all frames/pages of an animated image                     [boolean]
      --autoOrient          Rotate/flip the image to match EXIF Orientation, if any        [boolean]
      --density             DPI for vector images                             [number] [default: 72]
      --failOn              Level of sensitivity to invalid images
                               [choices: "none", "truncated", "error", "warning"] [default: warning]
      --ignoreIcc           Should the embedded ICC profile, if any, be ignored
                                                                          [boolean] [default: false]
      --level               Level to extract from a multi-level input (OpenSlide), zero based
                                                                                            [number]
      --limitInputPixels    Do not process input images where the number of pixels (width x height)
                            exceeds this limit                         [number] [default: 268402689]
      --limitInputChannels  Do not process input images where the number of channels exceeds this li
                            mit                                                [number] [default: 5]
      --page                Page number to start extracting from for multi-page input       [number]
      --pages               Number of pages to extract for multi-page input    [number] [default: 1]
      --pdfBackground       Background colour to use when PDF is partially transparent      [string]
      --sequentialRead      Use sequential rather than random access where possible
                                                                          [boolean] [default: false]
      --subifd              subIFD to extract for OME-TIFF                    [number] [default: -1]
      --unlimited           Remove safety features that help prevent memory exhaustion     [boolean]

Output Options
      --bigtiff                   Use BigTIFF variant                                      [boolean]
  -c, --compressionLevel          zlib compression level                       [number] [default: 6]
  -f, --format                    Force output to a given format
                    [choices: "avif", "gif", "heif", "jpeg", "png", "tiff", "webp"] [default: input]
      --keepDuplicateFrames       Keep duplicate frames in the output instead of combining them
                                                                                           [boolean]
      --keepGainMap               Attempt to process the image and gain map separately, recombining
                                  them into a single output image                          [boolean]
  -m, --metadata, --withMetadata  Include all metadata (EXIF, XMP, IPTC) from the input image in the
                                   output image                                            [boolean]
      --metadata.density          Number of pixels per inch (DPI)                           [number]
      --metadata.exif             Object keyed by IFD0, IFD1 etc. of key/value string pairs to write
                                   as EXIF data                                        [default: {}]
      --metadata.icc              Filesystem path to output ICC profile     [string] [default: sRGB]
      --metadata.orientation      Used to update the EXIF Orientation tag                   [number]
      --withDensity               Set output density (DPI) in EXIF metadata                 [number]
      --withGainMap               Convert the main image to HDR (High Dynamic Range) before further
                                  processing                                               [boolean]
  -p, --progressive               Use progressive (interlace) scan                         [boolean]
  -q, --quality                   Quality                                     [number] [default: 80]

Optimization Options
      --adaptiveFiltering                       Use adaptive row filtering                 [boolean]
      --alphaQuality                            Quality of alpha layer        [number] [default: 80]
      --bitdepth                                Reduce bitdepth to 1, 2, or 4 bit
                                                                  [choices: 1, 2, 4, 8] [default: 8]
      --chromaSubsampling                       Set to "4:4:4" to prevent chroma subsampling when qu
                                                ality <= 90 [string] [default: 4:4:4 (AVIF) / 4:2:0]
      --colors, --colours                       Maximum number of palette entries
                                                                             [number] [default: 256]
      --compression                             Compression options
  [choices: "ccittfax4", "deflate", "jpeg", "jp2k", "lzw", "none", "packbits", "webp", "zstd"] [defa
                                                                                        ult: "jpeg"]
      --delay                                   Delay(s) between animation frames           [number]
      --dither                                  Level of Floyd-Steinberg error diffusion
                                                                             [number] [default: 1.0]
      --effort                                  Level of CPU effort to reduce file size
                                                                [number] [default: 7 (GIF, PNG) / 4]
      --exact                                   Preserve the colour data in transparent pixels
                                                                                           [boolean]
      --hbitdepth                               Set bitdepth to 8, 10, or 12 bit
                                                                   [choices: 8, 10, 12] [default: 8]
      --hcompression                            Compression format
                                                           [choices: "hevc", "av1"] [default: "av1"]
      --interFrameMaxError                      Maximum inter-frame error for transparency  [number]
      --interPaletteMaxError                    Maximum inter-palette error for palette reuse
                                                                                            [number]
      --loop                                    Number of animation iterations [number] [default: 0]
      --lossless                                Use lossless compression mode              [boolean]
      --miniswhite                              Write 1-bit images as miniswhite           [boolean]
      --minSize                                 Prevent use of animation key frames to minimize file
                                                 size                                      [boolean]
      --mixed                                   Allow mixture of lossy and lossless animation frames
                                                                                           [boolean]
      --mozjpeg                                 Use mozjpeg defaults                       [boolean]
      --nearLossless                            Use near_lossless compression mode         [boolean]
      --optimise, --optimize                    Apply optimiseScans, overshootDeringing, and trellis
                                                Quantisation                               [boolean]
      --optimiseCoding, --optimizeCoding        Optimise Huffman coding tables
                                                                           [boolean] [default: true]
      --optimiseScans, --optimizeScans          Optimise progressive scans                 [boolean]
      --overshootDeringing                      Apply overshoot deringing                  [boolean]
      --palette                                 Quantise to a palette-based image with alpha transpa
                                                rency support                              [boolean]
      --predictor                               Compression predictor
                                    [choices: "float", "horizontal", "none"] [default: "horizontal"]
      --preset                                  Named preset for preprocessing/filtering
            [choices: "default", "photo", "picture", "drawing", "icon", "text"] [default: "default"]
      --pyramid                                 Write an image pyramid                     [boolean]
      --quantisationTable, --quantizationTable  Quantization table to use      [number] [default: 0]
      --reuse, --reoptimise, --reoptimize       Always generate new palettes (slow)        [boolean]
      --resolutionUnit                          Resolution unit
                                                             [choices: "cm", "inch"] [default: inch]
      --smartDeblock                            Auto-adjust the deblocking filter, can improve low c
                                                ontrast edges                              [boolean]
      --smartSubsample                          High quality chroma subsampling            [boolean]
      --tileBackground                          Background colour, parsed by the color module
                                                          [string] [default: rgba(255, 255, 255, 1)]
      --tileHeight                              Vertical tile size                          [number]
      --tileWidth                               Horizontal tile size                        [number]
      --trellisQuantisation                     Apply trellis quantisation                 [boolean]
      --tune                                    Tune output for a quality metric
                                             [choices: "auto", "iq", "psnr", "ssim"] [default: auto]
      --xres                                    Horizontal resolution        [number] [default: 1.0]
      --yres                                    Vertical resolution          [number] [default: 1.0]

Misc. Options
  -h, --help     Show help                                                                 [boolean]
  -v, --version  Show version number                                                       [boolean]

Examples:
  sharp -i ./input.jpg -o ./out resize 300 200        out/input.jpg will be a 300 pixels wide and 20
                                                      0 pixels high image containing a scaled and cr
                                                      opped version of input.jpg
  sharp -i ./input.jpg -o ./out -mq90 rotate 180 --   out/input.jpg will be an upside down, 300px wi
  resize 300 -- flatten "#ff6600" -- composite ./ove  de, alpha channel flattened onto orange backgr
  rlay.png --gravity southeast -- sharpen             ound, composited with overlay.png with SE grav
                                                      ity, sharpened, with metadata, 90% quality ver
                                                      sion of input.jpg
  sharp -i ./input.jpg -o ./out --metadata            Include all metadata in the output image
  sharp -i ./input.jpg -o ./out --metadata.exif.IFD0  Set "IFD0-Copyright" in output EXIF metadata
  .Copyright "Wernham Hogg"
  sharp -i ./input.jpg -o ./out --metadata.density 9  Set output metadata to 96 DPI
  6

For more information on available options, please visit https://sharp.pixelplumbing.com/
```

## Input and output

- The CLI supports input streams.
- [Glob](https://www.npmjs.com/package/glob) patterns are allowed, for example `--input './images/**/*.jpg'`. Make sure you quote the pattern when using the CLI.
- Supported output macros: `{root}`, `{dir}`, `{base}`, `{name}`, and `{ext}` (from [Node.js path](https://nodejs.org/api/path.html#path_path_parse_path)), for example: `--output {dir}` will overwrite original files. Additionally, `{path}` is the directory relative to the non-glob portion of the input path.

```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

For glob input, `{path}` can be used in an `--output` template to preserve the matched directory relative to the non-glob portion of the input path:

```
Command: sharp --input './images/**/*.jpg' --output './output/{path}/{name}.webp'
Match:   ./images/icons/example.jpg
Output:  ./output/icons/example.webp
```

## Related

- [sharp](http://sharp.pixelplumbing.com/) - API for this module

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
