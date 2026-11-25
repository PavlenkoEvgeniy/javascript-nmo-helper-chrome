import { buildPrompt } from '../lib/prompt.js';
import type { ExtractedTestData } from '../lib/extract.js';
import { displayData, qs, showError, showInitialState, showSuccess } from './render.js';

let extractedData: ExtractedTestData | null = null;

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
  const parseBtn = qs<HTMLButtonElement>(document, 'parseBtn');
  const copyBtn = qs<HTMLButtonElement>(document, 'copyBtn');
  const status = qs<HTMLElement>(document, 'status');

  parseBtn.disabled = true;
  parseBtn.textContent = 'Парсинг...';
  status.style.display = 'none';

  try {
    const response = await extractFromActiveTab();
    extractedData = response;
    displayData(document, response);
    copyBtn.disabled = false;
  } catch (error) {
    console.error('НМО Помощник error:', error);
    showError(document, 'Ошибка: ' + (error instanceof Error ? error.message : String(error)));
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
    showSuccess(document, 'Промпт скопирован в буфер обмена!');
  } catch (error) {
    showError(
      document,
      'Не удалось скопировать: ' + (error instanceof Error ? error.message : String(error)),
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  qs<HTMLButtonElement>(document, 'parseBtn').addEventListener('click', () => {
    void parsePage();
  });
  qs<HTMLButtonElement>(document, 'copyBtn').addEventListener('click', () => {
    void copyPrompt();
  });
  showInitialState(document);
});
