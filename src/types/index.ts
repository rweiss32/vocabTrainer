export interface Word {
  id: string;
  term: string;        // English word
  translation: string; // native language translation
}

export interface WordList {
  id: string;
  name: string;
  words: Word[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  nativeLanguage: string;
  matchingPairCount: number;
}

export interface Verb {
  id: string;
  v1: string;   // base form (e.g. go)
  v2: string;   // past simple (e.g. went)
  v3: string;   // past participle (e.g. gone)
  meaning?: string; // optional native-language gloss
}

export interface VerbList {
  id: string;
  name: string;
  verbs: Verb[];
  createdAt: number;
  updatedAt: number;
}

export interface ItemStat {
  correct: number;
  incorrect: number;
  lastSeen: number; // timestamp ms
}

export type ListStats = Record<string, ItemStat>; // keyed by word/verb id
