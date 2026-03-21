import { useState } from 'react';
import type { SharedList } from '../../services/shareUrl';
import { Modal } from './Modal';
import { Button } from './Button';
import { useLanguage } from '../../lang/LanguageContext';

interface ImportSharedListModalProps {
  shared: SharedList;
  existingNames: string[];
  onImport: (name: string) => void;
  onMerge: () => void;
  onClose: () => void;
}

export function ImportSharedListModal({ shared, existingNames, onImport, onMerge, onClose }: ImportSharedListModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(shared.name);

  const count = shared.type === 'words' ? shared.words.length : shared.verbs.length;
  const countLabel = shared.type === 'words'
    ? (count === 1 ? t('count.words', { n: count }) : t('count.words_plural', { n: count }))
    : (count === 1 ? t('count.verbs', { n: count }) : t('count.verbs_plural', { n: count }));

  const trimmed = name.trim();
  const hasConflict = existingNames.some(n => n.toLowerCase() === trimmed.toLowerCase());
  const isOriginalName = trimmed.toLowerCase() === shared.name.toLowerCase();
  const canImport = trimmed && (!hasConflict || !isOriginalName);

  return (
    <Modal
      title={t('shareUrl.importTitle')}
      onClose={onClose}
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
          {hasConflict && (
            <Button variant="secondary" onClick={onMerge}>{t('shareUrl.mergeIntoExisting')}</Button>
          )}
          <Button onClick={() => canImport && onImport(trimmed)} disabled={!canImport}>
            {t('shareUrl.importConfirm')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">{t('shareUrl.importDescription')}</p>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {t('shareUrl.listName')}
          </label>
          <input
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
              hasConflict ? 'border-yellow-400 focus:border-yellow-500' : 'border-gray-200 focus:border-indigo-400'
            }`}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {hasConflict && (
            <p className="text-xs text-yellow-600">{t('shareUrl.nameConflict')}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-500">{countLabel}</p>
        </div>
      </div>
    </Modal>
  );
}
