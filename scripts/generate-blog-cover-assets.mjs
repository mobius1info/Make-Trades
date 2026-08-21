import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SRC_DIR = join(ROOT_DIR, 'src');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const groupsManifestPath = join(SRC_DIR, 'blog-article-groups.json');
const generatedManifestPath = join(SRC_DIR, 'generated-post-image-manifest.json');

const groupsManifest = JSON.parse(await readFile(groupsManifestPath, 'utf8'));
const imageSeeds = groupsManifest.coreOrder;

const manifestEntries = await Promise.all(
  imageSeeds.map(async seed => {
    const absolutePath = join(PUBLIC_DIR, 'assets', 'blog', `${seed}.webp`);
    const metadata = await sharp(absolutePath).metadata().catch(() => null);

    // Своя обложка есть не у каждой группы. Для остальных seo-build подставит
    // image_url из базы (см. postImageAttributes), поэтому просто пропускаем.
    if (!metadata?.width || !metadata?.height) {
      console.warn(`[blog-images] Нет обложки для "${seed}" — будет использован image_url из базы.`);
      return null;
    }

    return [
      seed,
      {
        src: `/assets/blog/${seed}.webp`,
        width: metadata.width,
        height: metadata.height,
      },
    ];
  })
);

const resolvedEntries = manifestEntries.filter(Boolean);

await writeFile(
  generatedManifestPath,
  `${JSON.stringify(Object.fromEntries(resolvedEntries), null, 2)}\n`,
  'utf8'
);

console.log(
  `[blog-images] Synced manifest for ${resolvedEntries.length} webp blog covers` +
  ` (пропущено без обложки: ${manifestEntries.length - resolvedEntries.length}).`
);
