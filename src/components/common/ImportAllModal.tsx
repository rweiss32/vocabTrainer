import { useState } from 'react';
import type { WordList, VerbList } from '../../types';
import type { RenameInfo } from '../../services/importExport';
import { Modal } from './Modal';
import { Button } from './Button';
import { useLanguage } from '../../lang/LanguageContext';

interface ImportAllModalProps {
  wordLists: WordList[];
  verbLists: VerbList[];
  renamedWords: RenameInfo[];
  renamedVerbs: RenameInfo[];
  onConfirm: (wordLists: WordList[], verbLists: VerbList[]) => void;
  onClose: () => void;
}

export function ImportAllModal({ wordLists, verbLists, renamedWords, renamedVerbs, onConfirm, onClose }: ImportAllModalProps) {
  const { t } = useLanguage();
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set(wordLists.map((l) => l.id)));
  const [selectedVerbs, setSelectedVerbs] = useState<Set<string>>(new Set(verbLists.map((l) => l.id)));

  const totalSelected = selectedWords.size + selectedVerbs.size;
  const totalAll = wordLists.length + verbLists.length;
  const allSelected = totalSelected === totalAll;
  const allRenamed = [...renamedWords, ...renamedVerbs];

  // Build a quick lookup: list id → original name (for renamed lists)
  const renamedWordMap = new Map(
    renamedWords.map((r) => [wordLists.find((l) => l.name === r.renamed)?.id ?? '', r.original])
  );
  const renamedVerbMap = new Map(
    renamedVerbs.map((r) => [verbLists.find((l) => l.name === r.renamed)?.id ?? '', r.original])
  );

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

  function handleImport() {
    onConfirm(
      wordLists.filter((l) => selectedWords.has(l.id)),
      verbLists.filter((l) => selectedVerbs.has(l.id)),
    );
  }

  return (
    <Modal
      title={t('common.import')}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleImport} disabled={totalSelected === 0}>
            {t('common.import')}{totalSelected > 0 ? ` (${totalSelected})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {totalAll === 0 ? (
          <p className="text-sm text-gray-500">{t('modal.import.noLists')}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">{t('modal.import.description')}</p>

            {totalAll > 1 && (
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-indigo-600"
                />
                {t('modal.export.selectAll')}
              </label>
            )}

            <div className="border-t pt-2 space-y-4 max-h-72 overflow-y-auto">
              {wordLists.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('modal.import.wordLists')}</p>
                  {wordLists.map((list) => {
                    const original = renamedWordMap.get(list.id);
                    return (
                      <label key={list.id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedWords.has(list.id)}
                          onChange={() => toggleWord(list.id)}
                          className="rounded border-gray-300 text-indigo-600"
                        />
                        <span className="flex-1 truncate">
                          {original ? (
                            <><span className="text-gray-400 line-through">{original}</span>{' '}<span className="text-amber-600">→ {list.name}</span></>
                          ) : list.name}
                        </span>
                        <span className="text-gray-400 shrink-0">{list.words.length === 1 ? t('count.words', { n: list.words.length }) : t('count.words_plural', { n: list.words.length })}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {verbLists.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('modal.import.verbLists')}</p>
                  {verbLists.map((list) => {
                    const original = renamedVerbMap.get(list.id);
                    return (
                      <label key={list.id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedVerbs.has(list.id)}
                          onChange={() => toggleVerb(list.id)}
                          className="rounded border-gray-300 text-indigo-600"
                        />
                        <span className="flex-1 truncate">
                          {original ? (
                            <><span className="text-gray-400 line-through">{original}</span>{' '}<span className="text-amber-600">→ {list.name}</span></>
                          ) : list.name}
                        </span>
                        <span className="text-gray-400 shrink-0">{list.verbs.length === 1 ? t('count.verbs', { n: list.verbs.length }) : t('count.verbs_plural', { n: list.verbs.length })}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {allRenamed.length > 0 && (
          <p className="text-xs text-amber-600 border-t pt-2">
            {allRenamed.length === 1 ? t('modal.import.renamed', { n: allRenamed.length }) : t('modal.import.renamed_plural', { n: allRenamed.length })}
          </p>
        )}
      </div>
    </Modal>
  );
}
