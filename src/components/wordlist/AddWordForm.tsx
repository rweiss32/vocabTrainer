import { useState, useRef } from 'react';
import { Button } from '../common/Button';

interface AddWordFormProps {
  onAdd: (term: string, translation: string) => void;
}

export function AddWordForm({ onAdd }: AddWordFormProps) {
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const termRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const t = term.trim();
    const tr = translation.trim();
    if (!t || !tr) return;
    onAdd(t, tr);
    setTerm('');
    setTranslation('');
    termRef.current?.focus();
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">English term</label>
        <input
          ref={termRef}
          type="text"
          placeholder="e.g. ephemeral"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Translation</label>
        <input
          type="text"
          placeholder="e.g. ארעי"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        />
      </div>
      <Button onClick={handleSubmit} disabled={!term.trim() || !translation.trim()}>
        Add
      </Button>
    </div>
  );
}
