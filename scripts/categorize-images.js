/**
 * Categorize stay images into subfolders based on filename patterns.
 * Images are COPIED (not moved) so existing flat references still work.
 * Run: node scripts/categorize-images.js
 */
const fs = require('fs');
const path = require('path');

const STAYS_DIR = path.join(__dirname, '..', 'public', 'stays');

// Filename → category mapping rules (checked in order, first match wins)
const RULES = [
  { pattern: /living\s*room|living/i, category: 'living' },
  { pattern: /kitchen|kitchenette/i, category: 'kitchen' },
  { pattern: /bed\s*r?o?om|bedroom/i, category: 'bedroom' },
  { pattern: /bath\s*room|bathroom|shower|bathtub/i, category: 'bathroom' },
  { pattern: /pool|swim/i, category: 'amenities' },
  { pattern: /main\s*view|exterior|front|entrance|garden|balcony|patio/i, category: 'exterior' },
  // "Others" and anything unmatched → exterior
  { pattern: /others?/i, category: 'exterior' },
];

const CATEGORY_DIRS = ['exterior', 'living', 'bedroom', 'bathroom', 'kitchen', 'amenities'];

function categorizeFile(filename) {
  for (const rule of RULES) {
    if (rule.pattern.test(filename)) {
      return rule.category;
    }
  }
  return 'exterior'; // default fallback
}

function processStay(slug) {
  const stayDir = path.join(STAYS_DIR, slug);
  if (!fs.existsSync(stayDir)) {
    console.log(`  ⚠ Skipping ${slug}: directory not found`);
    return;
  }

  // Create category subdirectories
  for (const cat of CATEGORY_DIRS) {
    const catDir = path.join(stayDir, cat);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir, { recursive: true });
    }
  }

  // Read root-level image files
  const files = fs.readdirSync(stayDir);
  const imageFiles = files.filter(f => {
    const fullPath = path.join(stayDir, f);
    return fs.statSync(fullPath).isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(f);
  });

  console.log(`\n📂 ${slug}: ${imageFiles.length} images found`);

  for (const file of imageFiles) {
    const category = categorizeFile(file);
    const src = path.join(stayDir, file);
    const dest = path.join(stayDir, category, file);

    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ ${file} → ${category}/`);
    } else {
      console.log(`  ⏭ ${file} → ${category}/ (already exists)`);
    }
  }
}

// Run
console.log('🔄 Categorizing stay images...\n');

const slugs = fs.readdirSync(STAYS_DIR).filter(f => {
  return fs.statSync(path.join(STAYS_DIR, f)).isDirectory() && !CATEGORY_DIRS.includes(f);
});

for (const slug of slugs) {
  processStay(slug);
}

console.log('\n✅ Done! Images have been COPIED into category subfolders.');
console.log('   Original files remain in place for backward compatibility.');
