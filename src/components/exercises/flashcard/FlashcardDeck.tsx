import { useState, useEffect, useCallback } from 'react';
import type { Word } from '../../../types';
import { FlashcardCard } from './FlashcardCard';
import { Button } from '../../common/Button';
import { Link } from 'react-router-dom';
import { useListStats } from '../../../hooks/useListStats';
import { getStatColor } from '../../common/StatDot';
import { useLanguage } from '../../../lang/LanguageContext';

interface FlashcardDeckProps {
  words: Word[];
  listId: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardDeck({ words, listId }: FlashcardDeckProps) {
  const { t } = useLanguage();
  const { stats, recordAnswer, refresh } = useListStats(listId);
  const [weakOnly, setWeakOnly] = useState(false);
  const [showTranslationFirst, setShowTranslationFirst] = useState(false);

  const weakWords = words.filter((w) => {
    const color = getStatColor(stats[w.id]);
    return color === 'red' || color === 'yellow';
  });
  const hasWeakWords = weakWords.length > 0;
  const activeWords = weakOnly && hasWeakWords ? weakWords : words;

  const [deck, setDeck] = useState<Word[]>(() => shuffle(activeWords));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [done, setDone] = useState(false);

  const current = deck[index];

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setFlipped(false);
  }, []);

  const prev = useCallback(() => { if (index > 0) goTo(index - 1); }, [index, goTo]);
  const next = useCallback(() => { if (index < deck.length - 1) goTo(index + 1); }, [index, deck.length, goTo]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (done) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, done]);

  function rebuildDeck(pool: Word[]) {
    setDeck(shuffle(pool));
    setIndex(0);
    setFlipped(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setDone(false);
  }

  function handleToggleWeak() {
    const next = !weakOnly;
    setWeakOnly(next);
    refresh();
    rebuildDeck(next && hasWeakWords ? weakWords : words);
  }

  function handleShuffle() {
    rebuildDeck(weakOnly && hasWeakWords ? weakWords : words);
  }

  function handleRate(correct: boolean) {
    recordAnswer(current.id, correct);
    const newTotal = sessionTotal + 1;
    const newCorrect = sessionCorrect + (correct ? 1 : 0);
    setSessionTotal(newTotal);
    setSessionCorrect(newCorrect);
    if (index >= deck.length - 1) {
      setDone(true);
    } else {
      goTo(index + 1);
    }
  }

  if (done) {
    const percent = Math.round((sessionCorrect / sessionTotal) * 100);
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4 max-w-md mx-auto">
        <div className="text-5xl">{percent === 100 ? '🎉' : percent >= 70 ? '👍' : '📚'}</div>
        <h2 className="text-xl font-bold text-gray-900">{t('flashcard.done.title')}</h2>
        <p className="text-3xl font-bold text-indigo-600">{sessionCorrect} / {sessionTotal}</p>
        <p className="text-gray-500">{percent}{t('flashcard.done.known')}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={handleShuffle}>{t('flashcard.done.tryAgain')}</Button>
          <Link to={`/list/${listId}`}><Button variant="secondary">{t('flashcard.done.backToList')}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress + weak toggle */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((index + 1) / deck.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 shrink-0">{index + 1} / {deck.length}</span>
        {hasWeakWords && (
          <button
            onClick={handleToggleWeak}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
              weakOnly
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-white border-gray-300 text-gray-500 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {weakOnly ? t('flashcard.weakWords') : t('flashcard.allWords')}
          </button>
        )}
      </div>

      {/* Card */}
      <FlashcardCard
        key={index}
        word={current}
        flipped={flipped}
        showTranslationFirst={showTranslationFirst}
        onClick={() => setFlipped((f) => !f)}
      />

      {/* Thumbs (shown after flip) */}
      {flipped && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleRate(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
            title="I didn't know this"
          >
            {t('flashcard.stillLearning')}
          </button>
          <button
            onClick={() => handleRate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-green-200 text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
            title="I knew this"
          >
            {t('flashcard.gotIt')}
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={prev} disabled={index === 0}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('flashcard.prev')}
        </Button>
        <Button variant="ghost" onClick={handleShuffle} title="Shuffle">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('flashcard.shuffle')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => { setShowTranslationFirst((v) => !v); setFlipped(false); }}
          title="Flip direction"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {showTranslationFirst ? t('flashcard.translationToEnglish') : t('flashcard.englishToTranslation')}
        </Button>
        <Button variant="secondary" onClick={next} disabled={index === deck.length - 1}>
          {t('flashcard.next')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        {flipped ? t('flashcard.hintRate') : t('flashcard.hintFlip')}
      </p>
    </div>
  );
}
