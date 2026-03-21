import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { WordList } from '../types';

export function useWordLists() {
  const sorted = (ls: WordList[]) => [...ls].sort((a, b) => a.name.localeCompare(b.name));
  const [lists, setLists] = useState<WordList[]>(() => sorted(storage.getWordLists()));

  const refresh = useCallback(() => {
    setLists(sorted(storage.getWordLists()));
  }, []);

  const createList = useCallback((name: string): WordList => {
    const list = storage.createWordList(name);
    setLists(sorted(storage.getWordLists()));
    return list;
  }, []);

  const deleteList = useCallback((id: string) => {
    storage.deleteWordList(id);
    setLists(sorted(storage.getWordLists()));
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    storage.updateWordList(id, { name });
    setLists(sorted(storage.getWordLists()));
  }, []);

  const importLists = useCallback((newLists: WordList[]) => {
    const current = storage.getWordLists();
    storage.saveWordLists([...current, ...newLists]);
    setLists(sorted(storage.getWordLists()));
  }, []);

  return { lists, createList, deleteList, renameList, importLists, refresh };
}
