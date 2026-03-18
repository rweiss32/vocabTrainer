import { useRef, useState } from 'react';
import type { Word } from '../../types';
import { extractWordsFromImage } from '../../services/ocrService';
import { translateToHebrew } from '../../services/translationService';
import { Button } from '../common/Button';
import { useLanguage } from '../../lang/LanguageContext';

interface PreviewRow {
  id: string;
  term: string;
  translation: string;
  translating: boolean;
  included: boolean;
}

interface ImageUploadProps {
  onImport: (words: Word[]) => void;
}

type Stage = 'idle' | 'scanning' | 'translating' | 'preview';

export function ImageUpload({ onImport }: ImageUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function processFile(file: File) {
    setError(null);
    setStage('scanning');
    setOcrProgress(0);

    let terms: string[] = [];
    try {
      terms = await extractWordsFromImage(file, setOcrProgress);
    } catch {
      setError(t('upload.scanError'));
      setStage('idle');
      return;
    }

    if (terms.length === 0) {
      setError(t('upload.noWordsFound'));
      setStage('idle');
      return;
    }

    // Build initial rows
    const initial: PreviewRow[] = terms.map((term) => ({
      id: crypto.randomUUID(),
      term,
      translation: '',
      translating: true,
      included: true,
    }));
    setRows(initial);
    setStage('translating');

    // Fetch translations sequentially to avoid rate limiting
    for (let i = 0; i < initial.length; i++) {
      const row = initial[i];
      try {
        const translation = await translateToHebrew(row.term);
        setRows((prev) =>
          prev.map((r) => r.id === row.id ? { ...r, translation, translating: false } : r)
        );
      } catch {
        setRows((prev) =>
          prev.map((r) => r.id === row.id ? { ...r, translating: false } : r)
        );
      }
      // Small delay to be kind to the free API
      if (i < initial.length - 1) await delay(150);
    }

    setStage('preview');
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }

  function handleConfirm() {
    const words: Word[] = rows
      .filter((r) => r.included && r.term.trim() && r.translation.trim())
      .map((r) => ({ id: r.id, term: r.term.trim(), translation: r.translation.trim() }));
    onImport(words);
    reset();
  }

  function reset() {
    setStage('idle');
    setRows([]);
    setError(null);
    setOcrProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  }

  function updateRow(id: string, field: 'term' | 'translation', value: string) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }

  function toggleRow(id: string) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, included: !r.included } : r));
  }

  const includedCount = rows.filter((r) => r.included && r.translation.trim()).length;
  const stillTranslating = rows.some((r) => r.translating);

  if (stage === 'scanning') {
    return (
      <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center space-y-3">
        <p className="text-sm font-medium text-gray-700">{t('upload.scanning')}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${ocrProgress}%` }}
          />
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
              ? t('upload.fetchingTranslations', { done: rows.filter((r) => !r.translating).length, total: rows.length })
              : includedCount === 1 ? t('upload.wordsReady', { n: includedCount }) : t('upload.wordsReady_plural', { n: includedCount })}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={reset}>{t('common.cancel')}</Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={stillTranslating || includedCount === 0}
            >
              {t('common.import')}
            </Button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 w-8 border-b" />
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">{t('table.english')}</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b">{t('table.translation')}</th>
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
                      value={row.term}
                      onChange={(e) => updateRow(row.id, 'term', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    {row.translating ? (
                      <span className="text-gray-300 text-xs">{t('upload.fetchingCell')}</span>
                    ) : (
                      <input
                        className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-400 outline-none"
                        value={row.translation}
                        dir="auto"
                        placeholder={t('upload.translationPlaceholder')}
                        onChange={(e) => updateRow(row.id, 'translation', e.target.value)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <p className="text-sm text-gray-600">{t('upload.dropImageOr')} <span className="text-indigo-600 font-medium">{t('upload.browse')}</span></p>
        <p className="text-xs text-gray-400 mt-1">{t('upload.imageHint')}</p>
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
