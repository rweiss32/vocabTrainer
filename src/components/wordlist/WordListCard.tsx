import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WordList } from '../../types';
import { Button } from '../common/Button';

interface WordListCardProps {
  list: WordList;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function WordListCard({ list, onDelete, onRename }: WordListCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);

  function handleRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== list.name) onRename(list.id, trimmed);
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {editing ? (
        <input
          autoFocus
          className="text-lg font-semibold text-gray-900 border-b-2 border-indigo-400 outline-none w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
        />
      ) : (
        <h3
          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 truncate"
          onClick={() => setEditing(true)}
          title="Click to rename"
        >
          {list.name}
        </h3>
      )}

      <p className="text-sm text-gray-500">{list.words.length} word{list.words.length !== 1 ? 's' : ''}</p>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        <Link to={`/list/${list.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full justify-center">Study</Button>
        </Link>
        <Link to={`/list/${list.id}/edit`}>
          <Button variant="secondary" size="sm">Edit</Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50"
          onClick={() => { if (confirm(`Delete "${list.name}"?`)) onDelete(list.id); }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
