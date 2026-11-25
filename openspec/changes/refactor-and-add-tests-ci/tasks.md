# Tasks

## 1. Setup

- [ ] 1.1 Create `package.json` with name, version `1.1.0`, scripts (`build`, `test`, `lint`, `format`, `package`, `typecheck`) and verify `npm ci` works on a clean checkout
- [ ] 1.2 Add `tsconfig.json`, ESLint flat config and Prettier config, and verify lint/format commands run without fatal errors
- [ ] 1.3 Scaffold `src/` structure with empty modules (`lib/normalize.ts`, `lib/extract.ts`, `lib/prompt.ts`, `content/index.ts`, `popup/index.ts`, `popup/index.html`) and verify expected tree is present
- [ ] 1.4 Add `.gitignore` (node_modules, dist, *.zip) and verify build outputs and archives are not tracked by git

## 2. Core pure logic (TypeScript, tested)

- [ ] 2.1 Move `normalizeText` to `src/lib/normalize.ts` and add Vitest unit tests covering newline/space/trim cases; run `npm test`
- [ ] 2.2 Move extraction into `src/lib/extract.ts` (`extractTestData(document)`) with unit tests using fixtures (real or synthetic HTML) for present and missing elements plus empty variants; run `npm test`
- [ ] 2.3 Move prompt builder into `src/lib/prompt.ts` with unit tests for full-data, missing-data and empty-answer cases; run `npm test`

## 3. Adapters and UI

- [ ] 3.1 Implement `src/content/index.ts` guarded listener and build-injected bundle; verify no duplicated responses in jsdom/manual smoke
- [ ] 3.2 Implement `src/popup/index.ts` UI wiring, Chrome adapters and jsdom tests for rendering states and `buildPrompt` preview; run `npm test`
- [ ] 3.3 Verify popup works with `dist/` loaded as unpacked extension on a sample NMO page (`parse` → `copy`)

## 4. Build, manifest and packaging

- [ ] 4.1 Update `manifest.json` to `1.1.0`, remove `content_scripts`, keep required permissions; verify it passes MV3 schema check (`web-ext lint` or manual review)
- [ ] 4.2 Add esbuild configuration/scripts producing `dist/content.js`, `dist/popup.js` plus copied static assets; verify `npm run build` succeeds
- [ ] 4.3 Add `npm run package` creating `nmo-helper-<version>.zip` from `dist/` root; verify archive contains `manifest.json` and both bundles, no `.git`/README
- [ ] 4.4 Add `check:version` (manifest and package.json align with tag) and verify it fails on mismatch

## 5. CI workflows

- [ ] 5.1 Add `.github/workflows/ci.yml` (lint/typecheck/test/build, concurrency cancel) and verify via `act` or dry push is syntactically valid
- [ ] 5.2 Add `.github/workflows/release.yml` triggered by `v*` tags, publishing `nmo-helper-<version>.zip` via `softprops/action-gh-release`; verify YAML validation
- [ ] 5.3 Document trigger usage (`git tag v1.1.0 && git push --tags`) in README

## 6. Documentation

- [ ] 6.1 Update README for new structure (load `dist/`, commands, CI, releases); verify all paths and commands exist
- [ ] 6.2 Create `GLOSSARY.md` with core domain terms; verify every term has a concise definition
- [ ] 6.3 Add 1–2 ADRs in `docs/adr/`; verify each states decision and alternatives
- [ ] 6.4 Integrate `CLAUDE.md` via /init and compare with OpenSpec markers using `openspec update --dry-run`; verify no marker blocks are lost

## 7. Integration verification

- [ ] 7.1 Run full local pipeline `npm ci && npm run lint && npm run typecheck && npm test && npm run build && npm run package`; all exit 0
- [ ] 7.2 Manual smoke: load unpacked `dist/`, parse a live NMO page and copy prompt; record result in task journal

## Workflow follow-up

- Archive the OpenSpec change after review requirements are satisfied.
- Update the task journal with smoking result and push.