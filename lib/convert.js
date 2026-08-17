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
import { pipeline } from "node:stream/promises";

// Package modules.
import { globSync } from "glob";
import sharp from "sharp";

// Local modules.
import { drain, isDirectory } from "./utils.js";

// Configure.
const EXTENSIONS = {
  avif: ".avif",
  dz: "", // Determined by tile.container.
  gif: ".gif",
  heif: ".avif",
  jpeg: ".jpg",
  png: ".png",
  tiff: ".tiff",
  webp: ".webp",
};

// Exports.
export default {
  // Convert a list of files.
  files: async (input, output, context) => {
    // Resolve files.
    const files = input.flatMap((input) => globSync(input, { absolute: true }));
    if (files.length === 0) {
      return Promise.reject(new Error("No input files"));
    }

    // Process files.
    const isBatch = files.length > 1;
    const promises = files.map((src) => {
      const image = sharp(src, context.options);
      return image.metadata().then((metadata) => {
        const format = context.format ?? metadata.format;
        const transformer = drain(context.queue, image, {
          format,
          metadata,
        });

        // Process output as a template.
        const parts = path.parse(src);
        const regex = /\{(root|dir|base|ext|name)\}/g;
        let dest = output;
        let match;
        while ((match = regex.exec(output)) !== null) {
          const [search, prop] = match;
          dest = dest.replace(search, parts[prop]);
        }
        dest = path.resolve(dest);

        // If output was not a template, assume dest is a directory when using
        // batch processing.
        const outputAssumeDir = dest === path.resolve(output) && isBatch;
        if (outputAssumeDir || isDirectory(dest)) {
          const defaultExt = path.extname(src);
          dest = path.format({
            dir: dest,
            name: path.basename(src, defaultExt),
            ext: format in EXTENSIONS ? EXTENSIONS[format] : defaultExt,
          });
        }

        return transformer
          .toFile(dest)
          .then((info) => Object.assign(info, { src, path: dest }));
      });
    });
    return Promise.all(promises);
  },

  // Convert a stream.
  stream: async (inStream, outStream, context) => {
    const image = sharp(context.options);
    return pipeline(inStream, image)
      .then(() => image.metadata())
      .then((metadata) => {
        const transformer = drain(context.queue, image, {
          format: context.format ?? metadata.format,
          metadata,
        });

        // Gather return value.
        const info = {};
        transformer.on("info", (_info) => Object.assign(info, _info));

        return pipeline(transformer, outStream).then(() => info);
      });
  },
};
