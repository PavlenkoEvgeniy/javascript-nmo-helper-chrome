# CLAUDE.md

## Проект

Chrome-расширение (Manifest V3): извлекает поля теста НМО со страницы и генерирует
промпт для ИИ-помощника. Исходники на TypeScript в `src/`, сборка `dist/` (esbuild).

## Команды

- `npm ci` — установка зависимостей.
- `npm run build` — собирает `dist/content.js`, `dist/popup.js`, копирует статику.
- `npm run test` — Vitest + jsdom.
- `npm run lint` / `npm run typecheck` / `npm run format`.
- `npm run package` — создаёт `nmo-helper-<version>.zip` из `dist/`.
- `npm run check:version` — сверка `package.json` и `src/manifest.json`.

## Структура

- `src/lib/*` — чистая логика (`normalizeText`, `extractTestData`, `buildPrompt`).
- `src/content/index.ts` — listener onMessage.
- `src/popup/index.ts` — UI wiring, Chrome API adapters.
- `src/manifest.json`, `src/popup/index.html`.

## Тест-конвенции

Тесты `tests/**/*.test.ts`; фикстуры HTML в `tests/fixtures/`. Новая логика
должна покрываться юнит-тестами на уровне `src/lib`.

## Релизы

Версии `package.json` и `src/manifest.json` синхронизированы; тег `v<version>`;
GitHub Actions собирает и публикует архив.

## OpenSpec

Планы изменений лежат в `openspec/`. Для вопроса «как устроено» читать код,
не спеки.