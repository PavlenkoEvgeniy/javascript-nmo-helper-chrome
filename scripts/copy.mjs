import fs from 'node:fs';

const dist = 'dist';
fs.mkdirSync(dist, { recursive: true });

const mappings = [
  { from: 'src/manifest.json', to: 'dist/manifest.json' },
  { from: 'src/popup/index.html', to: 'dist/popup.html' },
  { from: 'icon.png', to: 'dist/icon.png' },
];

for (const { from, to } of mappings) {
  if (!fs.existsSync(from)) {
    throw new Error(`Missing source file: ${from}`);
  }
  fs.copyFileSync(from, to);
  console.log(`copied ${from} -> ${to}`);
}
