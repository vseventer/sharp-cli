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

// @see https://sharp.pixelplumbing.com/api-resize/

// Standard lib.
import assert from "node:assert/strict";

// Package modules.
import sinon from "sinon";

// Local modules.
import resize from "../../../cmd/resizing/resize.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("resize", () => {
    const cli = createInstance().command(resize);

    // Default width × height.
    const width = 100;
    const height = 200;

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      it("must prompt an error", () => {
        const promise = new Promise((resolve, reject) =>
          cli.parseAsync(["resize"], (error) =>
            error == null ? resolve() : reject(error),
          ),
        );
        return assert.rejects(promise, "one of width and height");
      });
    });

    describe("[width]", () => {
      before(() => cli.parseAsync(["resize", width]));

      it("must set the width flag", () => {
        const args = cli.parsed.argv;
        assert.equal(args["width"], String(width));
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("resize"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.resize, width, null);
      });
    });

    describe("[height]", () => {
      before(() => cli.parseAsync(["resize", "--height", height]));

      it("must set the height flag", () => {
        const args = cli.parsed.argv;
        assert.equal(args["height"], String(height));
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("resize"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.resize, null, height);
      });
    });

    describe("[width] [height]", () => {
      // Run.
      before(() => cli.parseAsync(["resize", width, height]));

      // Tests.
      it("must set the width and height flags", () => {
        const args = cli.parsed.argv;
        assert.equal(args["width"], String(width));
        assert.equal(args["height"], String(height));
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("resize"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.resize, width, height);
      });
    });

    describe("percentage dimensions", () => {
      const metadata = { height: 331, width: 500 };

      it("must resize width relative to input metadata", async () => {
        await cli.parseAsync(["resize", "50%"]);
        const pipeline = drain(cli.parsed.argv, { metadata });
        sinon.assert.calledWithMatch(pipeline.resize, 250, null);
      });

      it("must resize width and height relative to input metadata", async () => {
        await cli.parseAsync(["resize", "50%", "75%"]);
        const pipeline = drain(cli.parsed.argv, { metadata });
        sinon.assert.calledWithMatch(pipeline.resize, 250, 248);
      });

      it("must fail when input metadata is not set", async () => {
        await cli.parseAsync(["resize", "50%"]);
        assert.throws(
          () => drain(cli.parsed.argv),
          "metadata is required to resolve percentage",
        );
      });
    });

    describe("[options]", () => {
      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--background", () => {
        // Default background.
        const background = "rgba(0,0,0,.5)";

        // Run.
        before(() =>
          cli.parseAsync(["resize", width, height, "--background", background]),
        );

        // Tests.
        it("must set the background flag", () => {
          assert.equal(cli.parsed.argv["background"], background);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { background },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--fastShrinkOnLoad", () => {
        before(() =>
          cli.parseAsync(["resize", width, height, "--no-fastShrinkOnLoad"]),
        );

        it("must set the fastShrinkOnLoad flag", () => {
          assert.equal(cli.parsed.argv["fastShrinkOnLoad"], false);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { fastShrinkOnLoad: false },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--fit", () => {
        // Default fit.
        const fit = "fill";

        before(() => cli.parseAsync(["resize", width, height, "--fit", fit]));

        it("must set the fit flag", () => {
          assert.equal(cli.parsed.argv["fit"], fit);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { fit },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--kernel", () => {
        // Default kernel.
        const kernel = "lanczos3";

        before(() =>
          cli.parseAsync(["resize", width, height, "--kernel", kernel]),
        );

        it("must set the kernel flag", () => {
          assert.equal(cli.parsed.argv["kernel"], kernel);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { kernel },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--position", () => {
        // Default position.
        const position = "centre";

        before(() =>
          cli.parseAsync(["resize", width, height, "--position", position]),
        );

        it("must set the position flag", () => {
          assert.equal(cli.parsed.argv["position"], position);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { position },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#withoutenlargement
      describe("--withoutEnlargement", () => {
        before(() =>
          cli.parseAsync(["resize", width, height, "--withoutEnlargement"]),
        );

        it("must set the withoutEnlargement flag", () => {
          assert.equal(cli.parsed.argv["withoutEnlargement"], true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { withoutEnlargement: true },
          );
        });
      });

      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--withoutReduction", () => {
        before(() =>
          cli.parseAsync(["resize", width, height, "--withoutReduction"]),
        );

        it("must set the withoutReduction flag", () => {
          assert.equal(cli.parsed.argv["withoutReduction"], true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          assert.equal(pipeline.length, 1);
          assert.ok(pipeline.includes("resize"));
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(
            pipeline.resize,
            sinon.match.any,
            sinon.match.any,
            { withoutReduction: true },
          );
        });
      });
    });
  });
}
