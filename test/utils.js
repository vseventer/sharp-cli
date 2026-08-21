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

// Standard lib.
import assert from "node:assert/strict";

// Local modules.
import { isDirectory, pick } from "../lib/utils.js";

// Test suite.
describe("utils", () => {
  describe("isDirectory", () => {
    it("must identify directories", () => {
      assert.equal(isDirectory(new URL(".", import.meta.url)), true);
    });

    it("must return false for missing paths", () => {
      assert.equal(isDirectory(new URL("./missing", import.meta.url)), false);
    });
  });

  describe("pick", () => {
    it("must pick own properties, including falsy values", () => {
      const input = { falseValue: false, nullValue: null, zero: 0 };
      assert.deepEqual(pick(input, ["falseValue", "nullValue", "zero"]), input);
    });

    it("must omit missing properties", () => {
      assert.deepEqual(pick({ value: 1 }, ["missing"]), {});
    });
  });
});
