import { useState } from 'react';
import type { Word, ListStats } from '../../types';
import { Button } from '../common/Button';
import { StatDot } from '../common/StatDot';
import { useLanguage } from '../../lang/LanguageContext';

interface WordTableProps {
  words: Word[];
  editable?: boolean;
  stats?: ListStats;
  onUpdate?: (id: string, field: 'term' | 'translation', value: string) => void;
  onDelete?: (id: string) => void;
}

export function WordTable({ words, editable = false, stats, onUpdate, onDelete }: WordTableProps) {
  const { t } = useLanguage();
  const showStats = stats !== undefined;
  const [sortField, setSortField] = useState<'term' | 'translation'>('term');
  const [sortAsc, setSortAsc] = useState(true);

  function toggleSort(field: 'term' | 'translation') {
    if (sortField === field) setSortAsc((a) => !a);
    else { setSortField(field); setSortAsc(true); }
  }

  const sorted = [...words].sort((a, b) => {
    const cmp = a[sortField].localeCompare(b[sortField]);
    return sortAsc ? cmp : -cmp;
  });

  if (words.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">{t('table.noWords')}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {showStats && <th className="px-3 py-3 text-left font-medium text-gray-600 select-none whitespace-nowrap">{t('table.score')}</th>}
            <th
              className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => toggleSort('term')}
            >
              {t('table.english')} {sortField === 'term' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th
              className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => toggleSort('translation')}
            >
              {t('table.translation')} {sortField === 'translation' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            {editable && <th className="px-4 py-3 w-12" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map((word) => (
            <WordRow
              key={word.id}
              word={word}
              editable={editable}
              showStats={showStats}
              stat={stats?.[word.id]}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface WordRowProps {
  word: Word;
  editable: boolean;
  showStats?: boolean;
  stat?: import('../../types').ItemStat;
  onUpdate?: (id: string, field: 'term' | 'translation', value: string) => void;
  onDelete?: (id: string) => void;
}

function WordRow({ word, editable, showStats, stat, onUpdate, onDelete }: WordRowProps) {
  const [editingField, setEditingField] = useState<'term' | 'translation' | null>(null);
  const [value, setValue] = useState('');

  function startEdit(field: 'term' | 'translation') {
    if (!editable) return;
    setEditingField(field);
    setValue(word[field]);
  }

  function commitEdit() {
    if (editingField && value.trim()) {
      onUpdate?.(word.id, editingField, value.trim());
    }
    setEditingField(null);
  }

  const cellClass = `px-4 py-3 border-b border-gray-100 ${editable ? 'cursor-pointer hover:bg-gray-50' : ''}`;

  return (
    <tr className="group">
      {showStats && (
        <td className="px-3 py-3 border-b border-gray-100 text-center">
          <StatDot stat={stat} />
        </td>
      )}
      <td className={cellClass} onClick={() => startEdit('term')}>
        {editingField === 'term' ? (
          <input
            autoFocus
            className="border-b border-indigo-400 outline-none w-full bg-transparent"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingField(null); }}
          />
        ) : (
          <span className="text-gray-900">{word.term}</span>
        )}
      </td>
      <td className={cellClass} onClick={() => startEdit('translation')}>
        {editingField === 'translation' ? (
          <input
            autoFocus
            className="border-b border-indigo-400 outline-none w-full bg-transparent"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingField(null); }}
          />
        ) : (
          <span className="text-gray-600">{word.translation}</span>
        )}
      </td>
      {editable && (
        <td className="px-4 py-3 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 !p-1"
            onClick={() => onDelete?.(word.id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </td>
      )}
    </tr>
  );
}
