import { buildPrompt } from '../lib/prompt.js';
import type { ExtractedTestData } from '../lib/extract.js';

function qs<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`element #${id} not found`);
  return el as T;
}

let extractedData: ExtractedTestData | null = null;

function showInitialState(): void {
  qs<HTMLElement>('theme').textContent = 'Нажмите "Парсить страницу"';
  qs<HTMLElement>('theme').classList.add('empty');
  qs<HTMLElement>('question').textContent = 'Нажмите "Парсить страницу"';
  qs<HTMLElement>('question').classList.add('empty');
  qs<HTMLElement>('questionType').textContent = 'Нажмите "Парсить страницу"';
  qs<HTMLElement>('questionType').classList.add('empty');
  qs<HTMLElement>('answersList').innerHTML = '<li class="empty">Нажмите "Парсить страницу"</li>';
  qs<HTMLElement>('promptPreview').textContent = 'Нажмите "Парсить страницу"';
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayData(data: ExtractedTestData): void {
  const themeEl = qs<HTMLElement>('theme');
  const questionEl = qs<HTMLElement>('question');
  const questionTypeEl = qs<HTMLElement>('questionType');
  const answersListEl = qs<HTMLElement>('answersList');
  const promptPreviewEl = qs<HTMLElement>('promptPreview');

  themeEl.textContent = data.theme || 'Не найдено';
  themeEl.classList.toggle('empty', !data.theme);

  questionEl.textContent = data.question || 'Не найдено';
  questionEl.classList.toggle('empty', !data.question);

  questionTypeEl.textContent = data.questionType || 'Не найдено';
  questionTypeEl.classList.toggle('empty', !data.questionType);

  if (data.answers && data.answers.length > 0) {
    answersListEl.innerHTML = data.answers
      .map((answer, i) => `<li>${i + 1}. ${escapeHtml(answer)}</li>`)
      .join('');
  } else {
    answersListEl.innerHTML = '<li class="empty">Варианты ответов не найдены</li>';
  }

  const prompt = buildPrompt(data);
  promptPreviewEl.textContent = prompt;
}

function showSuccess(message: string): void {
  const status = qs<HTMLElement>('status');
  status.textContent = message;
  status.className = 'status success';
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function showError(message: string): void {
  const status = qs<HTMLElement>('status');
  status.textContent = message;
  status.className = 'status error';
  status.style.display = 'block';

  qs<HTMLElement>('theme').textContent = 'Ошибка';
  qs<HTMLElement>('question').textContent = 'Ошибка';
  qs<HTMLElement>('questionType').textContent = 'Ошибка';
  qs<HTMLElement>('answersList').innerHTML = '<li class="empty">Не удалось загрузить</li>';
  qs<HTMLElement>('promptPreview').textContent = 'Произошла ошибка при извлечении данных';
}

async function extractFromActiveTab(): Promise<ExtractedTestData> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('active tab not found');

  let response: ExtractedTestData | undefined;
  try {
    response = await chrome.tabs.sendMessage(tab.id, { action: 'extractTestData' });
  } catch {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    response = await chrome.tabs.sendMessage(tab.id, { action: 'extractTestData' });
  }
  if (!response) throw new Error('no response from content script');
  return response;
}

async function parsePage(): Promise<void> {
  const parseBtn = qs<HTMLButtonElement>('parseBtn');
  const copyBtn = qs<HTMLButtonElement>('copyBtn');
  const status = qs<HTMLElement>('status');

  parseBtn.disabled = true;
  parseBtn.textContent = 'Парсинг...';
  status.style.display = 'none';

  try {
    const response = await extractFromActiveTab();
    extractedData = response;
    displayData(response);
    copyBtn.disabled = false;
  } catch (error) {
    console.error('НМО Помощник error:', error);
    showError('Ошибка: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    parseBtn.disabled = false;
    parseBtn.textContent = 'Парсить страницу';
  }
}

async function copyPrompt(): Promise<void> {
  if (!extractedData) return;
  const prompt = buildPrompt(extractedData);
  try {
    await navigator.clipboard.writeText(prompt);
    showSuccess('Промпт скопирован в буфер обмена!');
  } catch (error) {
    showError(
      'Не удалось скопировать: ' + (error instanceof Error ? error.message : String(error)),
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  qs<HTMLButtonElement>('parseBtn').addEventListener('click', () => {
    void parsePage();
  });
  qs<HTMLButtonElement>('copyBtn').addEventListener('click', () => {
    void copyPrompt();
  });
  showInitialState();
});
