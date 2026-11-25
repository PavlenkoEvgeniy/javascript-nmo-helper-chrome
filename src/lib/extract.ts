import { normalizeText } from './normalize.js';

export interface ExtractedTestData {
  theme: string | null;
  question: string | null;
  questionType: string | null;
  answers: string[];
}

export function extractTestData(document: Document): ExtractedTestData {
  const result: ExtractedTestData = {
    theme: null,
    question: null,
    questionType: null,
    answers: [],
  };

  const themeEl = document.querySelector('.mat-card-title-quiz-custom');
  if (themeEl) result.theme = normalizeText(themeEl.textContent);

  const questionEl = document.querySelector('div.question-title-text');
  if (questionEl) result.question = normalizeText(questionEl.textContent);

  const typeEl = document.querySelector('div.mat-card-question__type');
  if (typeEl) result.questionType = normalizeText(typeEl.textContent);

  const answerEls = document.querySelectorAll('span.question-inner-html-text');
  answerEls.forEach((el) => {
    const text = normalizeText(el.textContent);
    if (text) result.answers.push(text);
  });

  return result;
}
