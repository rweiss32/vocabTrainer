import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { MatchingBoard } from '../components/exercises/matching/MatchingBoard';
import { Button } from '../components/common/Button';
import { useLanguage } from '../lang/LanguageContext';

export function MatchingPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { list } = useWordList(id!);
  const [key, setKey] = useState(0); // remount board to restart
  const [result, setResult] = useState<{ mistakes: number } | null>(null);

  if (!list) return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  if (list.words.length < 2) return (
    <div className="text-center py-16 text-gray-500">
      <p>{t('matching.needMoreWords')}</p>
      <Link to={`/list/${id}/edit`}><Button className="mt-4">{t('listDetail.addWords')}</Button></Link>
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
        <h1 className="text-2xl font-bold text-gray-900">{t('matching.pageTitle', { name: list.name })}</h1>
        <Link to={`/list/${id}`}>
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>

      {result ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4">
          <div className="text-5xl">{result.mistakes === 0 ? '🎉' : result.mistakes <= 3 ? '👍' : '📚'}</div>
          <h2 className="text-xl font-bold text-gray-900">
            {result.mistakes === 0 ? t('matching.perfect') : t('matching.roundComplete')}
          </h2>
          <p className="text-gray-500">
            {result.mistakes === 0
              ? t('matching.noMistakesMsg')
              : result.mistakes === 1 ? t('matching.mistakeCount', { n: result.mistakes }) : t('matching.mistakeCount_plural', { n: result.mistakes })}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={handleRestart}>{t('matching.playAgain')}</Button>
            <Link to={`/list/${id}`}><Button variant="secondary">{t('matching.backToList')}</Button></Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">{t('matching.instruction')}</p>
          <MatchingBoard key={key} words={list.words} listId={id!} onComplete={handleComplete} />
        </>
      )}
    </div>
  );
}
