import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { useListStats } from '../hooks/useListStats';
import { useLanguage } from '../lang/LanguageContext';
import { WordTable } from '../components/wordlist/WordTable';
import { Button } from '../components/common/Button';
import { statCounts } from '../components/common/StatDot';
import type { ListStats } from '../types';

const DEFAULT_THRESHOLD = 80;

function scorePercent(wordId: string, stats: ListStats): number {
  const stat = stats[wordId];
  if (!stat) return 0;
  const { correct, total } = statCounts(stat);
  if (total < 3) return 0;
  return Math.round((correct / total) * 100);
}

export function WordListTablePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { list } = useWordList(id!);
  const { stats } = useListStats(id!);
  const [showAll, setShowAll] = useState(false);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  if (!list) {
    return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  }

  const filtered = showAll
    ? list.words
    : list.words.filter((w) => scorePercent(w.id, stats) <= threshold);

  const isFiltered = !showAll;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('page.wordList.title', { name: list.name })}
        </h1>
        <Link to={`/list/${id}`}>
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 font-medium">{t('wordList.filterLabel')}</span>

        {/* All words */}
        <button
          onClick={() => setShowAll(true)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            showAll
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('wordList.filter.all')}
        </button>

        {/* Editable threshold pill */}
        <button
          onClick={() => setShowAll(false)}
          className={`flex items-center gap-0.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isFiltered
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>≤</span>
          <input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onClick={(e) => { e.stopPropagation(); setShowAll(false); }}
            onChange={(e) => {
              const v = Math.min(100, Math.max(0, Number(e.target.value)));
              setThreshold(v);
              setShowAll(false);
            }}
            className={`w-9 text-center bg-transparent outline-none font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
              isFiltered ? 'text-white' : 'text-gray-700'
            }`}
          />
          <span>%</span>
        </button>

        {/* Word count */}
        <span className="ml-auto text-sm text-gray-500">
          {isFiltered
            ? t('wordList.wordCountFiltered', { n: filtered.length, total: list.words.length })
            : t('wordList.wordCount', { n: list.words.length })}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">{t('wordList.noMatch')}</p>
      ) : (
        <WordTable words={filtered} stats={stats} />
      )}
    </div>
  );
}
