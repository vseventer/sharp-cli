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
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

// Package modules.
import expect from "must";
import fs from "fs-extra";
import { temporaryDirectory, temporaryFile } from "tempy";

// Local modules.
import convert from "../lib/convert.js";
import queue from "../lib/queue.js";
import tile from "../cmd/output.js";

// Test suite.
describe("convert", () => {
  const options = { sequentialRead: false };

  // Default input.
  const input = fileURLToPath(new URL("./fixtures/input.jpg", import.meta.url));

  describe("files", () => {
    // Default output.
    let copy, dest;
    before(() => {
      dest = temporaryDirectory();
    });
    beforeEach(() => {
      copy = temporaryFile();
    });
    beforeEach(async () => fs.copy(input, copy));
    afterEach(() => {
      queue.length = 0; // Empty queue.
    });
    afterEach(() => fs.remove(copy));
    afterEach(() => fs.emptyDir(dest));
    after(() => fs.remove(dest));

    // Tests.
    it("must convert a file", () => {
      return convert
        .files([input], dest, options)
        .then(([info]) => expect(fs.existsSync(info.path)).to.be.true);
    });
    it("must convert a file formatted based on extension", () => {
      return convert
        .files([input], path.join(dest, "{name}.avif"), options)
        .then(([info]) => {
          expect(info).to.have.property("format", "heif");
          expect(info).to.have.property("path");
          expect(info.path).to.contain(".avif");
        });
    });
    it("must convert a file and output to an existing directory", () => {
      // Negative test for directory that does not exist.
      const rand = "" + Math.random();
      return convert
        .files([input, input], rand, options)
        .then(() => {
          throw new Error("STOP");
        })
        .catch((err) => {
          expect(err).to.exist();
          expect(err).to.have.property("message");
          expect(err.message).to.contain(`${rand}/input.jpg`);
          expect(err.message).to.contain("No such file or directory");
        });
    });
    it("must convert multiple files", () => {
      return convert
        .files([input, input], dest, options)
        .then((info) => expect(info).to.have.length(2));
    });
    it("must support output templates", () => {
      const rand = Math.random();
      return convert
        .files([input], path.join(dest, `{name}-${rand}{ext}`), options)
        .then(([info]) => expect(info.path).to.contain(`input-${rand}.jpg`));
    });
    it("must allow the same file as input and output", () => {
      return convert.files([copy], path.dirname(copy), options);
    });
    it("must support tiled output", () => {
      tile.handler({ container: "zip" });
      return convert.files([input], dest, options);
    });
    it("must warn if there is no files", () => {
      return convert
        .files([])
        .then(() => {
          throw new Error("STOP");
        })
        .catch((err) => {
          expect(err).to.exist();
          expect(err).to.have.property("message");
          expect(err.message).to.contain("No input files");
        });
    });
  });
  describe("stream", () => {
    // Default output.
    let dest;
    beforeEach(() => {
      dest = temporaryFile();
    });
    afterEach(() => fs.remove(dest));

    // Tests.
    it("must convert a file", () => {
      return convert
        .stream(fs.createReadStream(input), fs.createWriteStream(dest), options)
        .then((info) => {
          expect(info.format).to.exist();
          expect(info.path).not.to.exist();
          expect(fs.existsSync(dest)).to.be.true();
        });
    });
    it("must reject stream errors", () => {
      return convert
        .stream(
          Readable.from(["not an image"]),
          fs.createWriteStream(dest),
          options,
        )
        .then(() => {
          throw new Error("STOP");
        })
        .catch((err) => {
          expect(err).to.exist();
          expect(err.message).to.contain("unsupported image format");
        });
    });
  });
});
