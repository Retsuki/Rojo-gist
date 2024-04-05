const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertToWebPAndAvif(inputDir, outputDir) {
  const directories = fs.readdirSync(inputDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const directory of directories) {
    const subInputDir = path.join(inputDir, directory);
    const subOutputDir = path.join(outputDir, directory);

    if (!fs.existsSync(subOutputDir)) {
      fs.mkdirSync(subOutputDir, { recursive: true });
    }

    const files = fs.readdirSync(subInputDir);

    for (const file of files) {
      const extname = path.extname(file).toLowerCase();

      if (extname === '.svg' || extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif') {
        const inputPath = path.join(subInputDir, file);
        const outputPathPng = path.join(subOutputDir, `${path.basename(file, extname)}.png`);
        const outputPathWebP = path.join(subOutputDir, `${path.basename(file, extname)}.webp`);
        const outputPathAvif = path.join(subOutputDir, `${path.basename(file, extname)}.avif`);

        const inputStats = fs.statSync(inputPath);
        const inputSize = inputStats.size;

        try {
          await sharp(inputPath)
            .png({ quality: 80 })
            .toFile(outputPathPng);

          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPathWebP);

          await sharp(inputPath)
            .avif({ quality: 80 })
            .toFile(outputPathAvif);

          const outputStatsPng = fs.statSync(outputPathPng);
          const outputSizePng = outputStatsPng.size;
          const outputStatsWebP = fs.statSync(outputPathWebP);
          const outputSizeWebP = outputStatsWebP.size;
          const outputStatsAvif = fs.statSync(outputPathAvif);
          const outputSizeAvif = outputStatsAvif.size;

          console.log(`Converted ${file} (${inputSize} bytes) to PNG (${outputSizePng} bytes), WebP (${outputSizeWebP} bytes) and Avif (${outputSizeAvif} bytes)`)
          console.log()
          console.log()
        } catch (error) {
          console.error(`Error converting file ${inputPath}:`, error);
        }
      }
    }
  }
}

const INPUT_BASE_DIR = './utils/old/images';
const OUTPUT_BASE_DIR = './public/images';

convertToWebPAndAvif(INPUT_BASE_DIR, OUTPUT_BASE_DIR)
  .then(() => console.log('Conversion completed'))
  .catch((error) => console.error('Error:', error));