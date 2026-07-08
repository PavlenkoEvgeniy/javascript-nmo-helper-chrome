// Content script for НМО Помощник
// Extracts test data from page and provides it to popup

function normalizeText(text) {
  // Collapse whitespace/newlines into single spaces
  return text.replace(/\s+/g, ' ').trim();
}

function extractTestData() {
  console.log('[НМО Помощник] Starting extraction...');

  const result = {
    theme: null,
    question: null,
    questionType: null,
    answers: []
  };

  // Extract theme (quiz topic from header) — use specific class to avoid question's mat-card-title
  const themeEl = document.querySelector('.mat-card-title-quiz-custom');
  console.log('[НМО Помощник] themeEl:', themeEl);
  if (themeEl) {
    result.theme = normalizeText(themeEl.textContent);
    console.log('[НМО Помощник] theme extracted:', result.theme);
  }

  // Extract question text
  const questionEl = document.querySelector('div.question-title-text');
  console.log('[НМО Помощник] questionEl:', questionEl);
  if (questionEl) {
    result.question = normalizeText(questionEl.textContent);
    console.log('[НМО Помощник] question extracted:', result.question);
  }

  // Extract question type (single/multiple answer)
  const typeEl = document.querySelector('div.mat-card-question__type');
  console.log('[НМО Помощник] typeEl:', typeEl);
  if (typeEl) {
    result.questionType = normalizeText(typeEl.textContent);
    console.log('[НМО Помощник] questionType extracted:', result.questionType);
  }

  // Extract all answer variants
  const answerEls = document.querySelectorAll('span.question-inner-html-text');
  console.log('[НМО Помощник] answerEls count:', answerEls.length);
  answerEls.forEach((el, i) => {
    const text = normalizeText(el.textContent);
    console.log(`[НМО Помощник] answer[${i}]:`, text);
    if (text) {
      result.answers.push(text);
    }
  });

  console.log('[НМО Помощник] Final result:', JSON.stringify(result, null, 2));
  return result;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractTestData') {
    const data = extractTestData();
    sendResponse(data);
  }
  return true;
});
