# Design

## Context

Текущее расширение состоит из трёх плоских файлов; логика извлечения и
генерации промпта зависит от глобальных `document` и Chrome API, поэтому
не тестируется. Релизный артефакт сейчас — сырой архив ветки с `.git`, а
версия манифеста (`1.0`) не совпадает с тегом (`v1.0.0`).

Мотивация и scope — см. `proposal.md`.

## Goals / Non-Goals

**Goals:**

- Разделить чистую логику и Chrome/UI-обвязку.
- Ввести автотесты и воспроизводимую сборку `dist/`.
- Получать чистый релизный артефакт через GitHub Actions.

**Non-Goals:**

- Публикация в Chrome Web Store.
- Полный rewrite UI каркаса и стилизации popup.
- Изменение текста промпта или набора селекторов.

## Decisions

### D1. Язык реализации: TypeScript

Выбираем TypeScript поверх чистого JS+JSDoc.

- Альтернативы: JS+JSDoc (меньше конфигурации), TS (типобезопасность).
- Почему TS: сборка всё равно вводится, `@types/chrome` ловит опечатки в API,
  typed ExtractedTestData убирает имплицитные границы. Плата — `tsconfig` и
  devDependency.

### D2. Архитектура: `src/` + esbuild → `dist/`

```
src/
├── lib/        // чистая логика (normalize, extraction, prompt)
├── content/    // message listener + вызов extract
├── popup/      // DOM-обвязка и chrome-вызовы
├── manifest.json
├── popup.html
└── assets/
tests/          // vitest
dist/           // сборочный выход (загрузка распакованного отсюда)
```

- Content script не может быть ESM в MV3; bundling решает это и даёт чистые
  артефакты.
- Альтернатива: плоские classic-скрипты + `lib.js` раньше — сохраняет модель без
  сборки, но тестирование import'ами становится хаком.

### D3. Инъекция content script по кнопке

Убираем `content_scripts` из манифеста; popup сначала пробует `tabs.sendMessage`,
при отсутствии ресивера — `scripting.executeScript` и повторяет сообщение.

- Устраняет двойной listener.
- Убирает постоянное исполнение на `<all_urls>` → лучше приватность.
- `activeTab` даёт `executeScript` после клика по иконке расширения.

### D4. Тесты: Vitest + jsdom, фикстуры из реального HTML

Для extraction фикстуры — снимок фрагмента страницы НМО с нужными классами.
Если пользователь не предоставит — синтетический HTML по селекторам (тест
тогда проверяет поведение на нашем ассете, что лучше чем ничего).
E2E Playwright откладывается: дорого и флаки; ручной smoke после сборки.

### D5. CI

- `ci.yml`: push/pull_request в `master` → setup-node 22 + `npm ci` → `lint`
  (`tsc --noEmit`, eslint) → `test` (vitest run) → `build` → `package` dry
  (zip) без публикации.
- `release.yml`: `push tag v*` → те же шаги → сборка →
  `softprops/action-gh-release` с артефактом `nmo-helper-<version>.zip`.
- Concurrency cancel-in-progress на PR.

### D6. Версионирование

Источники: `package.json` и `manifest.json` — ручная согласованность; тег
должен быть `v<manifest.version>`; CI блокирует рассинхрон (script `check:version`).
Следующий релиз: `1.1.0` → тег `v1.1.0`.

### D7. Член TP-состава и репозитория

`GLOSSARY.md`, 1–2 ADR под `docs/adr/`, `CLAUDE.md` (через /init), обновлённый
README. Внедрение OpenSpec (`openspec/`, project-scope skills) для управления
изменениями.

## Risks / Trade-offs

- Изменение injection model может повлиять на пользователей, opening pages
  до установки расширения — но они всё равно жмут кнопку «Парсить», поэтому
  деградации нет.
- Фикстуры могут устареть при изменении сайта НМО — тесты тогда не спасут
  от регрессии в реальности; mitigation: smoke-проверка на живой странице перед
  релизом.
- TypeScript и eslint добавляют tooling — mitigated `.gitignore` и `package-lock`.

## Migration Plan

1. Слить branch в master.
2. Создать архив `nmo-helper-1.1.0.zip` и релиз `v1.1.0`; старый `v1.0.0`
   не трогать.
3. Очистку релизного `…-master.zip` оставляем (история); новые артифакты будут
   иметь правильное имя.

## Open Questions

Нет: все вопросы получили ответ в сессии grilling (язык, runner, scope
инъекции, артефакт и триггер, retention `clipboardWrite`-permissions проверяем
на smoke).
