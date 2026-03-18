import { useState } from 'react';
import type { Verb } from '../../types';

interface VerbTableProps {
  verbs: Verb[];
  editable?: boolean;
  onUpdate?: (verbId: string, field: keyof Omit<Verb, 'id'>, value: string) => void;
  onDelete?: (verbId: string) => void;
}

function EditableCell({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        className="w-full border border-indigo-400 rounded px-1 py-0.5 text-sm outline-none"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer hover:text-indigo-600 hover:underline underline-offset-2"
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {value || <span className="text-gray-300 italic">—</span>}
    </span>
  );
}

export function VerbTable({ verbs, editable, onUpdate, onDelete }: VerbTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">V1 — Base</th>
            <th className="px-4 py-3">V2 — Past simple</th>
            <th className="px-4 py-3">V3 — Past participle</th>
            <th className="px-4 py-3">Meaning</th>
            {editable && <th className="px-4 py-3 w-10" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {verbs.map((verb) => (
            <tr key={verb.id} className="group bg-white hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {editable && onUpdate ? (
                  <EditableCell value={verb.v1} onSave={(v) => onUpdate(verb.id, 'v1', v)} />
                ) : (
                  verb.v1
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {editable && onUpdate ? (
                  <EditableCell value={verb.v2} onSave={(v) => onUpdate(verb.id, 'v2', v)} />
                ) : (
                  verb.v2
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {editable && onUpdate ? (
                  <EditableCell value={verb.v3} onSave={(v) => onUpdate(verb.id, 'v3', v)} />
                ) : (
                  verb.v3
                )}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {editable && onUpdate ? (
                  <EditableCell value={verb.meaning ?? ''} onSave={(v) => onUpdate(verb.id, 'meaning', v)} />
                ) : (
                  verb.meaning ?? <span className="text-gray-300 italic">—</span>
                )}
              </td>
              {editable && onDelete && (
                <td className="px-4 py-3">
                  <button
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                    onClick={() => onDelete(verb.id)}
                    title="Delete verb"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
