import type { WordList, VerbList } from '../types';

const FILE_VERSION = 2;

// Legacy (v1) had only `lists`. v2 adds `verbLists`.
interface ExportFile {
  version: number;
  exportedAt: number;
  lists?: Array<{ name: string; words: Array<{ term: string; translation: string }> }>;
  verbLists?: Array<{ name: string; verbs: Array<{ v1: string; v2: string; v3: string; meaning?: string }> }>;
}

// --- Unified Export (all data) ---

export function exportAll(wordLists: WordList[], verbLists: VerbList[]): void {
  const payload: ExportFile = {
    version: FILE_VERSION,
    exportedAt: Date.now(),
    lists: wordLists.map((l) => ({
      name: l.name,
      words: l.words.map((w) => ({ term: w.term, translation: w.translation })),
    })),
    verbLists: verbLists.map((l) => ({
      name: l.name,
      verbs: l.verbs.map((v) => ({ v1: v.v1, v2: v.v2, v3: v.v3, ...(v.meaning ? { meaning: v.meaning } : {}) })),
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

// --- Single-list export (used on the list detail page) ---

export function exportLists(lists: WordList[]): void {
  exportAll(lists, []);
}

// --- Unified Import ---

export interface ImportAllResult {
  wordLists: WordList[];
  verbLists: VerbList[];
  skippedWords: string[];
  skippedVerbs: string[];
}

export function parseImportAll(
  content: string,
  existingWordNames: string[],
  existingVerbNames: string[],
): ImportAllResult {
  let parsed: ExportFile;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid file — could not parse JSON.');
  }

  if (!parsed.lists && !parsed.verbLists) {
    throw new Error('Invalid file — no word lists or verb lists found.');
  }

  const wordNameSet = new Set(existingWordNames.map((n) => n.toLowerCase()));
  const verbNameSet = new Set(existingVerbNames.map((n) => n.toLowerCase()));
  const wordLists: WordList[] = [];
  const verbLists: VerbList[] = [];
  const skippedWords: string[] = [];
  const skippedVerbs: string[] = [];

  for (const raw of parsed.lists ?? []) {
    if (!raw.name || !Array.isArray(raw.words)) continue;
    if (wordNameSet.has(raw.name.toLowerCase())) { skippedWords.push(raw.name); continue; }
    wordLists.push({
      id: crypto.randomUUID(),
      name: raw.name,
      words: raw.words
        .filter((w) => w.term && w.translation)
        .map((w) => ({ id: crypto.randomUUID(), term: w.term, translation: w.translation })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    wordNameSet.add(raw.name.toLowerCase());
  }

  for (const raw of parsed.verbLists ?? []) {
    if (!raw.name || !Array.isArray(raw.verbs)) continue;
    if (verbNameSet.has(raw.name.toLowerCase())) { skippedVerbs.push(raw.name); continue; }
    verbLists.push({
      id: crypto.randomUUID(),
      name: raw.name,
      verbs: raw.verbs
        .filter((v) => v.v1 && v.v2 && v.v3)
        .map((v) => ({ id: crypto.randomUUID(), v1: v.v1, v2: v.v2, v3: v.v3, meaning: v.meaning })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    verbNameSet.add(raw.name.toLowerCase());
  }

  return { wordLists, verbLists, skippedWords, skippedVerbs };
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 10);
}
