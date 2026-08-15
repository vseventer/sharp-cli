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

// @see https://sharp.pixelplumbing.com/api-operation#convolve

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import convolve from "../../../cmd/operations/convolve.js";
import queue from "../../../lib/queue.js";
import sharp from "../../mocks/sharp.js";

// Test suite.
export default function register() {
  describe("convolve", () => {
    const cli = yargsFactory().command(convolve);

    // Default width, height, and kernel.
    const width = 3;
    const height = 3;
    const kernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("<width> <height> <kernel>", () => {
      // Run.
      beforeEach(() => cli.parse(["convolve", width, height, ...kernel]));

      // Tests.
      it("must set the width, height, and kernel flags", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("width", width);
        expect(args).to.have.property("height", height);
        expect(args).to.have.property("kernel");
        expect(args.kernel).to.eql(kernel);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("convolve");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWithMatch(pipeline.convolve, {
          width,
          height,
          kernel,
        });
      });
    });

    describe("[options]", () => {
      describe("--offset", () => {
        // Default offset.
        const offset = 10;

        beforeEach(() =>
          cli.parse(["convolve", width, height, ...kernel, "--offset", offset]),
        );

        it("must set the offset flag", () => {
          expect(cli.parsed.argv).to.have.property("offset", offset);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("convolve");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
          sinon.assert.calledWithMatch(pipeline.convolve, { offset });
        });
      });
      describe("--scale", () => {
        // Default scale.
        const scale = 10;

        beforeEach(() =>
          cli.parse(["convolve", width, height, ...kernel, "--scale", scale]),
        );

        it("must set the scale flag", () => {
          expect(cli.parsed.argv).to.have.property("scale", scale);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("convolve");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
          sinon.assert.calledWithMatch(pipeline.convolve, { scale });
        });
      });
    });
  });
}
