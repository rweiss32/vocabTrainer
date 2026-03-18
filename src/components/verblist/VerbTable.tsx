import { useState } from 'react';
import type { Verb, ListStats } from '../../types';
import { Button } from '../common/Button';
import { StatDot } from '../common/StatDot';

interface VerbTableProps {
  verbs: Verb[];
  editable?: boolean;
  stats?: ListStats;
  onUpdate?: (verbId: string, field: keyof Omit<Verb, 'id'>, value: string) => void;
  onDelete?: (verbId: string) => void;
}

export function VerbTable({ verbs, editable = false, stats, onUpdate, onDelete }: VerbTableProps) {
  const showStats = stats !== undefined;
  if (verbs.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No verbs yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {showStats && <th className="px-3 py-3 w-8" />}
            <th className="px-4 py-3">V1 — Base</th>
            <th className="px-4 py-3">V2 — Past simple</th>
            <th className="px-4 py-3">V3 — Past participle</th>
            <th className="px-4 py-3">Meaning</th>
            {editable && <th className="px-4 py-3 w-12" />}
          </tr>
        </thead>
        <tbody>
          {verbs.map((verb) => (
            <VerbRow
              key={verb.id}
              verb={verb}
              editable={editable}
              showStats={showStats}
              stat={stats?.[verb.id]}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type EditableField = 'v1' | 'v2' | 'v3' | 'meaning';

interface VerbRowProps {
  verb: Verb;
  editable: boolean;
  showStats?: boolean;
  stat?: import('../../types').ItemStat;
  onUpdate?: (verbId: string, field: keyof Omit<Verb, 'id'>, value: string) => void;
  onDelete?: (verbId: string) => void;
}

function VerbRow({ verb, editable, showStats, stat, onUpdate, onDelete }: VerbRowProps) {
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [value, setValue] = useState('');

  function startEdit(field: EditableField) {
    if (!editable) return;
    setEditingField(field);
    setValue(field === 'meaning' ? (verb.meaning ?? '') : verb[field]);
  }

  function commitEdit() {
    if (editingField) {
      const trimmed = value.trim();
      // meaning is optional — allow clearing it; v1/v2/v3 require a value
      if (editingField === 'meaning' || trimmed) {
        onUpdate?.(verb.id, editingField, trimmed);
      }
    }
    setEditingField(null);
  }

  const cellClass = `px-4 py-3 border-b border-gray-100 ${editable ? 'cursor-pointer hover:bg-gray-50' : ''}`;

  function renderCell(field: EditableField, displayValue: string, textClass = 'text-gray-700') {
    return (
      <td className={cellClass} onClick={() => startEdit(field)}>
        {editingField === field ? (
          <input
            autoFocus
            className="border-b border-indigo-400 outline-none w-full bg-transparent"
            value={value}
            dir={field === 'meaning' ? 'auto' : undefined}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') setEditingField(null);
            }}
          />
        ) : (
          <span className={displayValue ? textClass : 'text-gray-300 italic'}>
            {displayValue || '—'}
          </span>
        )}
      </td>
    );
  }

  return (
    <tr className="group">
      {showStats && (
        <td className="px-3 py-3 border-b border-gray-100 text-center">
          <StatDot stat={stat} />
        </td>
      )}
      {renderCell('v1', verb.v1, 'text-gray-900 font-medium')}
      {renderCell('v2', verb.v2)}
      {renderCell('v3', verb.v3)}
      {renderCell('meaning', verb.meaning ?? '')}
      {editable && (
        <td className="px-4 py-3 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 !p-1"
            onClick={() => onDelete?.(verb.id)}
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
