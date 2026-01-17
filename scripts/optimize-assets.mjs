import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function optimizeAssets() {
  console.log('Optimizing assets...\n');

  // 1. Create favicon from icon (32x32 for browsers)
  const iconPngPath = join(publicDir, 'artemiskit-icon.png');
  if (existsSync(iconPngPath)) {
    // Create 32x32 favicon PNG
    await sharp(iconPngPath)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon-32.png'));
    console.log('✓ Created favicon-32.png');

    // Create 180x180 for Apple touch icon
    await sharp(iconPngPath)
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    // Create 192x192 for Android
    await sharp(iconPngPath)
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'icon-192.png'));
    console.log('✓ Created icon-192.png');

    // Create 512x512 for PWA
    await sharp(iconPngPath)
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'icon-512.png'));
    console.log('✓ Created icon-512.png');
  }

  // 2. Create OG image (1200x630) with icon centered on brand background
  const ogWidth = 1200;
  const ogHeight = 630;
  const iconSize = 200;

  // Create a dark background with the icon
  await sharp(iconPngPath)
    .resize(iconSize, iconSize)
    .toBuffer()
    .then(async (iconBuffer) => {
      await sharp({
        create: {
          width: ogWidth,
          height: ogHeight,
          channels: 4,
          background: { r: 12, g: 10, b: 9, alpha: 1 } // #0c0a09
        }
      })
        .composite([
          {
            input: iconBuffer,
            top: Math.floor((ogHeight - iconSize) / 2) - 40,
            left: Math.floor((ogWidth - iconSize) / 2)
          }
        ])
        .png()
        .toFile(join(publicDir, 'og-image.png'));
      console.log('✓ Created og-image.png (1200x630)');
    });

  // 3. Create Twitter card image (same as OG but can be different)
  await sharp(join(publicDir, 'og-image.png'))
    .toFile(join(publicDir, 'twitter-image.png'));
  console.log('✓ Created twitter-image.png');

  console.log('\n✓ All assets optimized!');
}

optimizeAssets().catch(console.error);
