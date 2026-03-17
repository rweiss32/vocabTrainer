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
