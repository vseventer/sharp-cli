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

// @see https://sharp.pixelplumbing.com/api-resize#trim

// Package modules.
import expect from "must";
import sinon from "sinon";

// Local modules.
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";
import trim from "../../../cmd/resizing/trim.js";

// Test suite.
export default function register() {
  describe("trim", () => {
    const cli = createInstance().command(trim);

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      before(() => cli.parseAsync(["trim"]));

      // Tests.
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("trim");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.called(pipeline.trim);
      });
    });

    describe("[threshold]", () => {
      // Default threshold.
      const threshold = 10;

      // Run.
      before(() => cli.parseAsync(["trim", threshold]));

      // Tests.
      it("must set the threshold flag", () => {
        expect(cli.parsed.argv).to.have.property("threshold", threshold);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("trim");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.trim, { threshold });
      });
    });

    describe("[options]", () => {
      describe("--background", () => {
        // Default background.
        const background = "rgb(0, 0, 0)";

        // Run.
        before(() => cli.parseAsync(["trim", "--background", background]));

        // Tests.
        it("must set the factor flag", () => {
          expect(cli.parsed.argv).to.have.property("background", background);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("trim");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.trim, { background });
        });
      });

      describe("--lineArt", () => {
        // Run.
        before(() => cli.parseAsync(["trim", "--lineArt"]));

        // Tests.
        it("must set the factor flag", () => {
          expect(cli.parsed.argv).to.have.property("lineArt", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("trim");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.trim, { lineArt: true });
        });
      });
    });
  });
}
