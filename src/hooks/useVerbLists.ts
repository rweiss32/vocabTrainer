import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { VerbList } from '../types';

export function useVerbLists() {
  const [lists, setLists] = useState<VerbList[]>(() => storage.getVerbLists());

  const createList = useCallback((name: string): VerbList => {
    const list = storage.createVerbList(name);
    setLists(storage.getVerbLists());
    return list;
  }, []);

  const deleteList = useCallback((id: string) => {
    storage.deleteVerbList(id);
    setLists(storage.getVerbLists());
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    storage.updateVerbList(id, { name });
    setLists(storage.getVerbLists());
  }, []);

  return { lists, createList, deleteList, renameList };
}
