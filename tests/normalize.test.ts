import { describe, expect, it } from 'vitest';
import { normalizeText } from '../src/lib/normalize';

describe('normalizeText', () => {
  it('collapses whitespace sequences and trims', () => {
    expect(normalizeText('  a\tb\nc ')).toBe('a b c');
  });

  it('returns empty string for empty/undefined', () => {
    expect(normalizeText('')).toBe('');
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
  });
});
