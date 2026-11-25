# Proposal

## Why

Расширение собрано в трёх плоских файлах: логика извлечения и генерации промпта
жёстко завязана на DOM и API Chrome, поэтому не тестируется и не проверяется
автоматически. Упаковка и публикация релиза делаются вручную, и текущая релизная
артифакт-архив — это сырой снимок ветки (включая `.git`, `README`, скриншоты).
Версия манифеста (`1.0`) расходится с тегом `v1.0.0`. Переиспользовать код
в других местах невозможно.

## What Changes

- Вынос чистой логики (`normalizeText`, извлечение из documents, `buildPrompt`) в
  `src/lib/*` на TypeScript; `src/popup` и `src/content` становятся тонкими
  обёртками над ней.
- Сборка: esbuild → `dist/` (`dist/content.js`, `dist/popup.js`, копии
  `manifest.json`, `popup.html`, иконки). Скрипты `build`, `test`, `lint`,
  `format`, `package`.
- Инъекция content script по клику кнопки (без `content_scripts` на `<all_urls>`),
  что убирает дублирование message listener.
- Тесты: Vitest + jsdom для чистой логики и лёгких UI-проверок в popup.
- Инструменты качества: ESLint (flat) + Prettier.
- GitHub Actions: `ci.yml` (push/PR → lint/typecheck/test/build),
  `release.yml` (`push tag v*` → сборка + `nmo-helper-<version>.zip` + GitHub Release).
- Обновление `manifest.json` до `1.1.0`, README, `GLOSSARY.md`,
  1–2 ADR, `CLAUDE.md`.

## Capabilities

### New Capabilities

- `nmo-test-extraction`: извлечение структурированных данных теста НМО из открытой
  страницы (тема, вопрос, тип вопроса, варианты ответов) и формирование
  промпта для ИИ-помощника.

### Modified Capabilities

Отсутствуют: для ранее описанного поведения spec-слоя не было, всё новое
вводится новой capability.

## Impact

- `content.js`, `popup.js`, `popup.html`, `manifest.json` — перенос и реструктуризация.
- Новые зависимости devDependencies: `typescript`, `esbuild`, `vitest`, `jsdom`,
  `@types/chrome`, `eslint`, `prettier` (и связанные flat-конфиги).
- `README.md` обновляется под `dist/`; появляются `GLOSSARY.md`, `docs/adr/*`,
  `package.json`, `.gitignore`.
- Доставка: GitHub Release-артифакт чище и назван по версии.