import { useState } from 'react';
import type { WordList, VerbList } from '../../types';
import { exportAll } from '../../services/importExport';
import { Modal } from './Modal';
import { Button } from './Button';

interface ExportAllModalProps {
  wordLists: WordList[];
  verbLists: VerbList[];
  onClose: () => void;
}

export function ExportAllModal({ wordLists, verbLists, onClose }: ExportAllModalProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set(wordLists.map((l) => l.id)));
  const [selectedVerbs, setSelectedVerbs] = useState<Set<string>>(new Set(verbLists.map((l) => l.id)));

  const totalSelected = selectedWords.size + selectedVerbs.size;
  const totalAll = wordLists.length + verbLists.length;
  const allSelected = totalSelected === totalAll;

  function toggleAll() {
    if (allSelected) {
      setSelectedWords(new Set());
      setSelectedVerbs(new Set());
    } else {
      setSelectedWords(new Set(wordLists.map((l) => l.id)));
      setSelectedVerbs(new Set(verbLists.map((l) => l.id)));
    }
  }

  function toggleWord(id: string) {
    setSelectedWords((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function toggleVerb(id: string) {
    setSelectedVerbs((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function handleExport() {
    exportAll(
      wordLists.filter((l) => selectedWords.has(l.id)),
      verbLists.filter((l) => selectedVerbs.has(l.id)),
    );
    onClose();
  }

  return (
    <Modal
      title="Export"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} disabled={totalSelected === 0}>
            Export {totalSelected > 0 ? `(${totalSelected})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Select the lists to include in the export file.</p>

        {totalAll > 1 && (
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="rounded border-gray-300 text-indigo-600"
            />
            Select all
          </label>
        )}

        <div className="border-t pt-2 space-y-4 max-h-72 overflow-y-auto">
          {wordLists.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Word lists</p>
              {wordLists.map((list) => (
                <label key={list.id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedWords.has(list.id)}
                    onChange={() => toggleWord(list.id)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="flex-1 truncate">{list.name}</span>
                  <span className="text-gray-400 shrink-0">{list.words.length} words</span>
                </label>
              ))}
            </div>
          )}

          {verbLists.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Verb lists</p>
              {verbLists.map((list) => (
                <label key={list.id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedVerbs.has(list.id)}
                    onChange={() => toggleVerb(list.id)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="flex-1 truncate">{list.name}</span>
                  <span className="text-gray-400 shrink-0">{list.verbs.length} verbs</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
