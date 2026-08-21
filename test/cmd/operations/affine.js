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

// @see https://sharp.pixelplumbing.com/api-operation#affine

// Standard lib.
import assert from "node:assert/strict";

// Package modules.
import sinon from "sinon";

// Local modules.
import affine from "../../../cmd/operations/affine.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("affine", () => {
    const cli = createInstance().command(affine);

    // Default matrix.
    const matrix = [1, 0.3, 0.1, 0.7];

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("<matrix..>", () => {
      // Run.
      before(() => cli.parseAsync(["affine", ...matrix]));

      // Tests.
      it("must set the matrix flag", () => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(cli.parsed.argv, "matrix"),
        );
        assert.deepEqual(cli.parsed.argv.matrix, matrix);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("affine"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.affine, [
          matrix.slice(0, 2),
          matrix.slice(2, 4),
        ]);
      });
    });

    describe("[options]", () => {
      describe("--background", () => {
        // Default background.
        const background = "rgba(0,0,0,.5)";

        // Run.
        before(() =>
          cli.parseAsync(["affine", ...matrix, "--background", background]),
        );

        // Tests.
        it("must set the background flag", () => {
          assert.equal(cli.parsed.argv["background"], background);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("affine"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, {
            background,
          });
        });
      });

      ["idx", "idy", "odx", "ody"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default value.
          const value = 10;

          // Run.
          before(() =>
            cli.parseAsync(["affine", ...matrix, `--${alias}`, value]),
          );

          // Tests.
          it("must set the flat flag", () => {
            assert.equal(cli.parsed.argv[alias], value);
          });
          it("must update the pipeline", () => {
            const pipeline = getPipeline(cli.parsed.argv);
            assert.equal(pipeline.length, 1);
            assert.ok(pipeline.includes("affine"));
          });
          it("must execute the pipeline", () => {
            const pipeline = drain(cli.parsed.argv);
            sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, {
              [alias]: value,
            });
          });
        });
      });

      describe("--interpolate", () => {
        // Default interpolator.
        const interpolator = "nohalo";

        // Run.
        before(() =>
          cli.parseAsync(["affine", ...matrix, "--interpolate", interpolator]),
        );

        // Tests.
        it("must set the background flag", () => {
          assert.equal(cli.parsed.argv["interpolate"], interpolator);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("affine"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.affine, sinon.match.any, {
            interpolate: interpolator,
          });
        });
      });
    });
  });
}
