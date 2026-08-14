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

// @see https://sharp.pixelplumbing.com/api-operation#erode

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import erode from "../../../cmd/operations/erode.js";
import queue from "../../../lib/queue.js";
import sharp from "../../mocks/sharp.js";

// Test suite.
export default function register() {
  describe("erode", () => {
    const cli = yargsFactory().command(erode);

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      beforeEach(() => cli.parse(["erode"]));

      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("erode");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWith(pipeline.erode, undefined);
      });
    });

    describe("[width]", () => {
      const width = 3;

      beforeEach(() => cli.parse(["erode", width]));

      it("must set the width flag", () => {
        expect(cli.parsed.argv).to.have.property("width", width);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("erode");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWith(pipeline.erode, width);
      });
    });
  });
}
