#!/usr/bin/env node

import { execSync } from 'child_process';
import { version } from '../package.json'; // adjust path if needed

try {
  // Create an annotated tag
  execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });

  // Push the tag
  execSync(`git push origin v${version}`, { stdio: 'inherit' });

  console.log(`✅ Successfully created and pushed tag v${version}`);
} catch (error: any) {
  console.error('❌ Failed to create or push tag:', error.message);
  process.exit(1);
}
