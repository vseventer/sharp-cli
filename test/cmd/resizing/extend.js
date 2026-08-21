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

// @see https://sharp.pixelplumbing.com/api-resize#extend

// Standard lib.
import assert from "node:assert/strict";

// Package modules.
import sinon from "sinon";

// Local modules.
import extend from "../../../cmd/resizing/extend.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("extend", () => {
    const cli = createInstance().command(extend);

    // Default offsets.
    const top = 10;
    const bottom = 20;
    const left = 10;
    const right = 10;

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("<top> <bottom> <left> <right>", () => {
      // Run.
      before(() => cli.parseAsync(["extend", top, bottom, left, right]));

      // Tests.
      it("must set the top, bottom, left, and right flags", () => {
        const args = cli.parsed.argv;
        assert.equal(args["top"], args.top);
        assert.equal(args["bottom"], args.bottom);
        assert.equal(args["left"], args.left);
        assert.equal(args["right"], args.right);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("extend"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.extend, {
          top,
          bottom,
          left,
          right,
        });
      });
    });

    describe("[options]", () => {
      describe("--background", () => {
        // Default background.
        const background = "rgba(0,0,0,.5)";

        // Run.
        before(() =>
          cli.parseAsync([
            "extend",
            top,
            bottom,
            left,
            right,
            "--background",
            background,
          ]),
        );

        // Tests.
        it("must set the background flag", () => {
          assert.equal(cli.parsed.argv["background"], background);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("extend"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.extend, { background });
        });
      });

      describe("--extendWith", () => {
        // Default mode.
        const mode = "copy";

        // Run.
        before(() =>
          cli.parseAsync([
            "extend",
            top,
            bottom,
            left,
            right,
            "--extendWith",
            mode,
          ]),
        );

        // Tests.
        it("must set the background flag", () => {
          assert.equal(cli.parsed.argv["extendWith"], mode);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("extend"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.extend, { extendWith: mode });
        });
      });
    });
  });
}
