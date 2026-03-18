import { useState, useRef } from 'react';
import { Button } from '../common/Button';

interface AddVerbFormProps {
  onAdd: (v1: string, v2: string, v3: string, meaning?: string) => void;
}

export function AddVerbForm({ onAdd }: AddVerbFormProps) {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [v3, setV3] = useState('');
  const [meaning, setMeaning] = useState('');
  const v1Ref = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const trimV1 = v1.trim();
    const trimV2 = v2.trim();
    const trimV3 = v3.trim();
    if (!trimV1 || !trimV2 || !trimV3) return;
    onAdd(trimV1, trimV2, trimV3, meaning.trim() || undefined);
    setV1('');
    setV2('');
    setV3('');
    setMeaning('');
    v1Ref.current?.focus();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">V1 — Base form</label>
          <input
            ref={v1Ref}
            autoFocus
            type="text"
            placeholder="e.g. go"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={v1}
            onChange={(e) => setV1(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">V2 — Past simple</label>
          <input
            type="text"
            placeholder="e.g. went"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={v2}
            onChange={(e) => setV2(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">V3 — Past participle</label>
          <input
            type="text"
            placeholder="e.g. gone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={v3}
            onChange={(e) => setV3(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Meaning (optional)</label>
          <input
            type="text"
            placeholder="e.g. ללכת"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <Button onClick={handleAdd} disabled={!v1.trim() || !v2.trim() || !v3.trim()}>
          Add verb
        </Button>
      </div>
    </div>
  );
}
