import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { MatchingBoard } from '../components/exercises/matching/MatchingBoard';
import { Button } from '../components/common/Button';

export function MatchingPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useWordList(id!);
  const [key, setKey] = useState(0); // remount board to restart
  const [result, setResult] = useState<{ mistakes: number } | null>(null);

  if (!list) return <div className="text-center py-16 text-gray-500">List not found.</div>;
  if (list.words.length < 2) return (
    <div className="text-center py-16 text-gray-500">
      <p>Need at least 2 words for matching.</p>
      <Link to={`/list/${id}/edit`}><Button className="mt-4">Add words</Button></Link>
    </div>
  );

  function handleComplete(mistakes: number) {
    setResult({ mistakes });
  }

  function handleRestart() {
    setResult(null);
    setKey((k) => k + 1);
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Matching — {list.name}</h1>
        <Link to={`/list/${id}`}>
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      {result ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4">
          <div className="text-5xl">{result.mistakes === 0 ? '🎉' : result.mistakes <= 3 ? '👍' : '📚'}</div>
          <h2 className="text-xl font-bold text-gray-900">
            {result.mistakes === 0 ? 'Perfect match!' : 'Round complete!'}
          </h2>
          <p className="text-gray-500">
            {result.mistakes === 0
              ? 'No mistakes — excellent work!'
              : `${result.mistakes} mistake${result.mistakes !== 1 ? 's' : ''}`}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={handleRestart}>Play again</Button>
            <Link to={`/list/${id}`}><Button variant="secondary">Back to list</Button></Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">Click a word on the left, then its translation on the right.</p>
          <MatchingBoard key={key} words={list.words} onComplete={handleComplete} />
        </>
      )}
    </div>
  );
}
