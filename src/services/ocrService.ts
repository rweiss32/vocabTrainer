import { createWorker } from 'tesseract.js';

export type OcrProgressCallback = (progress: number) => void;

export async function extractWordsFromImage(
  file: File,
  onProgress?: OcrProgressCallback
): Promise<string[]> {
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);
    return parseOcrText(data.text);
  } finally {
    await worker.terminate();
  }
}

function parseOcrText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/[^a-zA-Z\s'-]/g, '').trim())
    .filter((line) => line.length >= 2)
    .filter((line) => /[a-zA-Z]/.test(line));
}

export interface OcrVerb {
  v1: string;
  v2: string;
  v3: string;
  meaning?: string; // present when detected from a Hebrew (RTL) table
}

export async function extractVerbsFromImage(
  file: File,
  onProgress?: OcrProgressCallback
): Promise<OcrVerb[]> {
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);
    return parseVerbOcrText(data.text);
  } finally {
    await worker.terminate();
  }
}

function parseVerbOcrText(raw: string): OcrVerb[] {
  return raw
    .split(/\r?\n/)
    .map(parseVerbLine)
    .filter((v): v is OcrVerb => v !== null);
}

const isHebrew = (s: string) => /[\u0590-\u05FF]/.test(s);

function parseVerbLine(line: string): OcrVerb | null {
  // Strip leading numbers/bullets (e.g. "1. go / went / gone")
  const cleaned = line.replace(/^\s*\d+[\.\)]\s*/, '').trim();
  if (!cleaned) return null;

  let parts: string[];

  if (/[\/|]/.test(cleaned)) {
    parts = cleaned.split(/[\/|]/);
  } else if (/\t/.test(cleaned)) {
    parts = cleaned.split(/\t/);
  } else if (/\s{2,}/.test(cleaned)) {
    parts = cleaned.split(/\s{2,}/);
  } else if (/\s[-–]\s/.test(cleaned)) {
    parts = cleaned.split(/\s[-–]\s/);
  } else {
    parts = cleaned.split(/\s+/);
  }

  // Separate Hebrew tokens (meaning) from English tokens (verb forms)
  const allTokens = parts.map((p) => p.trim()).filter((p) => p.length >= 2);
  if (allTokens.length === 0) return null;

  const hebrewIdx = allTokens.findIndex(isHebrew);
  let meaning: string | undefined;
  let englishTokens: string[];

  if (hebrewIdx !== -1) {
    meaning = allTokens[hebrewIdx];
    // Collect English-only tokens, stripping non-alpha chars
    englishTokens = allTokens
      .filter((_, i) => i !== hebrewIdx)
      .map((p) => p.replace(/[^a-zA-Z'/-]/g, '').trim())
      .filter((p) => p.length >= 2);
    // If Hebrew was first (leftmost), the table is RTL — English tokens are reversed
    if (hebrewIdx === 0) englishTokens = englishTokens.reverse();
  } else {
    englishTokens = allTokens
      .map((p) => p.replace(/[^a-zA-Z'/-]/g, '').trim())
      .filter((p) => p.length >= 2);
  }

  if (englishTokens.length === 0) return null;

  return {
    v1: englishTokens[0] ?? '',
    v2: englishTokens[1] ?? '',
    v3: englishTokens[2] ?? '',
    meaning,
  };
}
