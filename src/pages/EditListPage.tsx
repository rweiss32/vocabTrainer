import { useNavigate, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { WordTable } from '../components/wordlist/WordTable';
import { AddWordForm } from '../components/wordlist/AddWordForm';
import { FileUpload } from '../components/wordlist/FileUpload';
import { Button } from '../components/common/Button';
import type { Word } from '../types';

export function EditListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { list, addWord, updateWord, deleteWord, saveWords } = useWordList(id!);

  if (!list) {
    return <div className="text-center py-16 text-gray-500">List not found.</div>;
  }

  function handleImport(imported: Word[]) {
    if (!list) return;
    // Merge: avoid duplicates by term (case-insensitive)
    const existingTerms = new Set(list.words.map((w) => w.term.toLowerCase()));
    const newWords = imported.filter((w) => !existingTerms.has(w.term.toLowerCase()));
    const skipped = imported.length - newWords.length;
    saveWords([...list.words, ...newWords]);
    if (skipped > 0) alert(`Imported ${newWords.length} words. ${skipped} duplicate(s) skipped.`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{list.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{list.words.length} word{list.words.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/list/${id}`)}>
          Done
        </Button>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Add word</h2>
        <AddWordForm onAdd={addWord} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Import from file</h2>
        <p className="text-sm text-gray-500">Upload a TSV or CSV file with columns: <code className="bg-gray-100 px-1 rounded">English term</code> and <code className="bg-gray-100 px-1 rounded">Translation</code></p>
        <FileUpload onImport={handleImport} />
      </section>

      {list.words.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Words ({list.words.length})</h2>
          <p className="text-xs text-gray-400">Click any cell to edit. Hover a row to reveal the delete button.</p>
          <WordTable
            words={list.words}
            editable
            onUpdate={updateWord}
            onDelete={deleteWord}
          />
        </section>
      )}
    </div>
  );
}
