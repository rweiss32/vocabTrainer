import { useState } from 'react';
import type { Word } from '../../../types';
import { TypingQuestion } from './TypingQuestion';
import { Button } from '../../common/Button';
import { Link } from 'react-router-dom';

interface TypingSessionProps {
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

export function TypingSession({ words, listId }: TypingSessionProps) {
  const [deck] = useState<Word[]>(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  function handleAnswer(correct: boolean) {
    if (correct) setScore((s) => s + 1);
    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const percent = Math.round((score / deck.length) * 100);

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4 max-w-md mx-auto">
        <div className="text-5xl">{percent === 100 ? '🎉' : percent >= 70 ? '👍' : '📚'}</div>
        <h2 className="text-xl font-bold text-gray-900">Session complete!</h2>
        <p className="text-3xl font-bold text-indigo-600">{score} / {deck.length}</p>
        <p className="text-gray-500">{percent}% correct</p>
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={() => { setIndex(0); setScore(0); setDone(false); setKey((k) => k + 1); }}>
            Try again
          </Button>
          <Link to={`/list/${listId}`}><Button variant="secondary">Back to list</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((index) / deck.length) * 100}%` }}
        />
      </div>
      <TypingQuestion
        key={`${key}-${index}`}
        word={deck[index]}
        questionNumber={index + 1}
        total={deck.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
