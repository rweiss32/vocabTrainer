import type { WordList, VerbList } from '../types';

export type SharedWordList = {
  type: 'words';
  name: string;
  words: { term: string; translation: string }[];
};

export type SharedVerbList = {
  type: 'verbs';
  name: string;
  verbs: { v1: string; v2: string; v3: string; meaning?: string }[];
};

export type SharedList = SharedWordList | SharedVerbList;

function encode(str: string): string {
  return btoa(encodeURIComponent(str));
}

function decode(str: string): string {
  return decodeURIComponent(atob(str));
}

export function buildShareUrl(list: WordList, type: 'words'): string;
export function buildShareUrl(list: VerbList, type: 'verbs'): string;
export function buildShareUrl(list: WordList | VerbList, type: 'words' | 'verbs'): string {
  let payload: SharedList;
  if (type === 'words') {
    const wl = list as WordList;
    payload = {
      type: 'words',
      name: wl.name,
      words: wl.words.map(({ term, translation }) => ({ term, translation })),
    };
  } else {
    const vl = list as VerbList;
    payload = {
      type: 'verbs',
      name: vl.name,
      verbs: vl.verbs.map(({ v1, v2, v3, meaning }) =>
        meaning ? { v1, v2, v3, meaning } : { v1, v2, v3 }
      ),
    };
  }
  const encoded = encode(JSON.stringify(payload));
  return `${window.location.origin}/vocabTrainer/?import=${encoded}`;
}

export function decodeShareUrl(encoded: string): SharedList | null {
  try {
    const parsed = JSON.parse(decode(encoded)) as SharedList;
    if (parsed.type !== 'words' && parsed.type !== 'verbs') return null;
    return parsed;
  } catch {
    return null;
  }
}
