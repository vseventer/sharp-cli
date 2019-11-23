# Changelog

## 1.13.1 (November 22, 2019)
* Fixed bug where output directory was invalid ([#26](https://github.com/vseventer/sharp-cli/issues/26)).

## 1.13.0 (November 22, 2019)
* Added support for glob input ([#27](https://github.com/vseventer/sharp-cli/issues/27)).
* Fixed bug where options were applied to HEIF, even if libheif was not installed ([#25](https://github.com/vseventer/sharp-cli/issues/25)).
* Replaced `url-template` dependency by regex replacement ([#26](https://github.com/vseventer/sharp-cli/issues/26)).

## 1.12.0 (November 18, 2019)
* Added [`--tileBackground`](https://sharp.pixelplumbing.com/en/stable/api-output/#tile) option.
* Added support for same file for input and output ([#24](https://github.com/vseventer/sharp-cli/issues/24)).
* Replaced `tempfile` with `tempy` dependency.
* Updated `sharp` dependency.

## 1.11.0 (November 2, 2019)
* Added support for HEIF images.
* Added [`--hcompression`](https://sharp.pixelplumbing.com/en/stable/api-output/#heif) option.
* Added [`--premultiplied`](https://sharp.pixelplumbing.com/en/latest/api-composite/#composite) option.
* Added [`--reductionEffort` and `--smartSubsample`](https://sharp.pixelplumbing.com/en/stable/api-output/#webp) options.
* Fixed bug with output directories ([#16](https://github.com/vseventer/sharp-cli/issues/16)).
* Removed [`overlayWith`](http://sharp.pixelplumbing.com/en/v0.21.3/api-composite/#overlaywith) command.
* Updated `fs-extra`, `mocha`, `sharp`, `sinon`, and `standard` dependencies.

## 1.10.0 (June 26, 2019)
* Added [`composite`](http://sharp.pixelplumbing.com/en/stable/api-composite/#composite) command.
* Added [`modulate`](http://sharp.pixelplumbing.com/en/stable/api-operation/#modulate) command.
* Deprecated [`overlayWith`](http://sharp.pixelplumbing.com/en/v0.21.3/api-composite/#overlaywith) command.
* Increased required version to Node.js 8.
* Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, and `tempfile` dependencies (#18).

## 1.9.0 (January 26, 2019)
* Added [`--colors`, `--dither`, and `--palette`](https://sharp.pixelplumbing.com/en/stable/api-output/#png) options.
* Added [`ensureAlpha`](https://sharp.pixelplumbing.com/en/stable/api-channel/#ensurealpha) command.
* Added exit code 1 for errorneuos commands (#15).
* Updated `sharp` dependency.

## 1.8.0 (January 5, 2019)
* Added `--background` option to [`resize`](https://sharp.dimens.io/en/stable/api-resize/#resize) and [`rotate`](https://sharp.dimens.io/en/stable/api-operation/#rotate) commands.
* Added [`--fit` and `--position`](https://sharp.dimens.io/en/stable/api-resize/#resize) options.
* Added [`--factorOut`](https://sharp.dimens.io/en/stable/api-operation/#gamma) option.
* Added [`--pyramid`, `--tileWidth`, and `--tileHeight`](https://sharp.dimens.io/en/stable/api-output/#tiff) options.
* Added [`extend`](https://sharp.dimens.io/en/stable/api-resize/#extend) command.
* Added [`flatten`](https://sharp.dimens.io/en/stable/api-operation/#flatten) command.
* Added [`recomb`](https://sharp.dimens.io/en/stable/api-operation/#recomb) command.
* Removed `--crop`, `--ignoreAspectRatio`, `--min`, and `--max` options.
* Removed `background` command.
* Renamed `--tolerance` option to [`--threshold`](https://sharp.dimens.io/en/stable/api-resize/#trim).
* Updated `sharp` and `sinon` dependencies.

## 1.7.2 (December 4, 2018)
* Added [`--depth`](https://sharp.pixelplumbing.com/en/stable/api-output/#tile) option.
* Added [`--quantisationTable`](https://sharp.pixelplumbing.com/en/stable/api-output/#jpeg) option.
* Added [removeAlpha](https://sharp.pixelplumbing.com/en/stable/api-channel/#removealpha) command.
* Updated `nyc`, `sharp`, `sinon`, `snazzy`, `standard`, and `yargs` dependencies.

## 1.7.1 (July 24, 2018)
* Added [`--optimiseCoding`](http://sharp.pixelplumbing.com/en/stable/api-output/#jpeg) option.
* Added `ccittfax4` compression option to TIFF output.
* Added [median](http://sharp.pixelplumbing.com/en/stable/api-operation/#median) command.
* Added [tint](http://sharp.pixelplumbing.com/en/stable/api-colour/#tint) command.
* Updated `fs-extra`, `mocha`, `nyc`, `sharp`, and `sinon` dependencies.

## 1.7.0 (March 9, 2018)
* Added [linear](http://sharp.pixelplumbing.com/en/stable/api-operation/#linear) command.
* Added `--angle` option to [tile](http://sharp.pixelplumbing.com/en/stable/api-output/#tile) command.
* Updated `sharp`, `sinon`, `snazzy`, and `standard` dependencies.

## 1.6.0 (January 28, 2018)
* Added [`--fastShrinkOnLoad`](http://sharp.pixelplumbing.com/en/stable/api-resize/#resize)
  (`sharp` 0.19.0).
* Added gravity option to [`--embed`](http://sharp.pixelplumbing.com/en/stable/api-resize/#embed).
* Fixed bug with [`--withoutEnlargement`](http://sharp.pixelplumbing.com/en/stable/api-resize/#withoutenlargement)
  ([#11](https://github.com/vseventer/sharp-cli/issues/11)).
* Fixed bug with URI templates on Windows ([#8](https://github.com/vseventer/sharp-cli/issues/8)).
* Removed `--interpolator` and `--centreSampling` resize options (`sharp` 0.19.0).
* Updated default [`--compressionLevel`](http://sharp.pixelplumbing.com/en/stable/api-output/#png)
  and [`--predictor`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff)
  (`sharp` 0.19.0).
* Updated output paths to resolve only after parsing URI template ([#9](https://github.com/vseventer/sharp-cli/issues/9)).
* Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, and `yargs` dependencies.

## 1.5.2 (October 27, 2017)
* Updated `mocha`, `sinon`, and `yargs` dependencies.

## 1.5.1 (September 22, 2017)
* Updated `mocha`, `nyc`, and `sharp` dependencies.

## 1.5.0 (July 20, 2017)
> https://github.com/vseventer/sharp-cli/compare/v1.4.0...v1.5.0

* Added [`--xres`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff) and
  [`--yres`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff) (`sharp` 0.18.2).
* Updated `fs-extra` dependency.

## 1.4.0 (June 26, 2017)
> https://github.com/vseventer/sharp-cli/compare/v1.3.0...v1.4.0

* Added [`--squash`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff)
  (`sharp` 0.18.0).
* Updated `fs-extra`, `mocha`, `nyc`, `sharp`, `sinon`, `snazzy`, `standard`,
  and `yargs` dependencies.

## 1.3.0 (April 3, 2017)
> https://github.com/vseventer/sharp-cli/compare/v1.2.0...v1.3.0

* Added [`--compression`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff)
  and [`--predictor`](http://sharp.pixelplumbing.com/en/stable/api-output/#tiff)
  (`sharp` 0.17.3).
* Added [`--create`](http://sharp.pixelplumbing.com/en/stable/api-composite/#overlaywith)
  (`sharp` 0.17.3).
* Updated `fs-extra`, `nyc`, `sinon`, and `tempfile` dependencies.

## 1.2.0 (March 18, 2017)
> https://github.com/vseventer/sharp-cli/compare/v1.1.0...v1.2.0

* Added support for [URI templates](https://www.npmjs.com/package/url-template).
* Replaced `chai` with `must`.
* Updated `multiyargs`, `sinon`, and `standard` dependencies.

## 1.1.0 (Febuary 13, 2017)
> https://github.com/vseventer/sharp-cli/compare/v1.0.1...v1.1.0

* Added [`--alphaQuality`](http://sharp.pixelplumbing.com/en/stable/api-output/#webp),
  [`--lossless`](http://sharp.pixelplumbing.com/en/stable/api-output/#webp), and
  [`nearLossless`](http://sharp.pixelplumbing.com/en/stable/api-output/#webp)
  (`sharp` 0.17.2).
* Removed `stream-to-buffer` as it caused errors when working with large files.
  Unfortunately, this means input and output cannot use the same file.

## 1.0.1 (January 29, 2017)
* Allow and prioritize `--input`, even if there is an input stream
  (i.e. `process.stdin`).
* Added `--optimise` shorthand for `--optimiseScans`, `--overshootDeringing`,
  and `--trellisQuantisation`.
* Abstracted multiple command parsing algorithm to `multiyargs`.

## 1.0.0 (January 24, 2017)
* Full rewrite.

## 0.7.0 (August 21, 2016)
* Enhancement: add [`--toColorspace`](http://sharp.readthedocs.io/en/stable/api/#tocolourspacecolourspace-tocolorspacecolorspace).
* Enhancement: update `sharp` (`0.16.x`).

## 0.6.0 (August 18, 2016)
* Enhancement: add [`--bandbool`](http://sharp.pixelplumbing.com/en/stable/api/#bandbooloperation).
* Enhancement: add [`--extractChannel`](http://sharp.pixelplumbing.com/en/stable/api/#extractchannelchannel).
* Enhancement: add [`--overlayCutout`](http://sharp.pixelplumbing.com/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayLeft`](http://sharp.pixelplumbing.com/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayTile`](http://sharp.pixelplumbing.com/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayTop`](http://sharp.pixelplumbing.com/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--trim`](http://sharp.pixelplumbing.com/en/stable/api/#trimtolerance).
* Enhancement: simplify verbose output.
* Enhancement: update dependencies.

## 0.5.0 (June 21, 2016)
* Enhancement: add [`--kernel`](http://sharp.pixelplumbing.com/en/stable/api/#resizewidth-height-options).
* Enhancement: rename `--interpolateWith` to [`--interpolator`](http://sharp.pixelplumbing.com/en/stable/api/#resizewidth-height-options).

## 0.4.2 (June 21, 2016)
* Bugfix: mark `--grayscale` as boolean option.
* Enhancement: update dependencies, including `sharp` (`0.15.x`).

## 0.4.1 (April 18, 2016)
* Enhancement: add [`--tileContainer`](http://sharp.pixelplumbing.com/en/stable/api/#tileoptions).

## 0.4.0 (April 4, 2016)
* Enhancement: add [`--extend`](http://sharp.pixelplumbing.com/en/stable/api/#extendextension) support.
* Enhancement: add [`--overlayGravity`](http://sharp.pixelplumbing.com/en/stable/api/#overlaywithimage-options) support.
* Enhancement: add [`--tileLayout`](http://sharp.pixelplumbing.com/en/stable/api/#tileoptions) support.
* Enhancement: update dependencies, including `sharp` (`0.14.x`).

## 0.3.1 (February 21, 2016)
* Enhancement: update dependencies, including `sharp` (`0.13.x`).

## 0.3.0 (January 26, 2016)
* Enhancement: add [`--negate`](http://sharp.pixelplumbing.com/en/stable/api/#negate) support.
* Enhancement: add [`--threshold`](http://sharp.pixelplumbing.com/en/stable/api/#thresholdthreshold) support.
* Enhancement: update dependencies, including `sharp` (`0.12.x`).

## 0.2.2 (January 13, 2016)
* Enhancement: process multiple files in batches of `25`.

## 0.2.1 (January 3, 2016)
* Enhancement: allow `rotate` without angle.

## 0.2.0 (November 6, 2015)
* Enhancement: allow same file for input and output.

## 0.1.0 (November 5, 2015)
* Initial version.
