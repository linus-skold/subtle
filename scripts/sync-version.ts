import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const args = process.argv.slice(2);
console.log(args);

// look at input arguments in case of release
if (args.includes("--release")) {
  console.log("Release mode detected. Skipping version bump.");
  execSync("npm version patch --no-git-tag-version", {
    stdio: "inherit",
  });
  console.log("✅ Version bumped to patch.");
} else {
  execSync("npm version prerelease --preid=beta --no-git-tag-version", {
    stdio: "inherit",
  });
  console.log("✅ Version bumped to prerelease (beta).");
}

const packageJson: unknown = JSON.parse(readFileSync("package.json", "utf8"));
const version = (packageJson as { version: string }).version;

console.log(`Current version: ${version}`);

const cargoTomlPath = "./src-tauri/Cargo.toml";
let cargoToml = readFileSync(cargoTomlPath, "utf-8");

cargoToml = cargoToml.replace(
  /^version\s*=\s*".*?"$/m,
  `version = "${version}"`,
);

console.log(`Updating Cargo.toml with version: ${version}`);
writeFileSync(cargoTomlPath, cargoToml);

console.log("Waiting for file system operations to complete...");
setTimeout(() => {
  console.log("✅ Sync complete.");

  const tag = `v${version}`;
  const message = tag;

  console.log(`🔖 Preparing commit and tag for ${tag}`);

  execSync("git add .", { stdio: "inherit" });
  execSync(`git commit -m "${message}"`, { stdio: "inherit" });
  execSync(`git tag ${tag}`, { stdio: "inherit" });

  console.log("✅ Git commit and tag created.");
}, 2000);
