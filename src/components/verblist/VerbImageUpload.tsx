import { useRef, useState } from 'react';
import type { Verb } from '../../types';
import { extractVerbsFromImage, type OcrVerb } from '../../services/ocrService';
import { translateToHebrew } from '../../services/translationService';
import { lookupIrregularVerb } from '../../data/irregularVerbs';
import { Button } from '../common/Button';

interface VerbPreviewRow {
  id: string;
  v1: string;
  v2: string;
  v3: string;
  meaning: string;
  v2Suggested: boolean; // filled from static table, not OCR
  v3Suggested: boolean;
  v2Missing: boolean;   // not in OCR and not in static table
  v3Missing: boolean;
  translating: boolean;
  included: boolean;
}

interface VerbImageUploadProps {
  onImport: (verbs: Verb[]) => void;
}

type Stage = 'idle' | 'scanning' | 'translating' | 'preview';

export function VerbImageUpload({ onImport }: VerbImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<VerbPreviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function processFile(file: File) {
    setError(null);
    setStage('scanning');
    setOcrProgress(0);

    let ocrVerbs: OcrVerb[] = [];
    try {
      ocrVerbs = await extractVerbsFromImage(file, setOcrProgress);
    } catch {
      setError('Could not scan the image. Try a clearer photo with printed text.');
      setStage('idle');
      return;
    }

    if (ocrVerbs.length === 0) {
      setError('No verbs found in the image.');
      setStage('idle');
      return;
    }

    // Build initial rows: fill missing V2/V3 and meaning from static table or OCR
    const initial: VerbPreviewRow[] = ocrVerbs.map((verb) => {
      const entry = lookupIrregularVerb(verb.v1);
      const v2 = verb.v2 || entry?.v2 || '';
      const v3 = verb.v3 || entry?.v3 || '';
      // Priority: OCR-detected meaning (RTL table) → static table → fetch via API
      const meaning = verb.meaning || entry?.meaning || '';
      return {
        id: crypto.randomUUID(),
        v1: verb.v1,
        v2,
        v3,
        meaning,
        v2Suggested: !verb.v2 && !!entry?.v2,
        v3Suggested: !verb.v3 && !!entry?.v3,
        v2Missing: !v2,
        v3Missing: !v3,
        translating: !meaning, // only fetch if meaning not already known
        included: true,
      };
    });

    setRows(initial);
    setStage('translating');

    // Fetch translations only for verbs not in the static table
    for (let i = 0; i < initial.length; i++) {
      const row = initial[i];
      if (!row.translating) continue;
      try {
        const translation = await translateToHebrew(row.v1);
        setRows((prev) =>
          prev.map((r) => r.id === row.id ? { ...r, meaning: translation, translating: false } : r)
        );
      } catch {
        setRows((prev) =>
          prev.map((r) => r.id === row.id ? { ...r, translating: false } : r)
        );
      }
      if (i < initial.length - 1) await delay(150);
    }

    setStage('preview');
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }

  function handleConfirm() {
    const verbs: Verb[] = rows
      .filter((r) => r.included && r.v1.trim() && r.v2.trim() && r.v3.trim())
      .map((r) => ({
        id: r.id,
        v1: r.v1.trim(),
        v2: r.v2.trim(),
        v3: r.v3.trim(),
        meaning: r.meaning.trim() || undefined,
      }));
    onImport(verbs);
    reset();
  }

  function reset() {
    setStage('idle');
    setRows([]);
    setError(null);
    setOcrProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  }

  function updateRow(id: string, field: 'v1' | 'v2' | 'v3' | 'meaning', value: string) {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'v2') updated.v2Missing = !value.trim();
      if (field === 'v3') updated.v3Missing = !value.trim();
      return updated;
    }));
  }

  function toggleRow(id: string) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, included: !r.included } : r));
  }

  const stillTranslating = rows.some((r) => r.translating);
  const readyCount = rows.filter((r) => r.included && r.v1.trim() && r.v2.trim() && r.v3.trim()).length;
  const incompleteCount = rows.filter((r) => r.included && (r.v2Missing || r.v3Missing)).length;

  if (stage === 'scanning') {
    return (
      <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center space-y-3">
        <p className="text-sm font-medium text-gray-700">Scanning image...</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
        </div>
        <p className="text-xs text-gray-400">{ocrProgress}%</p>
      </div>
    );
  }

  if (stage === 'translating' || stage === 'preview') {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            {stillTranslating
              ? `Fetching translations... (${rows.filter((r) => !r.translating).length}/${rows.length})`
              : incompleteCount > 0
              ? <span className="text-amber-600">{incompleteCount} verb{incompleteCount !== 1 ? 's' : ''} missing V2/V3 — fill in or uncheck</span>
              : `${readyCount} verb${readyCount !== 1 ? 's' : ''} ready to import`}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={reset}>Cancel</Button>
            <Button size="sm" onClick={handleConfirm} disabled={stillTranslating || readyCount === 0}>
              Import
            </Button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 w-8 border-b" />
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">V1</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">V2</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">V3</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={`border-b border-gray-100 last:border-0 ${!row.included ? 'opacity-40' : ''}`}>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.included}
                      onChange={() => toggleRow(row.id)}
                      className="rounded border-gray-300 text-indigo-600"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-400 outline-none"
                      value={row.v1}
                      onChange={(e) => updateRow(row.id, 'v1', e.target.value)}
                    />
                  </td>
                  <td className={`px-3 py-2 ${row.v2Missing && row.included ? 'bg-amber-50' : ''}`}>
                    <input
                      className={`w-full bg-transparent border-b outline-none ${
                        row.v2Missing && row.included
                          ? 'border-amber-400 placeholder-amber-400 focus:border-amber-500'
                          : 'border-transparent hover:border-gray-300 focus:border-indigo-400'
                      } ${row.v2Suggested ? 'italic text-indigo-600' : ''}`}
                      value={row.v2}
                      placeholder={row.v2Missing ? '?' : ''}
                      title={row.v2Suggested ? 'Suggested from built-in table' : undefined}
                      onChange={(e) => updateRow(row.id, 'v2', e.target.value)}
                    />
                  </td>
                  <td className={`px-3 py-2 ${row.v3Missing && row.included ? 'bg-amber-50' : ''}`}>
                    <input
                      className={`w-full bg-transparent border-b outline-none ${
                        row.v3Missing && row.included
                          ? 'border-amber-400 placeholder-amber-400 focus:border-amber-500'
                          : 'border-transparent hover:border-gray-300 focus:border-indigo-400'
                      } ${row.v3Suggested ? 'italic text-indigo-600' : ''}`}
                      value={row.v3}
                      placeholder={row.v3Missing ? '?' : ''}
                      title={row.v3Suggested ? 'Suggested from built-in table' : undefined}
                      onChange={(e) => updateRow(row.id, 'v3', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    {row.translating ? (
                      <span className="text-gray-300 text-xs">fetching...</span>
                    ) : (
                      <input
                        className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-400 outline-none"
                        value={row.meaning}
                        dir="auto"
                        placeholder="meaning..."
                        onChange={(e) => updateRow(row.id, 'meaning', e.target.value)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.some((r) => r.v2Suggested || r.v3Suggested) && (
          <p className="px-4 py-2 text-xs text-indigo-500 border-t bg-gray-50">
            <span className="italic font-medium">Italic</span> values are suggestions from the built-in table — verify before importing.
          </p>
        )}
      </div>
    );
  }

  // idle
  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-600">Drop an image here or <span className="text-indigo-600 font-medium">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Works best with lines like: go / went / gone</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
