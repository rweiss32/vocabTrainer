import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { WordList, Word } from '../types';

export function useWordList(id: string) {
  const [list, setList] = useState<WordList | undefined>(() => storage.getWordList(id));

  const refresh = useCallback(() => {
    setList(storage.getWordList(id));
  }, [id]);

  const saveWords = useCallback((words: Word[]) => {
    const updated = storage.updateWordList(id, { words });
    setList(updated);
  }, [id]);

  const addWord = useCallback((term: string, translation: string) => {
    const current = storage.getWordList(id);
    if (!current) return;
    const word: Word = { id: crypto.randomUUID(), term, translation };
    const updated = storage.updateWordList(id, { words: [...current.words, word] });
    setList(updated);
  }, [id]);

  const updateWord = useCallback((wordId: string, field: 'term' | 'translation', value: string) => {
    const current = storage.getWordList(id);
    if (!current) return;
    const words = current.words.map((w) => (w.id === wordId ? { ...w, [field]: value } : w));
    const updated = storage.updateWordList(id, { words });
    setList(updated);
  }, [id]);

  const deleteWord = useCallback((wordId: string) => {
    const current = storage.getWordList(id);
    if (!current) return;
    const updated = storage.updateWordList(id, { words: current.words.filter((w) => w.id !== wordId) });
    setList(updated);
  }, [id]);

  const renameList = useCallback((name: string) => {
    const updated = storage.updateWordList(id, { name });
    setList(updated);
  }, [id]);

  return { list, refresh, saveWords, addWord, updateWord, deleteWord, renameList };
}
