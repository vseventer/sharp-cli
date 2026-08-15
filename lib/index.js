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

// Local modules.
import cli from "./cli.js";
import convert from "./convert.js";
import { pick } from "./utils.js";

// Exports.
export default (args, options = {}) => {
  const logger = options.logger || console; // Cast.

  // Parse arguments and handle i/o.
  return cli
    .parse(args)
    .then((argv) => {
      const options = pick(argv, cli.inputOptions);
      if (argv.input) {
        return convert.files(argv.input, argv.output, options, argv.format);
      }
      return convert.stream(
        process.stdin,
        process.stdout,
        options,
        argv.format,
      );
    })
    .then((output) => {
      const info = Array.isArray(output) ? output : [output];
      info.forEach((file) => logger.log(file.path));
    })
    .catch((err) => {
      if (err instanceof Error) {
        logger.error(err.message);
        logger.error();
        logger.error("Specify --help for available options");
        process.exitCode = 1;
      } else {
        logger.log(err);
      }
    });
};
