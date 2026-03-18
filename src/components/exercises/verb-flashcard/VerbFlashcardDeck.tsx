import { useState, useEffect, useCallback } from 'react';
import type { Verb } from '../../../types';
import { VerbFlashcardCard } from './VerbFlashcardCard';
import { Button } from '../../common/Button';

interface VerbFlashcardDeckProps {
  verbs: Verb[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VerbFlashcardDeck({ verbs }: VerbFlashcardDeckProps) {
  const [deck, setDeck] = useState<Verb[]>(() => [...verbs]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = deck[index];

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setFlipped(false);
  }, []);

  const prev = useCallback(() => { if (index > 0) goTo(index - 1); }, [index, goTo]);
  const next = useCallback(() => { if (index < deck.length - 1) goTo(index + 1); }, [index, deck.length, goTo]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  function handleShuffle() {
    setDeck(shuffle(verbs));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((index + 1) / deck.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 shrink-0">{index + 1} / {deck.length}</span>
      </div>

      <VerbFlashcardCard
        verb={current}
        flipped={flipped}
        onClick={() => setFlipped((f) => !f)}
      />

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={prev} disabled={index === 0}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </Button>
        <Button variant="ghost" onClick={handleShuffle} title="Shuffle">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Shuffle
        </Button>
        <Button variant="secondary" onClick={next} disabled={index === deck.length - 1}>
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      <p className="text-xs text-gray-400">Use ← → arrow keys to navigate, Space to flip</p>
    </div>
  );
}
