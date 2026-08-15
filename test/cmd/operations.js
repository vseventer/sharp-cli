/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Mark van Seventer
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

// Local modules.
import registerAffine from "./operations/affine.js";
import registerBlur from "./operations/blur.js";
import registerBoolean from "./operations/boolean.js";
import registerClahe from "./operations/clahe.js";
import registerConvolve from "./operations/convolve.js";
import registerDilate from "./operations/dilate.js";
import registerErode from "./operations/erode.js";
import registerFlatten from "./operations/flatten.js";
import registerFlip from "./operations/flip.js";
import registerFlop from "./operations/flop.js";
import registerGamma from "./operations/gamma.js";
import registerLinear from "./operations/linear.js";
import registerMedian from "./operations/median.js";
import registerModulate from "./operations/modulate.js";
import registerNegate from "./operations/negate.js";
import registerNormalise from "./operations/normalise.js";
import registerRecomb from "./operations/recomb.js";
import registerRotate from "./operations/rotate.js";
import registerSharpen from "./operations/sharpen.js";
import registerThreshold from "./operations/threshold.js";
import registerUnflatten from "./operations/unflatten.js";

// Test suite.
export default function register() {
  describe("Operations", () => {
    registerAffine();
    registerBlur();
    registerBoolean();
    registerClahe();
    registerConvolve();
    registerDilate();
    registerErode();
    registerFlatten();
    registerFlip();
    registerFlop();
    registerGamma();
    registerLinear();
    registerMedian();
    registerModulate();
    registerNegate();
    registerNormalise();
    registerRecomb();
    registerRotate();
    registerSharpen();
    registerThreshold();
    registerUnflatten();
  });
}
