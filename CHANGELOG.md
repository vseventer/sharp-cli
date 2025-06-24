# Changelog

## 5.2.0 (June 24, 2025)

- Added [`--autoOrient`, `pdfBackground`](https://sharp.pixelplumbing.com/api-constructor/) input option.
- Added [`--smartDeblock`](https://sharp.pixelplumbing.com/api-output#webp) output option.
- Updated `sharp` dependency.
- Updated dependencies.

## 5.1.0 (September 12, 2024)

- Added `--minAmplitude` and `--precision` blur options.
- Updated `sharp` dependency.

## 5.0.0 (July 14, 2024)

- Added `hbitdepth`, `miniswhite` options to `heif` command.
- Added `lineArt` option to `trim` command.
- Updated `sharp` dependency (requiring dependency to bump Node to 18.17+).
- Updated dependencies.

## 4.2.0 (November 25, 2023)

- Exit process when there are no input files ([#83](https://github.com/vseventer/sharp-cli/issues/83)).
- Added `unflatten` command.
- Added `extendWith` option to `extend` command.
- Added `ignoreIcc` option to `composite` command.
- Added `interFrameMaxError` and `interPaletteMaxError` output options.
- Added `lower` and `upper` options to `normalise` command.
- Added `preset` output option.
- Added `reuse` alias to `optimise` and `optimize` output options.
- Updated `sharp` dependency.

## 4.1.1 (March 21, 2023)

- Fixes bug with AVIF filename formatting ([#28](https://github.com/vseventer/sharp-cli/issues/82)).

## 4.1.0 (December 15, 2022)

- Recategorized top-level options under Global, Input, Output, and Optimization Options.
- Added `--subifd` and `unlimited` input options.
- Updated `--metadata` (previously `--withMetadata`) input option to accept more granular options.
- Expand `--animate`, `--failOn`, and `--limitInputPixels` from `composite` command to top-level.

## 4.0.0 (December 9, 2022)

- Updated `sharp` dependency.
- Updated `yargs` dependency.
- Added [`affine`](https://sharp.pixelplumbing.com/api-operation#affine) command.
- Added `--background`, `--basename`, and `--skipBlanks` to `tile` command.
- Removed `--density` from `joinChannel` command.
- Renamed `--band` to `--channel` (`extractChannel` command).
- Updated `composite` command to accept multiple images ([#73](https://github.com/vseventer/sharp-cli/issues/73)).
- Updated `--kernel` option usage in `convolve` command.
- Updated `--offset` option usage in `linear` command.
- Updated `matrix` positional usage in `recomb` command.

## 3.0.0 (September 15, 2022)

- Added [`--background`](https://sharp.pixelplumbing.com/api-resize#trim) when trimming images.
- Added [`--minSize` and `--mixed`](https://sharp.pixelplumbing.com/api-output#webp).
- Added [`--reoptimise`](https://sharp.pixelplumbing.com/api-output#gif).
- Updated TIFF compression options.
- Updated `sharp` dependency - which now requires Node.js >= 14.15.

## 2.1.1 (June 30, 2022)

- Fixed bug where images were always formatted as HEIF ([#68](https://github.com/vseventer/sharp-cli/issues/68)).

## 2.1.0 (June 19, 2022)

- Added AVIF support.
- Added GIF support.
- Added [`clahe`](https://sharp.pixelplumbing.com/api-operation#clahe) command.
- Added [`pipelineColourspace`](https://sharp.pixelplumbing.com/api-colour#pipelinecolorspace) command.
- Added `--alpha` flag to [`ensureAlpha`](https://sharp.pixelplumbing.com/api-channel#ensurealpha) and [`negate`](https://sharp.pixelplumbing.com/api-operation#negate).
- Added [`--center`](https://sharp.pixelplumbing.com/api-output#tile).
- Added [`--id`](https://sharp.pixelplumbing.com/api-output#tile).
- Added [`--lightness`](https://sharp.pixelplumbing.com/api-operation#modulate).
- Added [`--mozjpeg`](https://sharp.pixelplumbing.com/api-output#jpeg).
- Added [`--resolutionUnit`](https://sharp.pixelplumbing.com/api-output#tiff).
- Added [`--timeout`](https://sharp.pixelplumbing.com/api-output#timeout).
- Added [`--withoutReduction`](https://sharp.pixelplumbing.com/api-resize#resize).
- Added [`--x1`, `--y2`, `--y3`](https://sharp.pixelplumbing.com/api-operation#sharpen).
- Drop Node.js 10 support, now requires Node.js >= 12.22.
- Renamed `--reductionEffort` option to `--effort`.
- Replaced `--squash` by [`--bitdepth`](https://sharp.pixelplumbing.com/api-output#tiff).
- Updated default [`--compressionLevel`](http://sharp.pixelplumbing.com/api-output#png).
- Updated dependencies.

## 2.0.0 (June 18, 2022)

- Removed `--limitInputPixels` and `--sequentialRead`.
- Added [`--limitInputPixels`](https://sharp.pixelplumbing.com/api-composite#composite) when compositing images.
- Updated `sharp` dependency (adding support for Apple M1) ([#61](https://github.com/vseventer/sharp-cli/pull/61)).

## 1.15.0 (March 13, 2021)

- Added [`alpha`](https://sharp.pixelplumbing.com/api-channel#extractchannel) band option to `extractChannel`.
- Added [`density`, `level`, `page`, and `pages`](https://sharp.pixelplumbing.com/api-constructor) to input options.
- Added `iiif` layout option to tile-based output.
- Updated `sharp` dependency.

## 1.14.1 (June 6, 2020)

- Fixed bug introduced in [#24](https://github.com/vseventer/sharp-cli/issues/24) where tile-based output was not working ([#41](https://github.com/vseventer/sharp-cli/issues/41)).
- Removed path normalization for input- and output options to support URI templates ([#40](https://github.com/vseventer/sharp-cli/issues/40)).

## 1.14.0 (May 16, 2020)

- Fixed bug where resize example was missing width ([#35](https://github.com/vseventer/sharp-cli/issues/35)).
- Resizing without specifying height will now auto-scale ([#36](https://github.com/vseventer/sharp-cli/issues/36)).
- Updated `sharp` dependency (now requires Node.js >= 10).

## 1.13.1 (November 22, 2019)

- Fixed bug where output directory was invalid ([#26](https://github.com/vseventer/sharp-cli/issues/26)).

## 1.13.0 (November 22, 2019)

- Added support for glob input ([#27](https://github.com/vseventer/sharp-cli/issues/27)).
- Fixed bug where options were applied to HEIF, even if libheif was not installed ([#25](https://github.com/vseventer/sharp-cli/issues/25)).
- Replaced `url-template` dependency by regex replacement ([#26](https://github.com/vseventer/sharp-cli/issues/26)).

## 1.12.0 (November 18, 2019)

- Added [`--tileBackground`](https://sharp.pixelplumbing.com/api-output#tile) option.
- Added support for same file for input and output ([#24](https://github.com/vseventer/sharp-cli/issues/24)).
- Replaced `tempfile` with `tempy` dependency.
- Updated `sharp` dependency.

## 1.11.0 (November 2, 2019)

- Added support for HEIF images.
- Added [`--hcompression`](https://sharp.pixelplumbing.com/api-output#heif) option.
- Added [`--premultiplied`](https://sharp.pixelplumbing.com/en/latest/api-composite#composite) option.
- Added [`--reductionEffort` and `--smartSubsample`](https://sharp.pixelplumbing.com/api-output#webp) options.
- Fixed bug with output directories ([#16](https://github.com/vseventer/sharp-cli/issues/16)).
- Removed [`overlayWith`](http://sharp.pixelplumbing.com/en/v0.21.3/api-composite#overlaywith) command.
- Updated `fs-extra`, `mocha`, `sharp`, `sinon`, and `standard` dependencies.

## 1.10.0 (June 26, 2019)

- Added [`composite`](http://sharp.pixelplumbing.com/api-composite#composite) command.
- Added [`modulate`](http://sharp.pixelplumbing.com/api-operation#modulate) command.
- Deprecated [`overlayWith`](http://sharp.pixelplumbing.com/en/v0.21.3/api-composite#overlaywith) command.
- Increased required version to Node.js 8.
- Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, and `tempfile` dependencies (#18).

## 1.9.0 (January 26, 2019)

- Added [`--colors`, `--dither`, and `--palette`](https://sharp.pixelplumbing.com/api-output#png) options.
- Added [`ensureAlpha`](https://sharp.pixelplumbing.com/api-channel#ensurealpha) command.
- Added exit code 1 for errorneuos commands (#15).
- Updated `sharp` dependency.

## 1.8.0 (January 5, 2019)

- Added `--background` option to [`resize`](https://sharp.dimens.io/api-resize#resize) and [`rotate`](https://sharp.dimens.io/api-operation#rotate) commands.
- Added [`--fit` and `--position`](https://sharp.dimens.io/api-resize#resize) options.
- Added [`--factorOut`](https://sharp.dimens.io/api-operation#gamma) option.
- Added [`--pyramid`, `--tileWidth`, and `--tileHeight`](https://sharp.dimens.io/api-output#tiff) options.
- Added [`extend`](https://sharp.dimens.io/api-resize#extend) command.
- Added [`flatten`](https://sharp.dimens.io/api-operation#flatten) command.
- Added [`recomb`](https://sharp.dimens.io/api-operation#recomb) command.
- Removed `--crop`, `--ignoreAspectRatio`, `--min`, and `--max` options.
- Removed `background` command.
- Renamed `--tolerance` option to [`--threshold`](https://sharp.dimens.io/api-resize#trim).
- Updated `sharp` and `sinon` dependencies.

## 1.7.2 (December 4, 2018)

- Added [`--depth`](https://sharp.pixelplumbing.com/api-output#tile) option.
- Added [`--quantisationTable`](https://sharp.pixelplumbing.com/api-output#jpeg) option.
- Added [removeAlpha](https://sharp.pixelplumbing.com/api-channel#removealpha) command.
- Updated `nyc`, `sharp`, `sinon`, `snazzy`, `standard`, and `yargs` dependencies.

## 1.7.1 (July 24, 2018)

- Added [`--optimiseCoding`](http://sharp.pixelplumbing.com/api-output#jpeg) option.
- Added `ccittfax4` compression option to TIFF output.
- Added [median](http://sharp.pixelplumbing.com/api-operation#median) command.
- Added [tint](http://sharp.pixelplumbing.com/api-colour#tint) command.
- Updated `fs-extra`, `mocha`, `nyc`, `sharp`, and `sinon` dependencies.

## 1.7.0 (March 9, 2018)

- Added [linear](http://sharp.pixelplumbing.com/api-operation#linear) command.
- Added `--angle` option to [tile](http://sharp.pixelplumbing.com/api-output#tile) command.
- Updated `sharp`, `sinon`, `snazzy`, and `standard` dependencies.

## 1.6.0 (January 28, 2018)

- Added [`--fastShrinkOnLoad`](http://sharp.pixelplumbing.com/api-resize#resize)
  (`sharp` 0.19.0).
- Added gravity option to [`--embed`](http://sharp.pixelplumbing.com/api-resize#embed).
- Fixed bug with [`--withoutEnlargement`](http://sharp.pixelplumbing.com/api-resize#withoutenlargement)
  ([#11](https://github.com/vseventer/sharp-cli/issues/11)).
- Fixed bug with URI templates on Windows ([#8](https://github.com/vseventer/sharp-cli/issues/8)).
- Removed `--interpolator` and `--centreSampling` resize options (`sharp` 0.19.0).
- Updated default [`--compressionLevel`](http://sharp.pixelplumbing.com/api-output#png)
  and [`--predictor`](http://sharp.pixelplumbing.com/api-output#tiff)
  (`sharp` 0.19.0).
- Updated output paths to resolve only after parsing URI template ([#9](https://github.com/vseventer/sharp-cli/issues/9)).
- Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, and `yargs` dependencies.

## 1.5.2 (October 27, 2017)

- Updated `mocha`, `sinon`, and `yargs` dependencies.

## 1.5.1 (September 22, 2017)

- Updated `mocha`, `nyc`, and `sharp` dependencies.

## 1.5.0 (July 20, 2017)

> https://github.com/vseventer/sharp-cli/compare/v1.4.0...v1.5.0

- Added [`--xres`](http://sharp.pixelplumbing.com/api-output#tiff) and
  [`--yres`](http://sharp.pixelplumbing.com/api-output#tiff) (`sharp` 0.18.2).
- Updated `fs-extra` dependency.

## 1.4.0 (June 26, 2017)

> https://github.com/vseventer/sharp-cli/compare/v1.3.0...v1.4.0

- Added [`--squash`](http://sharp.pixelplumbing.com/api-output#tiff)
  (`sharp` 0.18.0).
- Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, `snazzy`, `standard`,
  and `yargs` dependencies.

## 1.3.0 (April 3, 2017)

> https://github.com/vseventer/sharp-cli/compare/v1.2.0...v1.3.0

- Added [`--compression`](http://sharp.pixelplumbing.com/api-output#tiff)
  and [`--predictor`](http://sharp.pixelplumbing.com/api-output#tiff)
  (`sharp` 0.17.3).
- Added [`--create`](http://sharp.pixelplumbing.com/api-composite#overlaywith)
  (`sharp` 0.17.3).
- Updated `fs-extra`, `nyc`, `sinon`, and `tempfile` dependencies.

## 1.2.0 (March 18, 2017)

> https://github.com/vseventer/sharp-cli/compare/v1.1.0...v1.2.0

- Added support for [URI templates](https://www.npmjs.com/package/url-template).
- Replaced `chai` with `must`.
- Updated `multiyargs`, `sinon`, and `standard` dependencies.

## 1.1.0 (Febuary 13, 2017)

> https://github.com/vseventer/sharp-cli/compare/v1.0.1...v1.1.0

- Added [`--alphaQuality`](http://sharp.pixelplumbing.com/api-output#webp),
  [`--lossless`](http://sharp.pixelplumbing.com/api-output#webp), and
  [`nearLossless`](http://sharp.pixelplumbing.com/api-output#webp)
  (`sharp` 0.17.2).
- Removed `stream-to-buffer` as it caused errors when working with large files.
  Unfortunately, this means input and output cannot use the same file.

## 1.0.1 (January 29, 2017)

- Allow and prioritize `--input`, even if there is an input stream
  (i.e. `process.stdin`).
- Added `--optimise` shorthand for `--optimiseScans`, `--overshootDeringing`,
  and `--trellisQuantisation`.
- Abstracted multiple command parsing algorithm to `multiyargs`.

## 1.0.0 (January 24, 2017)

- Full rewrite.

## 0.7.0 (August 21, 2016)

- Enhancement: add [`--toColorspace`](http://sharp.readthedocs.io/api#tocolourspacecolourspace-tocolorspacecolorspace).
- Enhancement: update `sharp` (`0.16.x`).

## 0.6.0 (August 18, 2016)

- Enhancement: add [`--bandbool`](http://sharp.pixelplumbing.com/api#bandbooloperation).
- Enhancement: add [`--extractChannel`](http://sharp.pixelplumbing.com/api#extractchannelchannel).
- Enhancement: add [`--overlayCutout`](http://sharp.pixelplumbing.com/api#overlaywithimage-options).
- Enhancement: add [`--overlayLeft`](http://sharp.pixelplumbing.com/api#overlaywithimage-options).
- Enhancement: add [`--overlayTile`](http://sharp.pixelplumbing.com/api#overlaywithimage-options).
- Enhancement: add [`--overlayTop`](http://sharp.pixelplumbing.com/api#overlaywithimage-options).
- Enhancement: add [`--trim`](http://sharp.pixelplumbing.com/api#trimtolerance).
- Enhancement: simplify verbose output.
- Enhancement: update dependencies.

## 0.5.0 (June 21, 2016)

- Enhancement: add [`--kernel`](http://sharp.pixelplumbing.com/api#resizewidth-height-options).
- Enhancement: rename `--interpolateWith` to [`--interpolator`](http://sharp.pixelplumbing.com/api#resizewidth-height-options).

## 0.4.2 (June 21, 2016)

- Bugfix: mark `--grayscale` as boolean option.
- Enhancement: update dependencies, including `sharp` (`0.15.x`).

## 0.4.1 (April 18, 2016)

- Enhancement: add [`--tileContainer`](http://sharp.pixelplumbing.com/api#tileoptions).

## 0.4.0 (April 4, 2016)

- Enhancement: add [`--extend`](http://sharp.pixelplumbing.com/api#extendextension) support.
- Enhancement: add [`--overlayGravity`](http://sharp.pixelplumbing.com/api#overlaywithimage-options) support.
- Enhancement: add [`--tileLayout`](http://sharp.pixelplumbing.com/api#tileoptions) support.
- Enhancement: update dependencies, including `sharp` (`0.14.x`).

## 0.3.1 (February 21, 2016)

- Enhancement: update dependencies, including `sharp` (`0.13.x`).

## 0.3.0 (January 26, 2016)

- Enhancement: add [`--negate`](http://sharp.pixelplumbing.com/api#negate) support.
- Enhancement: add [`--threshold`](http://sharp.pixelplumbing.com/api#thresholdthreshold) support.
- Enhancement: update dependencies, including `sharp` (`0.12.x`).

## 0.2.2 (January 13, 2016)

- Enhancement: process multiple files in batches of `25`.

## 0.2.1 (January 3, 2016)

- Enhancement: allow `rotate` without angle.

## 0.2.0 (November 6, 2015)

- Enhancement: allow same file for input and output.

## 0.1.0 (November 5, 2015)

- Initial version.
