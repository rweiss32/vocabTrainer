import type { WordList, VerbList, AppSettings, ListStats } from '../types';
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

// --- Stats ---

const STAT_HISTORY_MAX = 10;

function parseStatEntry(val: unknown): import('../types').ItemStat | undefined {
  if (typeof val !== 'object' || val === null) return undefined;
  const v = val as Record<string, unknown>;
  if (Array.isArray(v.history)) {
    return { history: v.history as boolean[], lastSeen: (v.lastSeen as number) ?? 0 };
  }
  // Migrate old format { correct, incorrect, lastSeen }
  if (typeof v.correct === 'number' && typeof v.incorrect === 'number') {
    const c = v.correct as number;
    const inc = v.incorrect as number;
    const total = Math.min(c + inc, STAT_HISTORY_MAX);
    const correctInWindow = Math.round((c / (c + inc)) * total);
    const history: boolean[] = [
      ...Array(correctInWindow).fill(true),
      ...Array(total - correctInWindow).fill(false),
    ];
    return { history, lastSeen: (v.lastSeen as number) ?? 0 };
  }
  return undefined;
}

export function getListStats(listId: string): ListStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS_PREFIX + listId);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const stats: ListStats = {};
    for (const [id, val] of Object.entries(parsed)) {
      const entry = parseStatEntry(val);
      if (entry) stats[id] = entry;
    }
    return stats;
  } catch {
    return {};
  }
}

export function saveListStats(listId: string, stats: ListStats): void {
  localStorage.setItem(STORAGE_KEYS.STATS_PREFIX + listId, JSON.stringify(stats));
}

export function recordAnswer(listId: string, itemId: string, correct: boolean): void {
  const stats = getListStats(listId);
  const existing = stats[itemId] ?? { history: [], lastSeen: 0 };
  stats[itemId] = {
    history: [...existing.history, correct].slice(-STAT_HISTORY_MAX),
    lastSeen: Date.now(),
  };
  saveListStats(listId, stats);
}

export function clearListStats(listId: string): void {
  localStorage.removeItem(STORAGE_KEYS.STATS_PREFIX + listId);
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
