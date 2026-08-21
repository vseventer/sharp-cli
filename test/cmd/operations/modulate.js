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

// @see http://sharp.pixelplumbing.com/api-operation#modulate

// Standard lib.
import assert from "node:assert/strict";

// Package modules.
import sinon from "sinon";

// Local modules.
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";
import modulate from "../../../cmd/operations/modulate.js";

// Test suite.
export default function register() {
  describe("modulate", () => {
    const cli = createInstance().command(modulate);

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      before(() => cli.parseAsync(["modulate"]));

      // Tests.
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("modulate"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.called(pipeline.modulate);
      });
    });

    describe("[options]", () => {
      ["brightness", "saturation", "hue", "lightness"].forEach((option) => {
        describe(`--${option}`, () => {
          // Default value.
          const value = 10;

          before(() => cli.parseAsync(["modulate", `--${option}`, value]));

          it(`must set the ${option} flag`, () => {
            assert.equal(cli.parsed.argv[option], value);
          });
          it("must update the pipeline", () => {
            const pipeline = getPipeline(cli.parsed.argv);
            assert.equal(pipeline.length, 1);
            assert.ok(pipeline.includes("modulate"));
          });
          it("must execute the pipeline", () => {
            const pipeline = drain(cli.parsed.argv);
            sinon.assert.calledWith(pipeline.modulate, { [[option]]: value });
          });
        });
      });
    });
  });
}
