import fs from 'node:fs';

const packageJson: unknown = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = (packageJson as { version: string }).version;

console.log(`Current version: ${version}`);

const cargoTomlPath = './src-tauri/Cargo.toml';
let cargoToml: string = fs.readFileSync(cargoTomlPath, 'utf-8');

cargoToml = cargoToml.replace(
  /^version\s*=\s*".*?"$/m,
  `version = "${version}"`
);

console.log(`Updating Cargo.toml with version: ${version}`);

fs.writeFileSync(cargoTomlPath, cargoToml);
