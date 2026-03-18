import type { Word, Verb } from '../types';
import { MAX_FILE_ROWS } from '../constants';

export interface ParseResult {
  words: Word[];
  warnings: string[];
}

export function parseWordFile(content: string): ParseResult {
  const lines = content.split(/\r?\n/);
  const words: Word[] = [];
  const warnings: string[] = [];

  // Detect delimiter: prefer tab, fallback to comma
  const hasTabs = lines.some((l) => l.includes('\t'));
  const delimiter = hasTabs ? '\t' : ',';

  let skippedHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    // Skip blank lines and comments
    if (!raw.trim() || raw.trim().startsWith('#')) continue;

    const cols = splitLine(raw, delimiter);

    // Auto-detect and skip header row (first non-blank line)
    if (!skippedHeader) {
      skippedHeader = true;
      const first = cols[0]?.toLowerCase().trim() ?? '';
      const second = cols[1]?.toLowerCase().trim() ?? '';
      const headerWords = ['term', 'word', 'english', 'translation', 'meaning', 'native'];
      if (headerWords.includes(first) || headerWords.includes(second)) continue;
    }

    if (cols.length < 2 || !cols[0].trim() || !cols[1].trim()) {
      warnings.push(`Line ${i + 1}: skipped — needs at least two columns.`);
      continue;
    }

    if (words.length >= MAX_FILE_ROWS) {
      warnings.push(`Stopped at ${MAX_FILE_ROWS} rows (file limit).`);
      break;
    }

    words.push({
      id: crypto.randomUUID(),
      term: cols[0].trim(),
      translation: cols[1].trim(),
    });
  }

  return { words, warnings };
}

export interface VerbParseResult {
  verbs: Verb[];
  warnings: string[];
}

export function parseVerbFile(content: string): VerbParseResult {
  const lines = content.split(/\r?\n/);
  const verbs: Verb[] = [];
  const warnings: string[] = [];

  const hasTabs = lines.some((l) => l.includes('\t'));
  const delimiter = hasTabs ? '\t' : ',';

  let skippedHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;

    const cols = splitLine(raw, delimiter);

    // Auto-detect and skip header row
    if (!skippedHeader) {
      skippedHeader = true;
      const first = cols[0]?.toLowerCase().trim() ?? '';
      const headerWords = ['v1', 'v2', 'v3', 'base', 'past', 'participle', 'verb', 'translation', 'meaning'];
      if (headerWords.includes(first)) continue;
    }

    if (cols.length < 3 || !cols[0].trim() || !cols[1].trim() || !cols[2].trim()) {
      warnings.push(`Line ${i + 1}: skipped — needs at least three columns (v1, v2, v3).`);
      continue;
    }

    if (verbs.length >= MAX_FILE_ROWS) {
      warnings.push(`Stopped at ${MAX_FILE_ROWS} rows (file limit).`);
      break;
    }

    verbs.push({
      id: crypto.randomUUID(),
      v1: cols[0].trim(),
      v2: cols[1].trim(),
      v3: cols[2].trim(),
      meaning: cols[3]?.trim() || undefined,
    });
  }

  return { verbs, warnings };
}

function splitLine(line: string, delimiter: string): string[] {
  if (delimiter === '\t') return line.split('\t');

  // CSV-aware split (handles quoted fields)
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
