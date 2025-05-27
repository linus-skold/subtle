import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Read version
const packageJson: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
const version = (packageJson as { version: string }).version;
const tag = `v${version}`;
const message = tag;

console.log(`🔖 Preparing commit and tag for ${tag}`);

// Run git commands
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
execSync(`git tag ${tag}`, { stdio: 'inherit' });

console.log('✅ Git commit and tag created.');
