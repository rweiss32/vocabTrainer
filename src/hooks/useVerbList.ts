import { useState, useCallback } from 'react';
import * as storage from '../services/storage';
import type { VerbList, Verb } from '../types';

export function useVerbList(id: string) {
  const [list, setList] = useState<VerbList | undefined>(() => storage.getVerbList(id));

  const saveVerbs = useCallback((verbs: Verb[]) => {
    const updated = storage.updateVerbList(id, { verbs });
    setList(updated);
  }, [id]);

  const addVerb = useCallback((v1: string, v2: string, v3: string, meaning?: string) => {
    const current = storage.getVerbList(id);
    if (!current) return;
    const verb: Verb = { id: crypto.randomUUID(), v1, v2, v3, meaning };
    const updated = storage.updateVerbList(id, { verbs: [...current.verbs, verb] });
    setList(updated);
  }, [id]);

  const updateVerb = useCallback((verbId: string, field: keyof Omit<Verb, 'id'>, value: string) => {
    const current = storage.getVerbList(id);
    if (!current) return;
    const verbs = current.verbs.map((v) => (v.id === verbId ? { ...v, [field]: value } : v));
    const updated = storage.updateVerbList(id, { verbs });
    setList(updated);
  }, [id]);

  const deleteVerb = useCallback((verbId: string) => {
    const current = storage.getVerbList(id);
    if (!current) return;
    const updated = storage.updateVerbList(id, { verbs: current.verbs.filter((v) => v.id !== verbId) });
    setList(updated);
  }, [id]);

  const renameList = useCallback((name: string) => {
    const updated = storage.updateVerbList(id, { name });
    setList(updated);
  }, [id]);

  return { list, saveVerbs, addVerb, updateVerb, deleteVerb, renameList };
}
