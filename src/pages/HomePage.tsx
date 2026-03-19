import { useState } from 'react';
import { useWordLists } from '../hooks/useWordLists';
import { WordListCard } from '../components/wordlist/WordListCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { useLanguage } from '../lang/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
  const { lists, createList, deleteList, renameList } = useWordLists();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const isDuplicate = lists.some(
    (l) => l.name.toLowerCase() === newName.trim().toLowerCase()
  );

  function handleCreate() {
    const name = newName.trim();
    if (!name || isDuplicate) return;
    createList(name);
    setNewName('');
    setShowCreate(false);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('home.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('home.subtitle')}</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('common.newList')}
        </Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          title={t('home.empty.title')}
          description={t('home.empty.description')}
          action={<Button onClick={() => setShowCreate(true)}>{t('common.createList')}</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <WordListCard
              key={list.id}
              list={list}
              existingNames={lists.map((l) => l.name)}
              onDelete={deleteList}
              onRename={renameList}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal
          title={t('home.modal.title')}
          onClose={() => { setShowCreate(false); setNewName(''); }}
          footer={
            <>
              <Button variant="secondary" onClick={() => { setShowCreate(false); setNewName(''); }}>{t('common.cancel')}</Button>
              <Button onClick={handleCreate} disabled={!newName.trim() || isDuplicate}>{t('common.create')}</Button>
            </>
          }
        >
          <input
            autoFocus
            type="text"
            placeholder={t('home.modal.placeholder')}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${isDuplicate ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-400'}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          />
          {isDuplicate && (
            <p className="text-xs text-red-500 mt-1">{t('common.duplicateName')}</p>
          )}
        </Modal>
      )}
    </>
  );
}
