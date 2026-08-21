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
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { fileURLToPath } from "node:url";

// Package modules.
import fs from "fs-extra";
import { temporaryDirectory, temporaryFile } from "tempy";

// Local modules.
import convert from "../lib/convert.js";
import tile from "../cmd/output.js";

// Test suite.
describe("convert", () => {
  const options = { sequentialRead: false };
  const createContext = () => ({ options, queue: [] });
  const getValue = (result) => {
    assert.equal(result.status, "fulfilled");
    return result.value;
  };

  // Default input.
  const input = fileURLToPath(new URL("./fixtures/input.jpg", import.meta.url));

  describe("files", () => {
    // Default output.
    let copy, dest;
    before(() => {
      dest = temporaryDirectory();
    });
    beforeEach(() => {
      copy = temporaryFile({ extension: "jpg" });
    });
    beforeEach(async () => fs.copy(input, copy));
    afterEach(() => fs.remove(copy));
    afterEach(() => fs.emptyDir(dest));
    after(() => fs.remove(dest));

    // Tests.
    it("must convert a file", () => {
      return convert
        .files([input], dest, createContext())
        .then(([result]) =>
          assert.equal(fs.existsSync(getValue(result).output.path), true),
        );
    });
    it("must convert a file formatted based on extension", () => {
      return convert
        .files([input], path.join(dest, "{name}.avif"), createContext())
        .then(([result]) => {
          const info = getValue(result);
          assert.equal(info.output["format"], "heif");
          assert.ok(Object.prototype.hasOwnProperty.call(info.output, "path"));
          assert.ok(info.output.path.includes(".avif"));
        });
    });
    it("must not write a file during a dry run", () => {
      const dryDest = path.join(dest, "dry.jpg");
      const context = { ...createContext(), dry: true };
      return convert.files([input], dryDest, context).then(([result]) => {
        const info = getValue(result);
        assert.equal(info.output["format"], "jpeg");
        assert.ok(Object.prototype.hasOwnProperty.call(info.output, "size"));
        assert.equal(info.output.path, dryDest);
        assert.equal(fs.existsSync(dryDest), false);
      });
    });
    it("must return input and output metadata", () => {
      const output = path.join(dest, "output.jpg");
      const context = { ...createContext(), dry: true, print: true };
      return convert.files([input], output, context).then(([result]) => {
        const info = getValue(result);
        assert.equal(info.input["format"], "jpeg");
        assert.equal(info.input.path, input);
        assert.equal(info.output["format"], "jpeg");
        assert.equal(info.output.path, output);
      });
    });
    it("must return metadata for each file in a batch", () => {
      const context = { ...createContext(), dry: true, print: true };
      return convert.files([input, input], dest, context).then((info) => {
        assert.equal(info.length, 2);
        assert.equal(getValue(info[0]).input["format"], "jpeg");
        assert.equal(getValue(info[0]).output["format"], "jpeg");
      });
    });
    it("must pass the output extension format to queued handlers", () => {
      const context = createContext();
      let format;
      context.queue.push([
        "format",
        (sharp, context) => {
          format = context.format;
          return sharp;
        },
      ]);
      return convert
        .files([input], path.join(dest, "{name}.avif"), context)
        .then(() => assert.equal(format, "avif"));
    });
    it("must report a file conversion error", () => {
      // Negative test for directory that does not exist.
      const rand = "" + Math.random();
      return convert
        .files([input, input], rand, createContext())
        .then(([result]) => {
          assert.equal(result.status, "rejected");
          assert.ok(
            Object.prototype.hasOwnProperty.call(result.reason, "message"),
          );
          assert.ok(result.reason.message.includes(`${rand}/input.jpg`));
          assert.ok(
            result.reason.message.includes("No such file or directory"),
          );
        });
    });
    it("must convert multiple files", () => {
      return convert
        .files([input, input], dest, createContext())
        .then((info) => assert.equal(info.length, 2));
    });
    it("must support output templates", () => {
      const rand = Math.random();
      return convert
        .files([input], path.join(dest, `{name}-${rand}{ext}`), createContext())
        .then(([result]) =>
          assert.ok(getValue(result).output.path.includes(`input-${rand}.jpg`)),
        );
    });
    it("must allow the same file as input and output", () => {
      return convert.files([copy], path.dirname(copy), createContext());
    });
    it("must support tiled output", () => {
      const context = createContext();
      tile.handler({ "#queue": context.queue, container: "zip" });
      return convert.files([input], dest, context);
    });
    it("must warn if there is no files", () => {
      return assert.rejects(convert.files([]), { message: "No input files" });
    });
  });
  describe("stream", () => {
    // Default output.
    let dest;
    beforeEach(() => {
      dest = temporaryFile({ extension: "jpg" });
    });
    afterEach(() => fs.remove(dest));

    // Tests.
    it("must convert a file", () => {
      return convert
        .stream(
          fs.createReadStream(input),
          fs.createWriteStream(dest),
          createContext(),
        )
        .then((info) => {
          assert.ok(info.output.format != null);
          assert.equal(info.output.path, "stdout");
          assert.equal(fs.existsSync(dest), true);
        });
    });
    it("must reject stream errors", () => {
      return assert.rejects(
        convert.stream(
          Readable.from(["not an image"]),
          fs.createWriteStream(dest),
          createContext(),
        ),
        "unsupported image format",
      );
    });

    it("must reject output stream errors", () => {
      const error = new Error("output failed");
      const failingOutput = new Writable({
        write(_chunk, _encoding, callback) {
          callback(error);
        },
      });
      return assert.rejects(
        convert.stream(
          fs.createReadStream(input),
          failingOutput,
          createContext(),
        ),
        (err) => {
          assert.equal(err, error);
          return true;
        },
      );
    });
    it("must not write to the output stream during a dry run", () => {
      const failingOutput = new Writable({
        write(_chunk, _encoding, callback) {
          callback(new Error("should not write output"));
        },
      });
      return convert
        .stream(fs.createReadStream(input), failingOutput, {
          ...createContext(),
          dry: true,
        })
        .then((info) => {
          assert.equal(info.output["format"], "jpeg");
          assert.ok(Object.prototype.hasOwnProperty.call(info.output, "size"));
        });
    });
    it("must return input and output metadata", () => {
      const context = { ...createContext(), dry: true, print: true };
      return convert
        .stream(
          fs.createReadStream(input),
          new Writable({
            write(_chunk, _encoding, callback) {
              callback(new Error("should not write output"));
            },
          }),
          context,
        )
        .then((info) => {
          assert.equal(info.input["format"], "jpeg");
          assert.equal(info.output["format"], "jpeg");
        });
    });
  });
});
