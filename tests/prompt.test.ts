import { describe, expect, it } from 'vitest';
import { buildPrompt } from '../src/lib/prompt';
import type { ExtractedTestData } from '../src/lib/extract';

const full: ExtractedTestData = {
  theme: 'Тема',
  question: 'Вопрос?',
  questionType: 'Один ответ',
  answers: ['Первый', 'Второй'],
};

describe('buildPrompt', () => {
  it('includes all fields when present', () => {
    const prompt = buildPrompt(full);
    expect(prompt).toContain(
      'Я решаю тест на тему Тема. Тип вопроса: Один ответ. Вопрос такой: Вопрос?',
    );
    expect(prompt).toContain('1. Первый\n2. Второй');
    expect(prompt).toContain('Не надо давать объяснения, только ответ.');
  });

  it('uses fallbacks when data missing', () => {
    const prompt = buildPrompt({ theme: null, question: null, questionType: null, answers: [] });
    expect(prompt).toContain('Я решаю тест на тему тема не найдена.');
    expect(prompt).toContain('Вопрос такой: вопрос не найден.');
    expect(prompt).toContain('Варианты ответов не найдены');
  });

  it('omits type phrase when missing', () => {
    const prompt = buildPrompt({ ...full, questionType: null });
    expect(prompt).not.toContain('Тип вопроса:');
  });
});
