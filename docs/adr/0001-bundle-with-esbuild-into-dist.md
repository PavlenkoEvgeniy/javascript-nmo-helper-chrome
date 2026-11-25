# Bundle source with esbuild into `dist/` instead of shipping raw files

We chose to keep the extension source as ES modules under `src/` and produce a
bundled `dist/` (content.js and popup.js plus copied static assets) for both
development and release. A single bundler run removes build/tooling drift and
lets us import the same TypeScript library functions directly from tests,
which would be impossible with flat classic MV3 scripts that cannot use `import`.

Considered options: (a) flat classic scripts with a `lib.js` loaded first, which
keeps a no-build workflow but makes TypeScript/testing awkward, and (b)
shipping source as-is with no tests — rejected because it keeps the status quo
that caused this change.
