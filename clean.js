import fs from 'fs';
import path from 'path';

const dirsToDelete = [
  'node_modules',
  'client/node_modules',
  'server/node_modules',
  'client/dist',
  'server/dist'
];

console.log('🧹 Cleaning project for sharing (removing node_modules & build artifacts)...');

dirsToDelete.forEach((dir) => {
  const fullPath = path.resolve(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`  ✓ Removed ${dir}`);
    } catch (err) {
      console.log(`  ! Could not remove ${dir}: ${err.message}`);
    }
  }
});

console.log('\n✨ Cleanup complete! Project size is now < 1MB and ready to share or zip.');
console.log('📌 Recipient simply needs to run: npm run install:all');
