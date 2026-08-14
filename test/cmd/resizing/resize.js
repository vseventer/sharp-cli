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

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import resize from "../../../cmd/resizing/resize.js";
import queue from "../../../lib/queue.js";
import sharp from "../../mocks/sharp.js";

// Test suite.
export default function register() {
  describe("resize", () => {
    const cli = yargsFactory().command(resize);

    // Default width × height.
    const width = 100;
    const height = 200;

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      it("must prompt an error", async () => {
        const error = await new Promise((resolve) =>
          cli.parse(["resize"], (err) => resolve(err)),
        );
        expect(error).to.exist();
        expect(error).to.have.property("message");
        expect(error.message).to.contain("one of width and height");
      });
    });

    describe("[width]", () => {
      beforeEach(() => cli.parse(["resize", width]));

      it("must set the width flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("width", width);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("resize");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWithMatch(pipeline.resize, width, null);
      });
    });

    describe("[height]", () => {
      beforeEach(() => cli.parse(["resize", "--height", height]));

      it("must set the height flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("height", height);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("resize");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWithMatch(pipeline.resize, null, height);
      });
    });

    describe("[width] [height]", () => {
      // Run.
      beforeEach(() => cli.parse(["resize", width, height]));

      // Tests.
      it("must set the width and height flags", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("width", width);
        expect(args).to.have.property("height", height);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("resize");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWithMatch(pipeline.resize, width, height);
      });
    });

    describe("[options]", () => {
      // @see https://sharp.pixelplumbing.com/api-resize#resize
      describe("--background", () => {
        // Default background.
        const background = "rgba(0,0,0,.5)";

        // Run.
        beforeEach(() =>
          cli.parse(["resize", width, height, "--background", background]),
        );

        // Tests.
        it("must set the background flag", () => {
          expect(cli.parsed.argv).to.have.property("background", background);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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
        beforeEach(() =>
          cli.parse(["resize", width, height, "--no-fastShrinkOnLoad"]),
        );

        it("must set the fastShrinkOnLoad flag", () => {
          expect(cli.parsed.argv).to.have.property("fastShrinkOnLoad", false);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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

        beforeEach(() => cli.parse(["resize", width, height, "--fit", fit]));

        it("must set the fit flag", () => {
          expect(cli.parsed.argv).to.have.property("fit", fit);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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

        beforeEach(() =>
          cli.parse(["resize", width, height, "--kernel", kernel]),
        );

        it("must set the kernel flag", () => {
          expect(cli.parsed.argv).to.have.property("kernel", kernel);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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

        beforeEach(() =>
          cli.parse(["resize", width, height, "--position", position]),
        );

        it("must set the position flag", () => {
          expect(cli.parsed.argv).to.have.property("position", position);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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
        beforeEach(() =>
          cli.parse(["resize", width, height, "--withoutEnlargement"]),
        );

        it("must set the withoutEnlargement flag", () => {
          expect(cli.parsed.argv).to.have.property("withoutEnlargement", true);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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
        beforeEach(() =>
          cli.parse(["resize", width, height, "--withoutReduction"]),
        );

        it("must set the withoutReduction flag", () => {
          expect(cli.parsed.argv).to.have.property("withoutReduction", true);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("resize");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
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
