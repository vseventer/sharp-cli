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

// Standard lib.
import assert from "node:assert/strict";

// Package modules.
import sinon from "sinon";

// Local modules.
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";
import sharpen from "../../../cmd/operations/sharpen.js";

// Test suite.
export default function register() {
  describe("sharpen", () => {
    const cli = createInstance().command(sharpen);

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    describe("..", () => {
      // Run.
      before(() => cli.parseAsync(["sharpen"]));

      // Tests.
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("sharpen"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.called(pipeline.sharpen);
      });
    });

    describe("[sigma]", () => {
      // Default sigma.
      const sigma = 1.1;

      // Run.
      before(() => cli.parseAsync(["sharpen", sigma]));

      // Tests.
      it("must set the sigma flag", () => {
        assert.equal(cli.parsed.argv["sigma"], sigma);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline.includes("sharpen"));
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.sharpen, { sigma });
      });
    });

    describe("[options]", () => {
      ["m1", "flat"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default flat.
          const flat = 1.1;

          // Run.
          before(() => cli.parseAsync(["sharpen", 2, `--${alias}`, flat]));

          // Tests.
          it("must set the flat flag", () => {
            assert.equal(cli.parsed.argv["m1"], flat);
          });
          it("must update the pipeline", () => {
            const pipeline = getPipeline(cli.parsed.argv);
            assert.equal(pipeline.length, 1);
            assert.ok(pipeline.includes("sharpen"));
          });
          it("must execute the pipeline", () => {
            const pipeline = drain(cli.parsed.argv);
            sinon.assert.calledWithMatch(pipeline.sharpen, { m1: flat });
          });
        });
      });

      ["m2", "jagged"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default jagged.
          const jagged = 1.1;

          // Run.
          before(() => cli.parseAsync(["sharpen", 2, `--${alias}`, jagged]));

          // Tests.
          it("must set the jagged flag", () => {
            assert.equal(cli.parsed.argv["jagged"], jagged);
          });
          it("must update the pipeline", () => {
            const pipeline = getPipeline(cli.parsed.argv);
            assert.equal(pipeline.length, 1);
            assert.ok(pipeline.includes("sharpen"));
          });
          it("must execute the pipeline", () => {
            const pipeline = drain(cli.parsed.argv);
            sinon.assert.calledWithMatch(pipeline.sharpen, { m2: jagged });
          });
        });
      });

      ["x1", "y2", "y3"].forEach((alias) => {
        describe(`--${alias}`, () => {
          // Default value.
          const value = 1.1;

          // Run.
          before(() => cli.parseAsync(["sharpen", 2, `--${alias}`, value]));

          // Tests.
          it("must set the flat flag", () => {
            assert.equal(cli.parsed.argv[alias], value);
          });
          it("must update the pipeline", () => {
            const pipeline = getPipeline(cli.parsed.argv);
            assert.equal(pipeline.length, 1);
            assert.ok(pipeline.includes("sharpen"));
          });
          it("must execute the pipeline", () => {
            const pipeline = drain(cli.parsed.argv);
            sinon.assert.calledWithMatch(pipeline.sharpen, { [alias]: value });
          });
        });
      });
    });
  });
}
