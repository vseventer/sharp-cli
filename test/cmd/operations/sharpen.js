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

// @see https://sharp.pixelplumbing.com/api-operation#sharpen

// Package modules.
import expect from "must";
import sinon from "sinon";
import yargsFactory from "yargs";

// Local modules.
import queue from "../../../lib/queue.js";
import sharp from "../../mocks/sharp.js";
import sharpen from "../../../cmd/operations/sharpen.js";

// Test suite.
export default function register() {
  describe("sharpen", () => {
    const cli = yargsFactory().command(sharpen);

    // Reset.
    afterEach("queue", () => queue.splice(0));
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      beforeEach(() => cli.parse(["sharpen"]));

      // Tests.
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("sharpen");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.called(pipeline.sharpen);
      });
    });

    describe("[sigma]", () => {
      // Default sigma.
      const sigma = 1.1;

      // Run.
      beforeEach(() => cli.parse(["sharpen", sigma]));

      // Tests.
      it("must set the sigma flag", () => {
        expect(cli.parsed.argv).to.have.property("sigma", sigma);
      });
      it("must update the pipeline", () => {
        expect(queue.pipeline).to.have.length(1);
        expect(queue.pipeline).to.include("sharpen");
      });
      it("must execute the pipeline", () => {
        const pipeline = queue.drain(sharp());
        sinon.assert.calledWithMatch(pipeline.sharpen, { sigma });
      });
    });

    describe("[options]", () => {
      ["m1", "flat"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default flat.
          const flat = 1.1;

          // Run.
          beforeEach(() => cli.parse(["sharpen", 2, `--${alias}`, flat]));

          // Tests.
          it("must set the flat flag", () => {
            expect(cli.parsed.argv).to.have.property("m1", flat);
          });
          it("must update the pipeline", () => {
            expect(queue.pipeline).to.have.length(1);
            expect(queue.pipeline).to.include("sharpen");
          });
          it("must execute the pipeline", () => {
            const pipeline = queue.drain(sharp());
            sinon.assert.calledWithMatch(pipeline.sharpen, { m1: flat });
          });
        });
      });

      ["m2", "jagged"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default jagged.
          const jagged = 1.1;

          // Run.
          beforeEach(() => cli.parse(["sharpen", 2, `--${alias}`, jagged]));

          // Tests.
          it("must set the jagged flag", () => {
            expect(cli.parsed.argv).to.have.property("jagged", jagged);
          });
          it("must update the pipeline", () => {
            expect(queue.pipeline).to.have.length(1);
            expect(queue.pipeline).to.include("sharpen");
          });
          it("must execute the pipeline", () => {
            const pipeline = queue.drain(sharp());
            sinon.assert.calledWithMatch(pipeline.sharpen, { m2: jagged });
          });
        });
      });

      ["x1", "y2", "y3"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default value.
          const value = 1.1;

          // Run.
          beforeEach(() => cli.parse(["sharpen", 2, `--${alias}`, value]));

          // Tests.
          it("must set the flat flag", () => {
            expect(cli.parsed.argv).to.have.property(alias, value);
          });
          it("must update the pipeline", () => {
            expect(queue.pipeline).to.have.length(1);
            expect(queue.pipeline).to.include("sharpen");
          });
          it("must execute the pipeline", () => {
            const pipeline = queue.drain(sharp());
            sinon.assert.calledWithMatch(pipeline.sharpen, { [alias]: value });
          });
        });
      });
    });
  });
}
