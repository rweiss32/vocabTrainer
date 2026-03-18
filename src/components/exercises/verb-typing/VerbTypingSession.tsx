import { useState } from 'react';
import type { Verb } from '../../../types';
import { VerbTypingQuestion } from './VerbTypingQuestion';
import { Button } from '../../common/Button';
import { Link } from 'react-router-dom';
import { useListStats } from '../../../hooks/useListStats';
import { getStatColor } from '../../common/StatDot';
import { useLanguage } from '../../../lang/LanguageContext';

interface VerbTypingSessionProps {
  verbs: Verb[];
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

export function VerbTypingSession({ verbs, listId }: VerbTypingSessionProps) {
  const { t } = useLanguage();
  const { stats, recordAnswer, refresh } = useListStats(listId);
  const [weakOnly, setWeakOnly] = useState(false);

  const weakVerbs = verbs.filter((v) => {
    const color = getStatColor(stats[v.id]);
    return color === 'red' || color === 'yellow';
  });
  const hasWeakVerbs = weakVerbs.length > 0;

  const activeVerbs = weakOnly && hasWeakVerbs ? weakVerbs : verbs;

  const [deck, setDeck] = useState<Verb[]>(() => shuffle(activeVerbs));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  function handleAnswer(correct: boolean) {
    recordAnswer(deck[index].id, correct);
    if (correct) setScore((s) => s + 1);
    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function restart(useWeak?: boolean) {
    refresh();
    const pool = useWeak !== undefined
      ? (useWeak ? weakVerbs : verbs)
      : (weakOnly ? weakVerbs : verbs);
    setDeck(shuffle(pool));
    setIndex(0);
    setScore(0);
    setDone(false);
    setKey((k) => k + 1);
  }

  function handleToggleWeak() {
    const next = !weakOnly;
    setWeakOnly(next);
    restart(next);
  }

  const percent = Math.round((score / deck.length) * 100);

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4 max-w-md mx-auto">
        <div className="text-5xl">{percent === 100 ? '🎉' : percent >= 70 ? '👍' : '📚'}</div>
        <h2 className="text-xl font-bold text-gray-900">{t('typing.done.title')}</h2>
        <p className="text-3xl font-bold text-indigo-600">{score} / {deck.length}</p>
        <p className="text-gray-500">{percent}{t('typing.done.correct')}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={() => restart()}>{t('typing.done.tryAgain')}</Button>
          <Link to={`/verbs/${listId}`}><Button variant="secondary">{t('typing.done.backToList')}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(index / deck.length) * 100}%` }}
            />
          </div>
        </div>
        {hasWeakVerbs && (
          <button
            onClick={handleToggleWeak}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
              weakOnly
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-white border-gray-300 text-gray-500 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {weakOnly ? t('typing.weakVerbs') : t('typing.allVerbs')}
          </button>
        )}
      </div>
      <VerbTypingQuestion
        key={`${key}-${index}`}
        verb={deck[index]}
        questionNumber={index + 1}
        total={deck.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
