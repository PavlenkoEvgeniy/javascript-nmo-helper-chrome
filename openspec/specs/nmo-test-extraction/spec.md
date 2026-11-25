# nmo-test-extraction Specification

## Purpose

Позволяет пользователю извлечь структурированные данные открытого теста НМО
(тема, вопрос, тип вопроса, варианты ответов) и сформировать готовый текст
промпта для отправки ИИ-помощнику.

## Requirements

### Requirement: Extract structured test data

The system MUST extract topic, question text, question type and answer variants from an opened NMO test page.

#### Scenario: All fields present

- **WHEN** the page contains elements matching the selectors for topic, question, type and answer variants
- **THEN** all extracted fields contain non-empty normalized text and every answer variant is included

#### Scenario: Missing elements

- **WHEN** some of the expected elements are absent on the page
- **THEN** extraction finishes without throwing and the missing fields are `null` or empty, while present fields retain their values

### Requirement: Normalize whitespace

The system MUST collapse any sequence of whitespace characters (spaces, tabs, newlines) to a single space and trim leading/trailing spaces in every extracted text field.

#### Scenario: Multiline source

- **WHEN** a field's source text contains newlines or repeated spaces
- **THEN** the normalized text contains single spaces only and has no leading or trailing spaces

### Requirement: Skip empty answer variants

The system MUST include an answer variant in the result only when its normalized text is non-empty.

#### Scenario: Empty variant present

- **WHEN** one of the answer elements contains only whitespace
- **THEN** that variant is not added to the answers list

### Requirement: Build prompt from extracted data

The system MUST generate a prompt that contains the topic, the question type when present, the question text and a numbered list of answer variants, using Russian fallback phrases when a field is missing.

#### Scenario: All data present

- **WHEN** extracted data contains topic, type, question and at least one answer
- **THEN** the prompt includes the topic line, the type phrase, the question and the numbered answer list, and ends with the instruction to answer without explanations

#### Scenario: Missing data

- **WHEN** topic, question, type or answers are missing or empty
- **THEN** the prompt contains the configured fallback phrases instead of the missing values and still keeps the numbered-answer-section format

### Requirement: Display extracted data in popup

The system MUST render extracted values in the popup UI, mark empty values as empty and show a preview of the generated prompt.

#### Scenario: Full data

- **WHEN** extraction returns non-empty fields
- **THEN** each section of the popup shows the corresponding value and the prompt preview matches the generated prompt

#### Scenario: Empty data

- **WHEN** extraction returns `null`/empty fields
- **THEN** the UI shows empty-state styling for missing values and does not render the copy-facing prompt as unavailable until parsing occurs
