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

// @see https://sharp.pixelplumbing.com/api-operation#gamma

// Package modules.
import expect from "must";
import sinon from "sinon";

// Local modules.
import gamma from "../../../cmd/operations/gamma.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("gamma", () => {
    const cli = createInstance().command(gamma);

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      before(() => cli.parseAsync(["gamma"]));

      // Tests.
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gamma");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.called(pipeline.gamma);
      });
    });

    describe("[gamma]", () => {
      // Default gamma.
      const gamma = 1.1;

      // Run.
      before(() => cli.parseAsync(["gamma", gamma]));

      // Tests.
      it("must set the gamma flag", () => {
        expect(cli.parsed.argv).to.have.property("gamma", gamma);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gamma");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWith(pipeline.gamma, gamma);
      });
    });

    describe("[gammaOut]", () => {
      // Default gammaOut.
      const gammaOut = 1.1;

      // Run.
      before(() => cli.parseAsync(["gamma", 2.2, gammaOut]));

      // Tests.
      it("must set the gammaOut flag", () => {
        expect(cli.parsed.argv).to.have.property("gammaOut", gammaOut);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gamma");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWith(pipeline.gamma, sinon.match.any, gammaOut);
      });
    });
  });
}
