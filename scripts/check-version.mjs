import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('src/manifest.json', 'utf8'));
if (pkg.version !== manifest.version) {
  console.error(`version mismatch: package.json=${pkg.version} manifest=${manifest.version}`);
  process.exit(1);
}
console.log(`version ok: ${pkg.version}`);
