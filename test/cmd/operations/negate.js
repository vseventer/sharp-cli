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

// @see https://sharp.pixelplumbing.com/api-operation#negate

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import negate from "../../../cmd/operations/negate.js";
import queue from "../../../lib/queue.js";
import sharp from "../../mocks/sharp.js";

// Test suite.
export default function register() {
  describe("negate", () => {
    const cli = yargsFactory().command(negate);

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      beforeEach(() => cli.parse(["negate"]));

      // Tests.
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("negate");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.called(pipeline.negate);
      });
    });

    describe("[options]", () => {
      describe("--alpha", () => {
        // Run.
        beforeEach(() => cli.parse(["negate", "--no-alpha"]));

        // Tests.
        it("must set the alpha flag", () => {
          expect(cli.parsed.argv).to.have.property("alpha", false);
        });
        it("must update the pipeline", () => {
          expect(queue.pipeline).to.have.length(1);
          expect(queue.pipeline).to.include("negate");
        });
        it("must execute the pipeline", () => {
          const pipeline = queue.drain(sharp());
          sinon.assert.calledWith(pipeline.negate, false);
        });
      });
    });
  });
}
