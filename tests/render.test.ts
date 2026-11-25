import { beforeEach, describe, expect, it } from 'vitest';
import { buildPrompt } from '../src/lib/prompt';
import { displayData, showError, showInitialState } from '../src/popup/render';
import type { ExtractedTestData } from '../src/lib/extract';

const full: ExtractedTestData = {
  theme: 'Тема',
  question: 'Вопрос?',
  questionType: 'Один ответ',
  answers: ['Первый', 'Второй'],
};

beforeEach(() => {
  document.body.innerHTML = `
    <div id="status" style="display: none"></div>
    <div id="theme"></div>
    <div id="question"></div>
    <div id="questionType"></div>
    <ul id="answersList"></ul>
    <div id="promptPreview"></div>
  `;
});

describe('popup rendering', () => {
  it('renders full data and prompt preview', () => {
    displayData(document, full);
    expect(document.getElementById('theme')?.textContent).toBe('Тема');
    expect(document.getElementById('question')?.textContent).toBe('Вопрос?');
    expect(document.getElementById('questionType')?.textContent).toBe('Один ответ');
    expect(document.querySelectorAll('#answersList li')).toHaveLength(2);
    expect(document.getElementById('answersList')?.textContent).toContain('1. Первый');
    expect(document.getElementById('promptPreview')?.textContent).toBe(buildPrompt(full));
    expect(document.getElementById('theme')?.classList.contains('empty')).toBe(false);
  });

  it('renders empty state for missing values', () => {
    displayData(document, { theme: null, question: null, questionType: null, answers: [] });
    expect(document.getElementById('theme')?.textContent).toBe('Не найдено');
    expect(document.getElementById('theme')?.classList.contains('empty')).toBe(true);
    expect(document.getElementById('answersList')?.textContent).toContain(
      'Варианты ответов не найдены',
    );
  });

  it('renders initial state', () => {
    showInitialState(document);
    expect(document.getElementById('theme')?.textContent).toBe('Нажмите "Парсить страницу"');
    expect(document.getElementById('theme')?.classList.contains('empty')).toBe(true);
  });

  it('renders error status', () => {
    showError(document, 'Ошибка: boom');
    expect(document.getElementById('status')?.className).toBe('status error');
    expect(document.getElementById('status')?.textContent).toBe('Ошибка: boom');
    expect(document.getElementById('theme')?.textContent).toBe('Ошибка');
    expect(document.getElementById('promptPreview')?.textContent).toBe(
      'Произошла ошибка при извлечении данных',
    );
  });
});
