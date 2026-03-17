import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { WordList } from '../types';

export function useWordLists() {
  const [lists, setLists] = useState<WordList[]>(() => storage.getWordLists());

  const refresh = useCallback(() => {
    setLists(storage.getWordLists());
  }, []);

  const createList = useCallback((name: string): WordList => {
    const list = storage.createWordList(name);
    setLists(storage.getWordLists());
    return list;
  }, []);

  const deleteList = useCallback((id: string) => {
    storage.deleteWordList(id);
    setLists(storage.getWordLists());
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    storage.updateWordList(id, { name });
    setLists(storage.getWordLists());
  }, []);

  return { lists, createList, deleteList, renameList, refresh };
}
