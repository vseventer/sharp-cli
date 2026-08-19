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

// @see https://sharp.pixelplumbing.com/api-operation#blur

// Package modules.
import expect from "must";
import sinon from "sinon";

// Local modules.
import blur from "../../../cmd/operations/blur.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("blur", () => {
    const cli = createInstance().command(blur);

    // Default amplitude and precision.
    const amplitude = 0.5;
    const precision = "approximate";

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      before(() => cli.parseAsync(["blur"]));

      // Tests.
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("blur");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.called(pipeline.blur);
      });
    });

    describe("[sigma]", () => {
      // Default sigma.
      const sigma = 1.1;

      // Run.
      before(() => cli.parseAsync(["blur", sigma]));

      // Tests.
      it("must set the sigma flag", () => {
        expect(cli.parsed.argv).to.have.property("sigma", sigma);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("blur");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWith(pipeline.blur, sigma);
      });
    });

    describe("[minAmplitude]", () => {
      // Run.
      before(() =>
        cli.parseAsync([
          "blur",
          5,
          "--minAmplitude",
          amplitude,
          "--precision",
          precision,
        ]),
      );

      // Tests.
      it("must set the minAmplitude flag", () => {
        expect(cli.parsed.argv).to.have.property("minAmplitude");
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("blur");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.blur, {
          minAmplitude: amplitude,
        });
      });
    });

    describe("[precision]", () => {
      // Run.
      before(() =>
        cli.parseAsync([
          "blur",
          5,
          "--minAmplitude",
          amplitude,
          "--precision",
          precision,
        ]),
      );

      // Tests.
      it("must set the offset flag", () => {
        expect(cli.parsed.argv).to.have.property("precision");
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("blur");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.blur, { precision });
      });
    });
  });
}
