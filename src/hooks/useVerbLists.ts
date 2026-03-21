import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { VerbList } from '../types';

export function useVerbLists() {
  const sorted = (ls: VerbList[]) => [...ls].sort((a, b) => a.name.localeCompare(b.name));
  const [lists, setLists] = useState<VerbList[]>(() => sorted(storage.getVerbLists()));

  const createList = useCallback((name: string): VerbList => {
    const list = storage.createVerbList(name);
    setLists(sorted(storage.getVerbLists()));
    return list;
  }, []);

  const deleteList = useCallback((id: string) => {
    storage.deleteVerbList(id);
    setLists(sorted(storage.getVerbLists()));
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    storage.updateVerbList(id, { name });
    setLists(sorted(storage.getVerbLists()));
  }, []);

  return { lists, createList, deleteList, renameList };
}
