import type { WordList, VerbList, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

// --- Word Lists ---

export function getWordLists(): WordList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORD_LISTS);
    return raw ? (JSON.parse(raw) as WordList[]) : [];
  } catch {
    return [];
  }
}

export function saveWordLists(lists: WordList[]): void {
  localStorage.setItem(STORAGE_KEYS.WORD_LISTS, JSON.stringify(lists));
}

export function getWordList(id: string): WordList | undefined {
  return getWordLists().find((l) => l.id === id);
}

export function createWordList(name: string): WordList {
  const list: WordList = {
    id: crypto.randomUUID(),
    name,
    words: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveWordLists([...getWordLists(), list]);
  return list;
}

export function updateWordList(id: string, data: Partial<Omit<WordList, 'id' | 'createdAt'>>): WordList | undefined {
  const lists = getWordLists();
  const index = lists.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  const updated = { ...lists[index], ...data, updatedAt: Date.now() };
  lists[index] = updated;
  saveWordLists(lists);
  return updated;
}

export function deleteWordList(id: string): void {
  saveWordLists(getWordLists().filter((l) => l.id !== id));
}

// --- Verb Lists ---

export function getVerbLists(): VerbList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VERB_LISTS);
    return raw ? (JSON.parse(raw) as VerbList[]) : [];
  } catch {
    return [];
  }
}

export function saveVerbLists(lists: VerbList[]): void {
  localStorage.setItem(STORAGE_KEYS.VERB_LISTS, JSON.stringify(lists));
}

export function getVerbList(id: string): VerbList | undefined {
  return getVerbLists().find((l) => l.id === id);
}

export function createVerbList(name: string): VerbList {
  const list: VerbList = {
    id: crypto.randomUUID(),
    name,
    verbs: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveVerbLists([...getVerbLists(), list]);
  return list;
}

export function updateVerbList(id: string, data: Partial<Omit<VerbList, 'id' | 'createdAt'>>): VerbList | undefined {
  const lists = getVerbLists();
  const index = lists.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  const updated = { ...lists[index], ...data, updatedAt: Date.now() };
  lists[index] = updated;
  saveVerbLists(lists);
  return updated;
}

export function deleteVerbList(id: string): void {
  saveVerbLists(getVerbLists().filter((l) => l.id !== id));
}

// --- Settings ---

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as AppSettings) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
