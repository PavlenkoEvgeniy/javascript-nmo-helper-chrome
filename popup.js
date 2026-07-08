// Popup script for НМО Помощник

let extractedData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const copyBtn = document.getElementById('copyBtn');
  const parseBtn = document.getElementById('parseBtn');
  const status = document.getElementById('status');

  // Set initial placeholder state
  showInitialState();

  parseBtn.addEventListener('click', async () => {
    console.log('[НМО Помощник] Parse button clicked');
    parseBtn.disabled = true;
    parseBtn.textContent = 'Парсинг...';
    status.style.display = 'none';

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('[НМО Помощник] Active tab:', tab.url);

      // Inject content script first
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      console.log('[НМО Помощник] Content script injected');

      // Now send message
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractTestData' });
      console.log('[НМО Помощник] Response from content script:', response);

      if (response) {
        extractedData = response;
        displayData(response);
        copyBtn.disabled = false;
      } else {
        console.error('[НМО Помощник] No response from content script');
        showError('Не удалось извлечь данные со страницы');
      }
    } catch (error) {
      console.error('[НМО Помощник] Error:', error);
      showError('Ошибка: ' + error.message);
    } finally {
      parseBtn.disabled = false;
      parseBtn.textContent = 'Парсить страницу';
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!extractedData) return;

    const prompt = buildPrompt(extractedData);

    try {
      await navigator.clipboard.writeText(prompt);
      showSuccess('Промпт скопирован в буфер обмена!');
    } catch (error) {
      showError('Не удалось скопировать: ' + error.message);
    }
  });
});

function displayData(data) {
  const themeEl = document.getElementById('theme');
  const questionEl = document.getElementById('question');
  const questionTypeEl = document.getElementById('questionType');
  const answersListEl = document.getElementById('answersList');
  const promptPreviewEl = document.getElementById('promptPreview');

  // Theme
  themeEl.textContent = data.theme || 'Не найдено';
  themeEl.classList.toggle('empty', !data.theme);

  // Question
  questionEl.textContent = data.question || 'Не найдено';
  questionEl.classList.toggle('empty', !data.question);

  // Question type
  questionTypeEl.textContent = data.questionType || 'Не найдено';
  questionTypeEl.classList.toggle('empty', !data.questionType);

  // Answers list
  if (data.answers && data.answers.length > 0) {
    answersListEl.innerHTML = data.answers
      .map((answer, i) => `<li>${i + 1}. ${escapeHtml(answer)}</li>`)
      .join('');
  } else {
    answersListEl.innerHTML = '<li class="empty">Варианты ответов не найдены</li>';
  }

  // Prompt preview
  const prompt = buildPrompt(data);
  promptPreviewEl.textContent = prompt;
}

function buildPrompt(data) {
  const answersText = data.answers && data.answers.length > 0
    ? data.answers.map((a, i) => `${i + 1}. ${a}`).join('\n')
    : 'Варианты ответов не найдены';

  const typeText = data.questionType ? ` Тип вопроса: ${data.questionType}.` : '';

  return `Я решаю тест на тему ${data.theme || 'тема не найдена'}.${typeText} Вопрос такой: ${data.question || 'вопрос не найден'}. Варианты ответа:
${answersText}
Пожалуйста дай правильные ответ на это тест. Не надо давать объяснения, только ответ.`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showInitialState() {
  document.getElementById('theme').textContent = 'Нажмите "Парсить страницу"';
  document.getElementById('theme').classList.add('empty');
  document.getElementById('question').textContent = 'Нажмите "Парсить страницу"';
  document.getElementById('question').classList.add('empty');
  document.getElementById('questionType').textContent = 'Нажмите "Парсить страницу"';
  document.getElementById('questionType').classList.add('empty');
  document.getElementById('answersList').innerHTML = '<li class="empty">Нажмите "Парсить страницу"</li>';
  document.getElementById('promptPreview').textContent = 'Нажмите "Парсить страницу"';
}

function showSuccess(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status success';
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function showError(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status error';
  status.style.display = 'block';

  document.getElementById('theme').textContent = 'Ошибка';
  document.getElementById('question').textContent = 'Ошибка';
  document.getElementById('questionType').textContent = 'Ошибка';
  document.getElementById('answersList').innerHTML = '<li class="empty">Не удалось загрузить</li>';
  document.getElementById('promptPreview').textContent = 'Произошла ошибка при извлечении данных';
}
