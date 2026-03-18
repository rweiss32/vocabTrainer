import { useState, useMemo } from 'react';
import type { Word } from '../../../types';
import { MAX_MATCHING_PAIRS } from '../../../constants';
import { recordAnswer } from '../../../services/storage';
import { useLanguage } from '../../../lang/LanguageContext';

interface MatchingBoardProps {
  words: Word[];
  listId: string;
  onComplete: (mistakes: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type ItemState = 'idle' | 'selected' | 'correct' | 'wrong';

export function MatchingBoard({ words, listId, onComplete }: MatchingBoardProps) {
  const { t } = useLanguage();
  const pairs = useMemo(() => {
    const subset = shuffle(words).slice(0, MAX_MATCHING_PAIRS);
    return subset;
  }, [words]);

  const terms = useMemo(() => shuffle(pairs.map((w) => w.id)), [pairs]);
  const translations = useMemo(() => shuffle(pairs.map((w) => w.id)), [pairs]);

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongTerm, setWrongTerm] = useState<string | null>(null);
  const [wrongTranslation, setWrongTranslation] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const wordMap = useMemo(() => new Map(pairs.map((w) => [w.id, w])), [pairs]);

  function getTermState(id: string): ItemState {
    if (matched.has(id)) return 'correct';
    if (wrongTerm === id) return 'wrong';
    if (selectedTerm === id) return 'selected';
    return 'idle';
  }

  function getTranslationState(id: string): ItemState {
    if (matched.has(id)) return 'correct';
    if (wrongTranslation === id) return 'wrong';
    if (selectedTranslation === id) return 'selected';
    return 'idle';
  }

  function handleSelectTerm(id: string) {
    if (matched.has(id)) return;
    setSelectedTerm(id);
    setWrongTerm(null);
    setWrongTranslation(null);
    if (selectedTranslation !== null) checkMatch(id, selectedTranslation);
  }

  function handleSelectTranslation(id: string) {
    if (matched.has(id)) return;
    setSelectedTranslation(id);
    setWrongTerm(null);
    setWrongTranslation(null);
    if (selectedTerm !== null) checkMatch(selectedTerm, id);
  }

  function checkMatch(termId: string, translationId: string) {
    if (termId === translationId) {
      // Correct!
      recordAnswer(listId, termId, true);
      const newMatched = new Set(matched);
      newMatched.add(termId);
      setMatched(newMatched);
      setSelectedTerm(null);
      setSelectedTranslation(null);
      if (newMatched.size === pairs.length) {
        setTimeout(() => onComplete(mistakes), 400);
      }
    } else {
      // Wrong — highlight only the two chosen items, one per column
      setMistakes((m) => m + 1);
      setWrongTerm(termId);
      setWrongTranslation(translationId);
      setTimeout(() => {
        setWrongTerm(null);
        setWrongTranslation(null);
        setSelectedTerm(null);
        setSelectedTranslation(null);
      }, 700);
    }
  }

  const stateClasses: Record<ItemState, string> = {
    idle: 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer',
    selected: 'bg-indigo-100 border-indigo-400 text-indigo-800 cursor-pointer ring-2 ring-indigo-300',
    correct: 'bg-green-50 border-green-300 text-green-800 cursor-default',
    wrong: 'bg-red-50 border-red-300 text-red-800 cursor-default animate-pulse',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{matched.size} / {pairs.length} {t('matching.matched')}</span>
        <span>{mistakes > 0 ? `${mistakes} ${mistakes !== 1 ? t('matching.mistakes') : t('matching.mistake')}` : t('matching.noMistakes')}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">{t('matching.english')}</p>
          {terms.map((id) => (
            <button
              key={id}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${stateClasses[getTermState(id)]}`}
              onClick={() => getTermState(id) === 'correct' ? null : handleSelectTerm(id)}
              disabled={matched.has(id)}
            >
              {wordMap.get(id)?.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">{t('matching.translation')}</p>
          {translations.map((id) => (
            <button
              key={id}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${stateClasses[getTranslationState(id)]}`}
              onClick={() => getTranslationState(id) === 'correct' ? null : handleSelectTranslation(id)}
              disabled={matched.has(id)}
            >
              {wordMap.get(id)?.translation}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
