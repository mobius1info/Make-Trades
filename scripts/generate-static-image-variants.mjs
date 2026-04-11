import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const IMAGE_VARIANTS = [
  {
    source: 'assets/detail-solution.jpg',
    widths: [640, 960],
  },
  {
    source: 'assets/detail-bots.jpg',
    widths: [640, 960],
  },
  {
    source: 'assets/detail-portfolios.jpg',
    widths: [640, 960],
  },
];

for (const asset of IMAGE_VARIANTS) {
  const inputPath = join(PUBLIC_DIR, asset.source);
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  if (!originalWidth || !originalHeight) {
    throw new Error(`Unable to read dimensions for ${inputPath}`);
  }

  for (const width of asset.widths) {
    if (width >= originalWidth) continue;

    const height = Math.round((width / originalWidth) * originalHeight);
    const outputPath = join(PUBLIC_DIR, asset.source.replace(/\.jpg$/i, `-${width}.jpg`));

    await mkdir(dirname(outputPath), { recursive: true });
    await sharp(inputPath)
      .resize(width, height, { fit: 'cover' })
      .jpeg({
        quality: width <= 640 ? 80 : 82,
        progressive: true,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
      })
      .toFile(outputPath);

    console.log(`Generated ${outputPath}`);
  }
}
