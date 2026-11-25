import { buildPrompt } from '../lib/prompt.js';
import type { ExtractedTestData } from '../lib/extract.js';

export function qs<T extends HTMLElement>(root: Document, id: string): T {
  const el = root.getElementById(id);
  if (!el) throw new Error(`element #${id} not found`);
  return el as T;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function showInitialState(root: Document): void {
  for (const id of ['theme', 'question', 'questionType']) {
    qs<HTMLElement>(root, id).textContent = 'Нажмите "Парсить страницу"';
    qs<HTMLElement>(root, id).classList.add('empty');
  }
  qs<HTMLElement>(root, 'answersList').innerHTML =
    '<li class="empty">Нажмите "Парсить страницу"</li>';
  qs<HTMLElement>(root, 'promptPreview').textContent = 'Нажмите "Парсить страницу"';
}

export function displayData(root: Document, data: ExtractedTestData): void {
  const themeEl = qs<HTMLElement>(root, 'theme');
  const questionEl = qs<HTMLElement>(root, 'question');
  const questionTypeEl = qs<HTMLElement>(root, 'questionType');
  const answersListEl = qs<HTMLElement>(root, 'answersList');
  const promptPreviewEl = qs<HTMLElement>(root, 'promptPreview');

  themeEl.textContent = data.theme || 'Не найдено';
  themeEl.classList.toggle('empty', !data.theme);

  questionEl.textContent = data.question || 'Не найдено';
  questionEl.classList.toggle('empty', !data.question);

  questionTypeEl.textContent = data.questionType || 'Не найдено';
  questionTypeEl.classList.toggle('empty', !data.questionType);

  if (data.answers.length > 0) {
    answersListEl.innerHTML = data.answers
      .map((answer, i) => `<li>${i + 1}. ${escapeHtml(answer)}</li>`)
      .join('');
  } else {
    answersListEl.innerHTML = '<li class="empty">Варианты ответов не найдены</li>';
  }

  promptPreviewEl.textContent = buildPrompt(data);
}

export function showSuccess(root: Document, message: string): void {
  const status = qs<HTMLElement>(root, 'status');
  status.textContent = message;
  status.className = 'status success';
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

export function showError(root: Document, message: string): void {
  const status = qs<HTMLElement>(root, 'status');
  status.textContent = message;
  status.className = 'status error';
  status.style.display = 'block';

  qs<HTMLElement>(root, 'theme').textContent = 'Ошибка';
  qs<HTMLElement>(root, 'question').textContent = 'Ошибка';
  qs<HTMLElement>(root, 'questionType').textContent = 'Ошибка';
  qs<HTMLElement>(root, 'answersList').innerHTML = '<li class="empty">Не удалось загрузить</li>';
  qs<HTMLElement>(root, 'promptPreview').textContent = 'Произошла ошибка при извлечении данных';
}
