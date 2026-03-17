import { useState } from 'react';
import type { WordList } from '../../types';
import { exportLists } from '../../services/importExport';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ExportModalProps {
  lists: WordList[];
  onClose: () => void;
}

export function ExportModal({ lists, onClose }: ExportModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(lists.map((l) => l.id)));

  const allSelected = selected.size === lists.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(lists.map((l) => l.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleExport() {
    const toExport = lists.filter((l) => selected.has(l.id));
    exportLists(toExport);
    onClose();
  }

  return (
    <Modal
      title="Export word lists"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} disabled={selected.size === 0}>
            Export {selected.size > 0 ? `(${selected.size})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Select the lists to include in the export file.</p>

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="rounded border-gray-300 text-indigo-600"
          />
          Select all
        </label>

        <div className="border-t pt-2 space-y-2 max-h-64 overflow-y-auto">
          {lists.map((list) => (
            <label key={list.id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selected.has(list.id)}
                onChange={() => toggle(list.id)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="flex-1 truncate">{list.name}</span>
              <span className="text-gray-400 shrink-0">{list.words.length} words</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
