import fs from 'fs';
import path from 'path';

const dir = path.resolve('./build/electron');

function renameJsToCjs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      renameJsToCjs(fullPath); // recurse into subfolders
    } else if (file.endsWith('.js')) {
      const cjsPath = fullPath.replace(/\.js$/, '.cjs');
      fs.renameSync(fullPath, cjsPath);
      console.log(`Renamed: ${fullPath} -> ${cjsPath}`);
    }
  }
}

renameJsToCjs(dir);
