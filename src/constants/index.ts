export const STORAGE_KEYS = {
  WORD_LISTS: 'vt_word_lists',
  SETTINGS: 'vt_settings',
} as const;

export const DEFAULT_SETTINGS = {
  nativeLanguage: 'Hebrew',
  matchingPairCount: 8,
};

export const MAX_FILE_ROWS = 500;
export const MAX_MATCHING_PAIRS = 8;
