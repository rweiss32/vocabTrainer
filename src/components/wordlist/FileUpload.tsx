import { useRef, useState } from 'react';
import type { Word } from '../../types';
import { parseWordFile, type ParseResult } from '../../services/fileParser';
import { Button } from '../common/Button';
import { useLanguage } from '../../lang/LanguageContext';

interface FileUploadProps {
  onImport: (words: Word[]) => void;
}

export function FileUpload({ onImport }: FileUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPreview(parseWordFile(content));
    };
    reader.readAsText(file, 'UTF-8');
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }

  function handleConfirm() {
    if (!preview) return;
    onImport(preview.words);
    setPreview(null);
  }

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-gray-600">{t('upload.dropFileOr')} <span className="text-indigo-600 font-medium">{t('upload.browse')}</span></p>
        <p className="text-xs text-gray-400 mt-1">{t('upload.wordFileHint')}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.tsv,.csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {preview && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{t('upload.previewWords', { n: preview.words.length })}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPreview(null)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={handleConfirm} disabled={preview.words.length === 0}>{t('common.import')}</Button>
            </div>
          </div>

          {preview.warnings.length > 0 && (
            <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
              {preview.warnings.map((w, i) => (
                <p key={i} className="text-xs text-yellow-700">{w}</p>
              ))}
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">{t('table.english')}</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">{t('table.translation')}</th>
                </tr>
              </thead>
              <tbody>
                {preview.words.map((w) => (
                  <tr key={w.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 text-gray-900">{w.term}</td>
                    <td className="px-4 py-2 text-gray-600">{w.translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
