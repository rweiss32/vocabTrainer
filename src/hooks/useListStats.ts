import { useState, useCallback } from 'react';
import type { ListStats } from '../types';
import { getListStats, recordAnswer as storageRecordAnswer } from '../services/storage';

export function useListStats(listId: string) {
  const [stats, setStats] = useState<ListStats>(() => getListStats(listId));

  const recordAnswer = useCallback(
    (itemId: string, correct: boolean) => {
      storageRecordAnswer(listId, itemId, correct);
      setStats(getListStats(listId));
    },
    [listId]
  );

  const refresh = useCallback(() => {
    setStats(getListStats(listId));
  }, [listId]);

  return { stats, recordAnswer, refresh };
}
