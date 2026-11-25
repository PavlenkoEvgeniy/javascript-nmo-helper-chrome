# Glossary

- **NMO test (НМО тест)** — single question of an ongoing test on the NMO portal page.
- **Theme (Тема теста)** — quiz topic extracted from the page header.
- **Question (Вопрос)** — question text extracted from the page.
- **Question type (Тип вопроса)** — whether the question expects a single answer or multiple answers.
- **Answer variant / answer option (Вариант ответа)** — one of the option texts for the current question.
- **Extracted test data (Извлечённые данные)** — structured object with fields theme, question, questionType and answers.
- **Prompt (Промпт)** — the generated message that is copied to clipboard and sent to the AI assistant.
- **Content script** — script injected into the page that collects DOM data.
- **Injection (по клику)** — content script is injected when the user presses "Parse" instead of running on every page.
- **Release artifact (Релиз-архив)** — zip file built from `dist/` with manifest at its root.