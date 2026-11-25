import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const name = `nmo-helper-${pkg.version}.zip`;
const cwd = process.cwd();

for (const file of fs.readdirSync(cwd)) {
  if (file.startsWith('nmo-helper-') && file.endsWith('.zip') && file !== name) {
    fs.rmSync(path.join(cwd, file), { force: true });
  }
}
if (!fs.existsSync('dist')) throw new Error('dist/ is missing; run npm run build first');
const target = path.join(cwd, name);
if (fs.existsSync(target)) fs.rmSync(target);
execFileSync('zip', ['-r', '../' + name, '.'], { cwd: path.join(cwd, 'dist'), stdio: 'inherit' });
console.log(`created ${name}`);
