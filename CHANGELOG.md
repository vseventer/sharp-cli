# Changelog

## 1.0.1-dev
* Allow and prioritize `--input`, even if there is an input stream
  (i.e. `process.stdin`).
* Added `--optimise` shorthand for `--optimiseScans`, `overshootDeringing`, and
  `trellisQuantisation`.
* Abstracted multiple command parsing algorithm to `multiyargs`.

## 1.0.0 (January 24, 2017)
* Full rewrite.

## 0.7.0 (August 21, 2016)
* Enhancement: add [`--toColorspace`](http://sharp.readthedocs.io/en/stable/api/#tocolourspacecolourspace-tocolorspacecolorspace).
* Enhancement: update `sharp` (`0.16.x`).

## 0.6.0 (August 18, 2016)
* Enhancement: add [`--bandbool`](http://sharp.dimens.io/en/stable/api/#bandbooloperation).
* Enhancement: add [`--extractChannel`](http://sharp.dimens.io/en/stable/api/#extractchannelchannel).
* Enhancement: add [`--overlayCutout`](http://sharp.dimens.io/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayLeft`](http://sharp.dimens.io/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayTile`](http://sharp.dimens.io/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--overlayTop`](http://sharp.dimens.io/en/stable/api/#overlaywithimage-options).
* Enhancement: add [`--trim`](http://sharp.dimens.io/en/stable/api/#trimtolerance).
* Enhancement: simplify verbose output.
* Enhancement: update dependencies.

## 0.5.0 (June 21, 2016)
* Enhancement: add [`--kernel`](http://sharp.dimens.io/en/stable/api/#resizewidth-height-options).
* Enhancement: rename `--interpolateWith` to [`--interpolator`](http://sharp.dimens.io/en/stable/api/#resizewidth-height-options).

## 0.4.2 (June 21, 2016)
* Bugfix: mark `--grayscale` as boolean option.
* Enhancement: update dependencies, including `sharp` (`0.15.x`).

## 0.4.1 (April 18, 2016)
* Enhancement: add [`--tileContainer`](http://sharp.dimens.io/en/stable/api/#tileoptions).

## 0.4.0 (April 4, 2016)
* Enhancement: add [`--extend`](http://sharp.dimens.io/en/stable/api/#extendextension) support.
* Enhancement: add [`--overlayGravity`](http://sharp.dimens.io/en/stable/api/#overlaywithimage-options) support.
* Enhancement: add [`--tileLayout`](http://sharp.dimens.io/en/stable/api/#tileoptions) support.
* Enhancement: update dependencies, including `sharp` (`0.14.x`).

## 0.3.1 (February 21, 2016)
* Enhancement: update dependencies, including `sharp` (`0.13.x`).

## 0.3.0 (January 26, 2016)
* Enhancement: add [`--negate`](http://sharp.dimens.io/en/stable/api/#negate) support.
* Enhancement: add [`--threshold`](http://sharp.dimens.io/en/stable/api/#thresholdthreshold) support.
* Enhancement: update dependencies, including `sharp` (`0.12.x`).

## 0.2.2 (January 13, 2016)
* Enhancement: process multiple files in batches of `25`.

## 0.2.1 (January 3, 2016)
* Enhancement: allow `rotate` without angle.

## 0.2.0 (November 6, 2015)
* Enhancement: allow same file for input and output.

## 0.1.0 (November 5, 2015)
* Initial version.