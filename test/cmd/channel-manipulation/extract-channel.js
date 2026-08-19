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

// @see https://sharp.pixelplumbing.com/api-channel#extractchannel

// Package modules.
import expect from "must";
import sinon from "sinon";

// Local modules.
import extractChannel from "../../../cmd/channel-manipulation/extract-channel.js";
import sharp from "../../mocks/sharp.js";
import { createInstance, drain, getPipeline } from "../../test-utils.js";

// Test suite.
export default function register() {
  describe("extractChannel <channel>", () => {
    const cli = createInstance().command(extractChannel);

    // Reset.
    afterEach("sharp", sharp.prototype.reset);

    // Run.
    before(() => cli.parseAsync(["extractChannel", "red"]));

    // Tests.
    it("must set the operator flag", () => {
      expect(cli.parsed.argv).to.have.property("channel", "red");
    });
    it("must update the pipeline", () => {
      const pipeline = getPipeline(cli.parsed.argv);
      expect(pipeline).to.have.length(1);
      expect(pipeline).to.include("extractChannel");
    });
    it("must execute the pipeline", () => {
      const pipeline = drain(cli.parsed.argv);
      sinon.assert.calledWith(pipeline.extractChannel, "red");
    });
  });
}
