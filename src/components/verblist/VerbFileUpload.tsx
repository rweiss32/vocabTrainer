import { useRef, useState } from 'react';
import type { Verb } from '../../types';
import { parseVerbFile, type VerbParseResult } from '../../services/fileParser';
import { Button } from '../common/Button';

interface VerbFileUploadProps {
  onImport: (verbs: Verb[]) => void;
}

export function VerbFileUpload({ onImport }: VerbFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<VerbParseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPreview(parseVerbFile(content));
    };
    reader.readAsText(file, 'UTF-8');
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }

  function handleConfirm() {
    if (!preview) return;
    onImport(preview.verbs);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
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
        <p className="text-sm text-gray-600">Drop a file here or <span className="text-indigo-600 font-medium">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">TSV or CSV — columns: <code className="bg-gray-100 px-1 rounded">v1, v2, v3, translation</code></p>
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
            <span className="text-sm font-medium text-gray-700">
              Preview — {preview.verbs.length} verb{preview.verbs.length !== 1 ? 's' : ''} found
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPreview(null)}>Cancel</Button>
              <Button size="sm" onClick={handleConfirm} disabled={preview.verbs.length === 0}>Import</Button>
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
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">V1</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">V2</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">V3</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">Translation</th>
                </tr>
              </thead>
              <tbody>
                {preview.verbs.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 text-gray-900 font-medium">{v.v1}</td>
                    <td className="px-4 py-2 text-gray-700">{v.v2}</td>
                    <td className="px-4 py-2 text-gray-700">{v.v3}</td>
                    <td className="px-4 py-2 text-gray-500">{v.meaning ?? '—'}</td>
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
