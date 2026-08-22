import sharp from "sharp";

/** Modal-forward 16:10 crop — tuned for 1024×539 source. */
const CROP = { left: 220, top: 55, width: 580, height: 362 };

const source = "public/demo/beat-01-record.png";
const output = "public/demo/beat-01-record-cropped.png";

const meta = await sharp(source).metadata();
console.log("source:", meta.width, "x", meta.height);

await sharp(source)
  .extract(CROP)
  .png({ compressionLevel: 9 })
  .toFile(output);

const out = await sharp(output).metadata();
console.log("cropped:", out.width, "x", out.height, "→", output);
