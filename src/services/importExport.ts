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

export interface RenameInfo { original: string; renamed: string; }

export interface ImportAllResult {
  wordLists: WordList[];
  verbLists: VerbList[];
  renamedWords: RenameInfo[];
  renamedVerbs: RenameInfo[];
}

function uniqueName(name: string, existingSet: Set<string>): string {
  if (!existingSet.has(name.toLowerCase())) return name;
  let i = 2;
  while (existingSet.has(`${name} (${i})`.toLowerCase())) i++;
  return `${name} (${i})`;
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
  const renamedWords: RenameInfo[] = [];
  const renamedVerbs: RenameInfo[] = [];

  for (const raw of parsed.lists ?? []) {
    if (!raw.name || !Array.isArray(raw.words)) continue;
    const name = uniqueName(raw.name, wordNameSet);
    if (name !== raw.name) renamedWords.push({ original: raw.name, renamed: name });
    wordLists.push({
      id: crypto.randomUUID(),
      name,
      words: raw.words
        .filter((w) => w.term && w.translation)
        .map((w) => ({ id: crypto.randomUUID(), term: w.term, translation: w.translation })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    wordNameSet.add(name.toLowerCase());
  }

  for (const raw of parsed.verbLists ?? []) {
    if (!raw.name || !Array.isArray(raw.verbs)) continue;
    const name = uniqueName(raw.name, verbNameSet);
    if (name !== raw.name) renamedVerbs.push({ original: raw.name, renamed: name });
    verbLists.push({
      id: crypto.randomUUID(),
      name,
      verbs: raw.verbs
        .filter((v) => v.v1 && v.v2 && v.v3)
        .map((v) => ({ id: crypto.randomUUID(), v1: v.v1, v2: v.v2, v3: v.v3, meaning: v.meaning })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    verbNameSet.add(name.toLowerCase());
  }

  return { wordLists, verbLists, renamedWords, renamedVerbs };
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 10);
}
