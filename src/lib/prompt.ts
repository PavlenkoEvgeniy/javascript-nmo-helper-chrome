import type { ExtractedTestData } from './extract.js';

export function buildPrompt(data: ExtractedTestData): string {
  const answersText =
    data.answers.length > 0
      ? data.answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')
      : 'Варианты ответов не найдены';

  const typeText = data.questionType ? ` Тип вопроса: ${data.questionType}.` : '';

  return `Я решаю тест на тему ${data.theme || 'тема не найдена'}.${typeText} Вопрос такой: ${data.question || 'вопрос не найден'}. Варианты ответа:
${answersText}
Пожалуйста дай правильные ответ на это тест. Не надо давать объяснения, только ответ.`;
}
