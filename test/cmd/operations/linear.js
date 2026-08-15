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

// @see https://sharp.pixelplumbing.com/api-operation#rotate

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import queue from "../../../lib/queue.js";
import linear from "../../../cmd/operations/linear.js";
import sharp from "../../mocks/sharp.js";

// Test suite.
export default function register() {
  describe("linear", () => {
    const cli = yargsFactory().command(linear);

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      beforeEach(() => cli.parse(["linear"]));

      // Tests.
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("linear");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.called(pipeline.linear);
      });
    });

    describe("[multiplier..]", () => {
      // Default multiplier.
      const multiplier = 1.5;

      // Run.
      beforeEach(() => cli.parse(["linear", multiplier]));

      // Tests.
      it("must set the multiplier flag", () => {
        expect(cli.parsed.argv).to.have.property("multiplier");
        expect(cli.parsed.argv.multiplier[0]).to.equal(multiplier);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("linear");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWith(pipeline.linear, multiplier);
      });
    });

    describe("[offset]", () => {
      // Default offset.
      const offset = 0.5;

      // Run.
      beforeEach(() => cli.parse(["linear", 1.5, "--offset", offset]));

      // Tests.
      it("must set the offset flag", () => {
        expect(cli.parsed.argv).to.have.property("offset");
        expect(cli.parsed.argv.offset[0]).to.equal(offset);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("linear");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWith(pipeline.linear, sinon.match.any, [offset]);
      });
    });
  });
}
