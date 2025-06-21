import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.resolve(__dirname, '../src/images');
const QUALITY = 80; // Adjust quality (1-100), lower = smaller file size
const WIDTH = 1200; // Max width in pixels

// Skip optimizing SVG files as they're already optimized
const SKIP_FILES = ['.svg'];

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const outputPath = filePath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  const isConversionNeeded = ext !== '.webp';
  const tempPath = `${outputPath}.tmp`;
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Only resize if image is wider than our target
    const shouldResize = metadata.width > WIDTH;
    
    // Create a pipeline
    let pipeline = image;
    
    if (shouldResize) {
      pipeline = pipeline.resize(WIDTH);
    }
    
    // Always convert to WebP with optimized settings
    pipeline = pipeline.webp({ 
      quality: QUALITY,
      alphaQuality: 80,
      lossless: false,
      nearLossless: true,
      smartSubsample: true,
      effort: 6  // Higher effort = better compression but slower
    });
    
    // Write to temp file first
    await pipeline.toFile(tempPath);
    
    // Get stats
    const originalStats = await fs.stat(filePath);
    const newStats = await fs.stat(tempPath);
    
    // Remove original if it's different from output
    if (isConversionNeeded) {
      await fs.unlink(filePath);
    }
    
    // Rename temp to final file
    await fs.rename(tempPath, outputPath);
    
    return { 
      success: true, 
      size: newStats.size,
      originalSize: originalStats.size,
      outputPath: outputPath
    };
    
  } catch (error) {
    // Clean up temp file if it exists
    try { await fs.unlink(tempPath); } catch (e) {}
    
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

async function getImageFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) && 
               !SKIP_FILES.includes(ext);
      })
      .map(file => path.join(dir, file));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

async function main() {
  try {
    console.log(`Looking for images in: ${IMAGES_DIR}`);
    const imageFiles = await getImageFiles(IMAGES_DIR);
    
    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      console.log('Supported formats: .jpg, .jpeg, .png, .webp, .gif');
      console.log('Skipping: .svg files');
      return;
    }

    console.log(`\nFound ${imageFiles.length} images to optimize...`);
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    
    for (const filePath of imageFiles) {
      try {
        const stats = await fs.stat(filePath);
        const originalSize = stats.size;
        totalOriginalSize += originalSize;
        
        console.log(`\nProcessing: ${path.basename(filePath)} (${(originalSize / 1024).toFixed(2)} KB)`);
        
        const result = await optimizeImage(filePath);
        
        if (result.success) {
          totalNewSize += result.size;
          const saved = originalSize - result.size;
          const savedPercent = ((saved / originalSize) * 100).toFixed(2);
          console.log(`✅ Optimized: ${(originalSize / 1024).toFixed(2)}KB → ${(result.size / 1024).toFixed(2)}KB (saved ${savedPercent}%)`);
        } else {
          console.error(`❌ Failed to optimize ${path.basename(filePath)}: ${result.error?.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
      }
    }
    
    if (totalOriginalSize > 0) {
      const totalSaved = totalOriginalSize - totalNewSize;
      const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(2);
      console.log('\n--- Optimization Summary ---');
      console.log(`Total original size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
      console.log(`Total new size: ${(totalNewSize / 1024).toFixed(2)} KB`);
      console.log(`Total saved: ${(totalSaved / 1024).toFixed(2)} KB (${totalSavedPercent}%)`);
    }
    
    console.log('\nOptimization complete! 🎉');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

main();
