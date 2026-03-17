import { useState } from 'react';
import { useWordLists } from '../hooks/useWordLists';
import { WordListCard } from '../components/wordlist/WordListCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';

export function HomePage() {
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
          <h1 className="text-2xl font-bold text-gray-900">My Word Lists</h1>
          <p className="text-sm text-gray-500 mt-1">Create and study your English vocabulary</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New list
        </Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          title="No word lists yet"
          description="Create your first list to start training your vocabulary."
          action={<Button onClick={() => setShowCreate(true)}>Create a list</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <WordListCard
              key={list.id}
              list={list}
              onDelete={deleteList}
              onRename={renameList}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal
          title="New word list"
          onClose={() => { setShowCreate(false); setNewName(''); }}
          footer={
            <>
              <Button variant="secondary" onClick={() => { setShowCreate(false); setNewName(''); }}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim() || isDuplicate}>Create</Button>
            </>
          }
        >
          <input
            autoFocus
            type="text"
            placeholder="e.g. Unit 5 — Animals"
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${isDuplicate ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-400'}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          />
          {isDuplicate && (
            <p className="text-xs text-red-500 mt-1">A list with this name already exists.</p>
          )}
        </Modal>
      )}
    </>
  );
}
