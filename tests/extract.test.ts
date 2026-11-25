import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { extractTestData } from '../src/lib/extract';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  new DOMParser().parseFromString(
    readFileSync(join(__dirname, 'fixtures', name), 'utf8'),
    'text/html',
  );

describe('extractTestData', () => {
  it('extracts all fields when present', () => {
    const doc = fixture('full.html');
    const data = extractTestData(doc);
    expect(data.theme).toBe('Тема');
    expect(data.question).toBe('Вопрос?');
    expect(data.questionType).toBe('Один ответ');
    expect(data.answers).toEqual(['Первый', 'Второй']);
  });

  it('returns null/empty fields for missing elements', () => {
    const doc = fixture('empty.html');
    const data = extractTestData(doc);
    expect(data.theme).toBeNull();
    expect(data.question).toBeNull();
    expect(data.questionType).toBeNull();
    expect(data.answers).toEqual([]);
  });

  it('skips empty answer variants', () => {
    const doc = fixture('with-empty-answer.html');
    const data = extractTestData(doc);
    expect(data.answers).toEqual(['Only']);
  });
});
