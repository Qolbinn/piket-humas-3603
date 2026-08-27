import { describe, it, expect } from 'vitest';
import { parseWaMarkdown } from '@/lib/utils/wa-format';

describe('WA Markdown Parser', () => {
  it('parses bold text correctly', () => {
    const input = 'Hello *world*!';
    const output = parseWaMarkdown(input);
    expect(output).toBe('Hello <strong>world</strong>!');
  });

  it('parses italic text correctly', () => {
    const input = 'Hello _world_!';
    const output = parseWaMarkdown(input);
    expect(output).toBe('Hello <em>world</em>!');
  });

  it('parses strikethrough text correctly', () => {
    const input = 'Hello ~world~!';
    const output = parseWaMarkdown(input);
    expect(output).toBe('Hello <del>world</del>!');
  });

  it('parses multiple formats in one string', () => {
    const input = '*Bold* and _italic_ and ~strikethrough~';
    const output = parseWaMarkdown(input);
    expect(output).toBe('<strong>Bold</strong> and <em>italic</em> and <del>strikethrough</del>');
  });

  it('preserves line breaks', () => {
    const input = 'Line 1\nLine 2';
    const output = parseWaMarkdown(input);
    expect(output).toBe('Line 1<br />Line 2');
  });

  it('returns empty string if input is undefined', () => {
    // @ts-ignore
    expect(parseWaMarkdown(undefined)).toBe('');
  });
});
