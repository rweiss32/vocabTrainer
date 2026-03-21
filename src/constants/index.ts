export const STORAGE_KEYS = {
  WORD_LISTS: 'vt_word_lists',
  VERB_LISTS: 'vt_verb_lists',
  SETTINGS: 'vt_settings',
  STATS_PREFIX: 'vt_stats_',
} as const;

export const DEFAULT_SETTINGS = {
  nativeLanguage: 'Hebrew',
  matchingPairCount: 8,
  soundEnabled: true,
};

export const MAX_FILE_ROWS = 500;
export const MAX_MATCHING_PAIRS = 8;
