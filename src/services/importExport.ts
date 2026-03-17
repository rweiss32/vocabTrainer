import type { WordList } from '../types';

const FILE_VERSION = 1;

interface ExportFile {
  version: number;
  exportedAt: number;
  lists: Array<{ name: string; words: Array<{ term: string; translation: string }> }>;
}

// --- Export ---

export function exportLists(lists: WordList[]): void {
  const payload: ExportFile = {
    version: FILE_VERSION,
    exportedAt: Date.now(),
    lists: lists.map((l) => ({
      name: l.name,
      words: l.words.map((w) => ({ term: w.term, translation: w.translation })),
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocabtrainer-${timestamp()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Import ---

export interface ImportResult {
  imported: WordList[];
  skipped: string[]; // names of lists that were skipped (duplicate)
}

export function parseImportFile(content: string, existingNames: string[]): ImportResult {
  let parsed: ExportFile;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid file — could not parse JSON.');
  }

  if (!parsed.lists || !Array.isArray(parsed.lists)) {
    throw new Error('Invalid file — missing lists array.');
  }

  const existingSet = new Set(existingNames.map((n) => n.toLowerCase()));
  const imported: WordList[] = [];
  const skipped: string[] = [];

  for (const raw of parsed.lists) {
    if (!raw.name || !Array.isArray(raw.words)) continue;

    if (existingSet.has(raw.name.toLowerCase())) {
      skipped.push(raw.name);
      continue;
    }

    imported.push({
      id: crypto.randomUUID(),
      name: raw.name,
      words: raw.words
        .filter((w) => w.term && w.translation)
        .map((w) => ({ id: crypto.randomUUID(), term: w.term, translation: w.translation })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Track newly imported names to avoid duplicates within the same file
    existingSet.add(raw.name.toLowerCase());
  }

  return { imported, skipped };
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 10);
}
