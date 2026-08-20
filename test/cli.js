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
import { fileURLToPath } from "node:url";

// Package modules.
import expect from "must";
import sinon from "sinon";

// Local modules.
import cli from "../lib/cli.js";
import sharp from "./mocks/sharp.js";
import { drain, getPipeline } from "./test-utils.js";

// Assets.
import pkg from "../package.json" with { type: "json" };

// Test suite.
describe(`${pkg.name} <options> [command..]`, () => {
  // Defaults (avoid path.join` to test for input normalizing).
  const input = fileURLToPath(new URL("./fixtures/input.jpg", import.meta.url));
  const output = fileURLToPath(new URL("./", import.meta.url));
  const ioFlags = ["-i", input, "-o", output];

  // Reset.
  afterEach("sharp", sharp.prototype.reset);

  describe("<options>", () => {
    describe("--adaptiveFiltering", () => {
      // Run.
      before(() => cli.parseAsync(["--adaptiveFiltering", ...ioFlags]));

      // Tests.
      it("must set the adaptiveFiltering flag", () => {
        expect(cli.parsed.argv).to.have.property("adaptiveFiltering", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("png");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.png, { adaptiveFiltering: true });
      });
    });

    describe("--alphaQuality", () => {
      // Default quality.
      const alphaQuality = 80;

      // Run.
      before(() =>
        cli.parseAsync(["--alphaQuality", alphaQuality, ...ioFlags]),
      );

      // Tests.
      it("must set the alphaQuality flag", () => {
        expect(cli.parsed.argv).to.have.property("alphaQuality", alphaQuality);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { alphaQuality });
      });
    });

    describe("--animated", () => {
      before(() =>
        cli.parseAsync(["--animated", "composite", input, ...ioFlags]),
      );

      it("must set the animated flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("animated", true);
      });
      it("must set the animated flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].animated", true),
        );
      });
    });

    describe("--autoOrient", () => {
      before(() =>
        cli.parseAsync(["--autoOrient", "composite", input, ...ioFlags]),
      );

      it("must set the autoOrient flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("autoOrient", true);
      });
      it("must set the autoOrient flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].autoOrient", true),
        );
      });
    });

    describe("--bigtiff", () => {
      // Run.
      before(() => cli.parseAsync(["--bigtiff", ...ioFlags]));

      // Tests.
      it("must set the bigtiff flag", () => {
        expect(cli.parsed.argv).to.have.property("bigtiff", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { bigtiff: true });
      });
    });

    describe("--bitdepth", () => {
      // Default bitdepth.
      const bitdepth = 4;

      // Run.
      before(() => cli.parseAsync(["--bitdepth", bitdepth, ...ioFlags]));

      // Tests.
      it("must set the bitdepth flag", () => {
        expect(cli.parsed.argv).to.have.property("bitdepth", bitdepth);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { bitdepth });
      });
    });

    describe("--chromaSubsampling", () => {
      // Default chromaSubsampling.
      const chromaSubsampling = "4:4:4";

      // Run.
      before(() =>
        cli.parseAsync(["--chromaSubsampling", chromaSubsampling, ...ioFlags]),
      );

      // Tests.
      it("must set the chromaSubsampling flag", () => {
        expect(cli.parsed.argv).to.have.property(
          "chromaSubsampling",
          chromaSubsampling,
        );
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(2);
        expect(pipeline).to.include("avif");
        expect(pipeline).to.include("jpeg");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.jpeg, { chromaSubsampling });
      });
    });
    ["colors", "colours"].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default colors.
        const colors = 128;

        // Run.
        before(() => cli.parseAsync([`--${alias}`, colors, ...ioFlags]));

        // Tests.
        it("must set the colors flag", () => {
          expect(cli.parsed.argv).to.have.property("colors", colors);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(2);
          expect(pipeline).to.include("gif");
          expect(pipeline).to.include("png");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.png, { colors });
        });
      });
    });

    describe("--compression", () => {
      // Default compression.
      const compression = "deflate";

      // Run.
      before(() => cli.parseAsync(["--compression", compression, ...ioFlags]));

      // Tests.
      it("must set the compression flag", () => {
        expect(cli.parsed.argv).to.have.property("compression", compression);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { compression });
      });
    });
    ["c", "compressionLevel"].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default level.
        const level = 6;

        // Run.
        before(() => cli.parseAsync([`--${alias}`, level, ...ioFlags]));

        // Tests.
        it("must set the compressionLevel flag", () => {
          expect(cli.parsed.argv).to.have.property("compressionLevel", level);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("png");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.png, {
            compressionLevel: level,
          });
        });
      });
    });

    describe("--delay", () => {
      // Default delay.
      const delay = 1;

      // Run.
      before(() => cli.parseAsync(["--delay", delay, ...ioFlags]));

      // Tests.
      it("must set the delay flag", () => {
        expect(cli.parsed.argv).to.have.property("delay", delay);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, { delay });
      });
    });

    describe("--density", () => {
      // Default density.
      const density = 300;

      // Run.
      before(() => cli.parseAsync(["--density", density, ...ioFlags]));

      // Tests.
      it("must set the density flag", () => {
        expect(cli.parsed.argv).to.have.property("density", density);
      });
    });

    describe("--dither", () => {
      // Default dither.
      const dither = 0.5;

      // Run.
      before(() => cli.parseAsync(["--dither", dither, ...ioFlags]));

      // Tests.
      it("must set the dither flag", () => {
        expect(cli.parsed.argv).to.have.property("dither", dither);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(2);
        expect(pipeline).to.include("gif");
        expect(pipeline).to.include("png");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, { dither, force: false });
        sinon.assert.calledWithMatch(pipeline.png, { dither, force: false });
      });
    });

    describe("--dry", () => {
      // Run.
      before(() => cli.parseAsync(["--dry", ...ioFlags]));

      // Tests.
      it("must set the dry flag", () => {
        expect(cli.parsed.argv).to.have.property("dry", true);
      });
    });

    describe("--effort", () => {
      // Default effort.
      const effort = 1;

      // Run.
      before(() => cli.parseAsync(["--effort", effort, ...ioFlags]));

      // Tests.
      it("must set the effort flag", () => {
        expect(cli.parsed.argv).to.have.property("effort", effort);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(5);
        expect(pipeline).to.include("avif");
        expect(pipeline).to.include("gif");
        expect(pipeline).to.include("heif");
        expect(pipeline).to.include("png");
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.avif, { effort });
      });
    });

    describe("--failOn", () => {
      // Default failOn.
      const failOn = "error";

      before(() =>
        cli.parseAsync(["--failOn", failOn, "composite", input, ...ioFlags]),
      );

      it("must set the failOn flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("failOn", failOn);
      });
      it("must set the failOn flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].failOn", failOn),
        );
      });
    });
    ["f", "format"].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default format.
        const format = "jpeg";

        // Run.
        before(() => cli.parseAsync([`--${alias}`, format, ...ioFlags]));

        // Tests.
        it("must set the format flag", () => {
          expect(cli.parsed.argv).to.have.property("format", format);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("format");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWith(pipeline.toFormat, format);
        });
      });
    });
    ["h", "help"].forEach((alias) => {
      describe(`--${alias}`, () => {
        it("must display help", async () => {
          const output = await cli
            .parseAsync([`--${alias}`])
            .catch((output) => output);
          expect(output).to.contain("Commands");
        });
      });
    });

    describe("--hbitdepth", () => {
      // Default bitdepth.
      const bitdepth = 8;

      // Run.
      before(() => cli.parseAsync(["--hbitdepth", bitdepth, ...ioFlags]));

      // Tests.
      it("must set the hbitdepth flag", () => {
        expect(cli.parsed.argv).to.have.property("hbitdepth", bitdepth);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("heif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.heif, { bitdepth });
      });
    });

    describe("--hcompression", () => {
      // Default compression.
      const compression = "hevc";

      // Run.
      before(() => cli.parseAsync(["--hcompression", compression, ...ioFlags]));

      // Tests.
      it("must set the compression flag", () => {
        expect(cli.parsed.argv).to.have.property("hcompression", compression);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("heif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.heif, { compression });
      });
    });
    ["i", "input"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() =>
          cli.parseAsync([`--${alias}`, input, input, "-o", output]),
        );

        // Tests.
        it("must set the input flag", () => {
          const args = cli.parsed.argv;
          expect(args).to.have.property("input");
          expect(args.input).to.eql([input, input]);
        });

        it("must fail when no input is given", async () => {
          const error = await cli
            .parseAsync([`--${alias}`, "-o", output])
            .then(() => {
              throw new Error("STOP");
            })
            .catch((error) => error);
          expect(error.message).to.contain("Not enough arguments");
        });
      });
    });

    describe("--ignoreIcc", () => {
      before(() =>
        cli.parseAsync(["--ignoreIcc", "composite", input, ...ioFlags]),
      );

      // Tests.
      it("must set the ignoreIcc flag", () => {
        expect(cli.parsed.argv).to.have.property("ignoreIcc", true);
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].ignoreIcc", true),
        );
      });
    });

    describe("--interFrameMaxError", () => {
      // Default max.
      const max = 16;

      // Run.
      before(() => cli.parseAsync(["--interFrameMaxError", max, ...ioFlags]));

      // Tests.
      it("must set the interFrameMaxError flag", () => {
        expect(cli.parsed.argv).to.have.property("interFrameMaxError", max);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, { interFrameMaxError: max });
      });
    });

    describe("--interPaletteMaxError", () => {
      // Default max.
      const max = 16;

      // Run.
      before(() => cli.parseAsync(["--interPaletteMaxError", max, ...ioFlags]));

      // Tests.
      it("must set the interPaletteMaxError flag", () => {
        expect(cli.parsed.argv).to.have.property("interPaletteMaxError", max);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, {
          interPaletteMaxError: max,
        });
      });
    });

    describe("--keepDuplicateFrames", () => {
      // Run.
      before(() => cli.parseAsync(["--keepDuplicateFrames", ...ioFlags]));

      // Tests.
      it("must set the keepDuplicateFrames flag", () => {
        expect(cli.parsed.argv).to.have.property("keepDuplicateFrames", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, {
          keepDuplicateFrames: true,
        });
      });
    });

    describe("--level", () => {
      // Default level.
      const level = 2;

      // Run.
      before(() => cli.parseAsync(["--level", level, ...ioFlags]));

      // Tests.
      it("must set the level flag", () => {
        expect(cli.parsed.argv).to.have.property("level", level);
      });
    });

    describe("--limitInputChannels", () => {
      // Default value.
      const value = 4;

      before(() =>
        cli.parseAsync([
          "--limitInputChannels",
          value,
          "composite",
          input,
          ...ioFlags,
        ]),
      );

      it("must set the limitInputChannels flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("limitInputChannels", value);
      });
      it("must set the limitInputChannels flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].limitInputChannels", value),
        );
      });
    });

    describe("--limitInputPixels", () => {
      // Default value.
      const value = 10;

      before(() =>
        cli.parseAsync([
          "--limitInputPixels",
          value,
          "composite",
          input,
          ...ioFlags,
        ]),
      );

      it("must set the limitInputPixels flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("limitInputPixels", value);
      });
      it("must set the limitInputPixels flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].limitInputPixels", value),
        );
      });
    });

    describe("--loop", () => {
      // Default dither.
      const loop = 2;

      // Run.
      before(() => cli.parseAsync(["--loop", loop, ...ioFlags]));

      // Tests.
      it("must set the loop flag", () => {
        expect(cli.parsed.argv).to.have.property("loop", loop);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("gif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.gif, { loop });
      });
    });

    describe("--lossless", () => {
      // Run.
      before(() => cli.parseAsync(["--lossless", ...ioFlags]));

      // Tests.
      it("must set the lossless flag", () => {
        expect(cli.parsed.argv).to.have.property("lossless", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(3);
        expect(pipeline).to.include("avif");
        expect(pipeline).to.include("heif");
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.heif, { lossless: true });
        sinon.assert.calledWithMatch(pipeline.webp, { lossless: true });
      });
    });

    describe("--miniswhite", () => {
      // Run.
      before(() => cli.parseAsync(["--miniswhite", ...ioFlags]));

      // Tests.
      it("must set the miniswhite flag", () => {
        expect(cli.parsed.argv).to.have.property("miniswhite", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { miniswhite: true });
      });
    });

    describe("--minSize", () => {
      // Run.
      before(() => cli.parseAsync(["--minSize", ...ioFlags]));

      // Tests.
      it("must set the minSize flag", () => {
        expect(cli.parsed.argv).to.have.property("minSize", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { minSize: true });
      });
    });

    describe("--mixed", () => {
      // Run.
      before(() => cli.parseAsync(["--mixed", ...ioFlags]));

      // Tests.
      it("must set the lossless flag", () => {
        expect(cli.parsed.argv).to.have.property("mixed", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { mixed: true });
      });
    });

    describe("--mozjpeg", () => {
      // Run.
      before(() => cli.parseAsync(["--mozjpeg", ...ioFlags]));

      // Tests.
      it("must set the mozjpeg flag", () => {
        expect(cli.parsed.argv).to.have.property("mozjpeg", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("jpeg");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.jpeg, { mozjpeg: true });
      });
    });

    describe("--nearLossless", () => {
      // Run.
      before(() => cli.parseAsync(["--nearLossless", ...ioFlags]));

      // Tests.
      it("must set the nearLossless flag", () => {
        expect(cli.parsed.argv).to.have.property("nearLossless", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { nearLossless: true });
      });
    });
    ["optimise", "optimize"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, ...ioFlags]));

        // Tests.
        it("must set the optimise flag", () => {
          expect(cli.parsed.argv).to.have.property("optimise", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("jpeg");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.jpeg, {
            optimiseScans: true,
            overshootDeringing: true,
            trellisQuantisation: true,
          });
        });
      });
    });
    ["optimiseCoding", "optimizeCoding"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--no-${alias}`, ...ioFlags]));

        // Tests.
        it("must set the optimiseScans flag", () => {
          expect(cli.parsed.argv).to.have.property("optimiseCoding", false);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("jpeg");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.jpeg, {
            optimiseCoding: false,
          });
        });
      });
    });
    ["optimiseScans", "optimizeScans"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run (implies --progressive).
        before(() => cli.parseAsync([`--${alias}`, "-p", ...ioFlags]));

        // Tests.
        it("must set the optimiseScans flag", () => {
          expect(cli.parsed.argv).to.have.property("optimiseScans", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(3);
          expect(pipeline).to.include("jpeg");
          expect(pipeline).to.include("gif"); // Because: -p.
          expect(pipeline).to.include("png"); // Because: -p.
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.jpeg, { optimiseScans: true });
        });
      });
    });
    ["o", "output"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, output, "-i", input]));

        // Tests.
        it("must set the output flag", () => {
          expect(cli.parsed.argv).to.have.property("output", output);
        });
      });
    });

    describe("--overshootDeringing", () => {
      // Run.
      before(() => cli.parseAsync(["--overshootDeringing", ...ioFlags]));

      // Tests.
      it("must set the overshootDeringing flag", () => {
        expect(cli.parsed.argv).to.have.property("overshootDeringing", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("jpeg");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.jpeg, {
          overshootDeringing: true,
        });
      });
    });

    describe("--page", () => {
      // Default page.
      const page = 2;

      // Run.
      before(() => cli.parseAsync(["--page", page, ...ioFlags]));

      // Tests.
      it("must set the page flag", () => {
        expect(cli.parsed.argv).to.have.property("page", page);
      });
    });

    describe("--pages", () => {
      // Default pages.
      const pages = 2;

      // Run.
      before(() => cli.parseAsync(["--pages", pages, ...ioFlags]));

      // Tests.
      it("must set the pages flag", () => {
        expect(cli.parsed.argv).to.have.property("pages", pages);
      });
    });

    describe("--palette", () => {
      // Run.
      before(() => cli.parseAsync(["--palette", ...ioFlags]));

      // Tests.
      it("must set the palette flag", () => {
        expect(cli.parsed.argv).to.have.property("palette", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("png");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.png, { palette: true });
      });
    });

    describe("--pdfBackground", () => {
      // Default value.
      const value = "rgb(255, 255, 255)";

      before(() =>
        cli.parseAsync([
          "--pdfBackground",
          value,
          "composite",
          input,
          ...ioFlags,
        ]),
      );

      it("must set the pdfBackground flag", () => {
        const args = cli.parsed.argv;
        expect(args).to.have.property("pdfBackground", value);
      });
      it("must set the pdfBackground flag when using composite", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(
          pipeline.composite,
          sinon.match.hasNested("[0].pdfBackground", value),
        );
      });
    });

    describe("--predictor", () => {
      // Default predictor.
      const predictor = "float";

      // Run.
      before(() => cli.parseAsync(["--predictor", predictor, ...ioFlags]));

      // Tests.
      it("must set the predictor flag", () => {
        expect(cli.parsed.argv).to.have.property("predictor", predictor);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { predictor });
      });
    });

    describe("--preset", () => {
      // Default preset.
      const preset = "text";

      // Run.
      before(() => cli.parseAsync(["--preset", preset, ...ioFlags]));

      // Tests.
      it("must set the preset flag", () => {
        expect(cli.parsed.argv).to.have.property("preset", preset);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { preset });
      });
    });

    describe("--print", () => {
      // Run.
      before(() => cli.parseAsync(["--print", "--dry", ...ioFlags]));

      // Tests.
      it("must set the print flag", () => {
        expect(cli.parsed.argv).to.have.property("print", true);
      });
    });

    describe("--pyramid", () => {
      // Run.
      before(() => cli.parseAsync(["--pyramid", ...ioFlags]));

      // Tests.
      it("must set the pyramid flag", () => {
        expect(cli.parsed.argv).to.have.property("pyramid", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { pyramid: true });
      });
    });
    ["p", "progressive"].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, ...ioFlags]));

        // Tests.
        it("must set the format flag", () => {
          expect(cli.parsed.argv).to.have.property("progressive", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(3);
          expect(pipeline).to.include("gif");
          expect(pipeline).to.include("jpeg");
          expect(pipeline).to.include("png");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.gif, { progressive: true });
          sinon.assert.calledWithMatch(pipeline.jpeg, { progressive: true });
          sinon.assert.calledWithMatch(pipeline.png, { progressive: true });
        });
      });
    });
    ["q", "quality"].forEach((alias) => {
      // Run.
      describe(`--${alias}`, () => {
        // Default quality.
        const quality = 80;

        // Run.
        before(() => cli.parseAsync([`--${alias}`, quality, ...ioFlags]));

        // Tests.
        it("must set the format flag", () => {
          expect(cli.parsed.argv).to.have.property("quality", quality);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(5);
          expect(pipeline).to.include("avif");
          expect(pipeline).to.include("heif");
          expect(pipeline).to.include("jpeg");
          expect(pipeline).to.include("tiff");
          expect(pipeline).to.include("webp");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.avif, {
            force: false,
            quality,
          });
          // sharp.avif === sharp.heif - so ensure flags are always passed correctly.
          sinon.assert.alwaysCalledWithMatch(pipeline.heif, {
            force: false,
            quality,
          });
          sinon.assert.calledWithMatch(pipeline.jpeg, {
            force: false,
            quality,
          });
          sinon.assert.calledWithMatch(pipeline.tiff, {
            force: false,
            quality,
          });
          sinon.assert.calledWithMatch(pipeline.webp, {
            force: false,
            quality,
          });
        });
      });
    });
    ["quantisationTable", "quantizationTable"].forEach((alias) => {
      // Default quantisation table.
      const table = 1;

      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, table, ...ioFlags]));

        // Tests.
        it("must set the quantisationTable flag", () => {
          expect(cli.parsed.argv).to.have.property("quantisationTable", table);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("jpeg");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.jpeg, {
            quantisationTable: table,
          });
        });
      });
    });
    ["reuse", "reoptimise", "reoptimize"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, `--${alias}`, ...ioFlags]));

        // Tests.
        it("must set the reoptimise flag", () => {
          expect(cli.parsed.argv).to.have.property("reuse", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("gif");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.calledWithMatch(pipeline.gif, { reuse: true });
        });
      });
    });

    describe("--resolutionUnit", () => {
      // Default unit.
      const unit = "cm";

      // Run.
      before(() => cli.parseAsync(["--resolutionUnit", unit, ...ioFlags]));

      // Tests.
      it("must set the resolutionUnit flag", () => {
        expect(cli.parsed.argv).to.have.property("resolutionUnit", unit);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { resolutionUnit: unit });
      });
    });

    describe("--smartDeblock", () => {
      // Run.
      before(() => cli.parseAsync(["--smartDeblock", ...ioFlags]));

      // Tests.
      it("must set the smartDeblock flag", () => {
        expect(cli.parsed.argv).to.have.property("smartDeblock", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { smartDeblock: true });
      });
    });

    describe("--smartSubsample", () => {
      // Run.
      before(() => cli.parseAsync(["--smartSubsample", ...ioFlags]));

      // Tests.
      it("must set the smartSubsample flag", () => {
        expect(cli.parsed.argv).to.have.property("smartSubsample", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("webp");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.webp, { smartSubsample: true });
      });
    });

    describe("--subifd", () => {
      // Default subifd.
      const subifd = 1;

      // Run.
      before(() => cli.parseAsync(["--subifd", subifd, ...ioFlags]));

      // Tests.
      it("must set the subifd flag", () => {
        expect(cli.parsed.argv).to.have.property("subifd", subifd);
      });
    });

    describe("--tileBackground", () => {
      // Default tileBackground.
      const tileBackground = "rgb(0, 0, 0)";

      // Run.
      before(() =>
        cli.parseAsync(["--tileBackground", tileBackground, ...ioFlags]),
      );

      // Tests.
      it("must set the tileBackground flag", () => {
        expect(cli.parsed.argv).to.have.property(
          "tileBackground",
          tileBackground,
        );
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, {
          background: tileBackground,
        });
      });
    });

    describe("--tileHeight", () => {
      // Default tileHeight.
      const tileHeight = 100;

      // Run.
      before(() => cli.parseAsync(["--tileHeight", tileHeight, ...ioFlags]));

      // Tests.
      it("must set the tileHeight flag", () => {
        expect(cli.parsed.argv).to.have.property("tileHeight", tileHeight);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, {
          tile: true,
          tileHeight,
          tileWidth: tileHeight,
        });
      });
    });

    describe("--tileWidth", () => {
      // Default tileHeight and tileWidth.
      const tileHeight = 100;
      const tileWidth = 50;

      // Run.
      before(() =>
        cli.parseAsync([
          "--tileHeight",
          tileHeight,
          "--tileWidth",
          tileWidth,
          ...ioFlags,
        ]),
      );

      // Tests.
      it("must set the tileWidth flag", () => {
        expect(cli.parsed.argv).to.have.property("tileWidth", tileWidth);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, {
          tile: true,
          tileHeight,
          tileWidth,
        });
      });
    });

    describe("--trellisQuantisation", () => {
      // Run.
      before(() => cli.parseAsync(["--trellisQuantisation", ...ioFlags]));

      // Tests.
      it("must set the trellisQuantisation flag", () => {
        expect(cli.parsed.argv).to.have.property("trellisQuantisation", true);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("jpeg");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.jpeg, {
          trellisQuantisation: true,
        });
      });
    });
    ["v", "version"].forEach((alias) => {
      describe(`--${alias}`, () => {
        it("must display the version number", async () => {
          const output = await cli
            .parseAsync([`--${alias}`])
            .catch((output) => output);
          expect(output).to.equal(pkg.version);
        });
      });
    });

    describe("--timeout", () => {
      // Default timeout.
      const timeout = 2;

      // Run.
      before(() => cli.parseAsync(["--timeout", timeout, ...ioFlags]));

      // Tests.
      it("must set the timeout flag", () => {
        expect(cli.parsed.argv).to.have.property("timeout", timeout);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("timeout");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.timeout, { seconds: timeout });
      });
    });

    describe("--tune", () => {
      // Default tune.
      const tune = "ssim";

      // Run.
      before(() => cli.parseAsync(["--tune", tune, ...ioFlags]));

      // Tests.
      it("must set the tune flag", () => {
        expect(cli.parsed.argv).to.have.property("tune", tune);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(2);
        expect(pipeline).to.include("avif");
        expect(pipeline).to.include("heif");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.avif, { tune });
        sinon.assert.calledWithMatch(pipeline.heif, { tune });
      });
    });

    describe("--unlimited", () => {
      // Run.
      before(() => cli.parseAsync(["--unlimited", ...ioFlags]));

      // Tests.
      it("must set the unlimited flag", () => {
        expect(cli.parsed.argv).to.have.property("unlimited", true);
      });
    });
    ["m", "metadata", "withMetadata"].forEach((alias) => {
      describe(`--${alias}`, () => {
        // Run.
        before(() => cli.parseAsync([`--${alias}`, ...ioFlags]));

        // Tests.
        it("must set the withMetadata flag", () => {
          expect(cli.parsed.argv).to.have.property("withMetadata", true);
        });
        it("must update the pipeline", () => {
          const pipeline = getPipeline(cli.parsed.argv);
          expect(pipeline).to.have.length(1);
          expect(pipeline).to.include("withMetadata");
        });
        it("must execute the pipeline", () => {
          const pipeline = drain(cli.parsed.argv);
          sinon.assert.called(pipeline.withMetadata);
        });
      });
    });

    describe("--xres", () => {
      // Default horizontal resolution.
      const xRes = 1.5;

      // Run.
      before(() => cli.parseAsync(["--xres", xRes, ...ioFlags]));

      // Tests.
      it("must set the xres flag", () => {
        expect(cli.parsed.argv).to.have.property("xres", xRes);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { xres: xRes });
      });
    });

    describe("--yres", () => {
      // Default vertical resolution.
      const yRes = 1.5;

      // Run.
      before(() => cli.parseAsync(["--yres", yRes, ...ioFlags]));

      // Tests.
      it("must set the yres flag", () => {
        expect(cli.parsed.argv).to.have.property("yres", yRes);
      });
      it("must update the pipeline", () => {
        const pipeline = getPipeline(cli.parsed.argv);
        expect(pipeline).to.have.length(1);
        expect(pipeline).to.include("tiff");
      });
      it("must execute the pipeline", () => {
        const pipeline = drain(cli.parsed.argv);
        sinon.assert.calledWithMatch(pipeline.tiff, { yres: yRes });
      });
    });
  });

  describe("[command]", () => {
    // Run.
    before(() => cli.parseAsync(["flip", ...ioFlags]));

    // Tests.
    it("must update the pipeline", () => {
      const pipeline = getPipeline(cli.parsed.argv);
      expect(pipeline).to.have.length(1);
      expect(pipeline).to.include("flip");
    });
    it("must execute the pipeline", () => {
      const pipeline = drain(cli.parsed.argv);
      sinon.assert.called(pipeline.flip);
    });

    it("must prepend global options once", async () => {
      await cli.parseAsync([
        ...ioFlags,
        "rotate",
        "90",
        "--",
        "resize",
        "100",
        "--format",
        "jpeg",
      ]);
      expect(getPipeline(cli.parsed.argv)).to.eql([
        "format",
        "rotate",
        "resize",
      ]);
    });

    it("must use the last repeated global option", async () => {
      const argv = await cli.parseAsync([
        ...ioFlags,
        "--format",
        "jpeg",
        "rotate",
        "90",
        "--",
        "resize",
        "100",
        "--format",
        "webp",
      ]);
      expect(argv.format).to.equal("webp");
      expect(getPipeline(argv)).to.eql(["format", "rotate", "resize"]);
    });

    it("must apply format-specific options only to the selected format", async () => {
      const argv = await cli.parseAsync(["--quality", 90, ...ioFlags]);
      const pipeline = drain(argv, {
        format: "jpeg",
        metadata: { format: "jpeg" },
      });
      sinon.assert.called(pipeline.jpeg);
      sinon.assert.notCalled(pipeline.avif);
      sinon.assert.notCalled(pipeline.gif);
      sinon.assert.notCalled(pipeline.heif);
      sinon.assert.notCalled(pipeline.png);
      sinon.assert.notCalled(pipeline.tiff);
      sinon.assert.notCalled(pipeline.webp);
    });
  });
});
