import { useNavigate, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { useWordLists } from '../hooks/useWordLists';
import { useLanguage } from '../lang/LanguageContext';
import { WordTable } from '../components/wordlist/WordTable';
import { AddWordForm } from '../components/wordlist/AddWordForm';
import { FileUpload } from '../components/wordlist/FileUpload';
import { ImageUpload } from '../components/wordlist/ImageUpload';
import { Button } from '../components/common/Button';
import { EditableTitle } from '../components/common/EditableTitle';
import type { Word } from '../types';

export function EditListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { list, addWord, updateWord, deleteWord, saveWords, renameList } = useWordList(id!);
  const { lists } = useWordLists();

  if (!list) {
    return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  }

  function handleImport(imported: Word[]) {
    if (!list) return;
    const existingTerms = new Set(list.words.map((w) => w.term.toLowerCase()));
    const newWords = imported.filter((w) => !existingTerms.has(w.term.toLowerCase()));
    const skipped = imported.length - newWords.length;
    saveWords([...list.words, ...newWords]);
    if (skipped > 0) alert(`Imported ${newWords.length} words. ${skipped} duplicate(s) skipped.`);
  }

  const wordCount = list.words.length;
  const wordLabel = wordCount === 1 ? t('count.words', { n: wordCount }) : t('count.words_plural', { n: wordCount });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <EditableTitle value={list.name} onSave={renameList} existingNames={lists.map((l) => l.name)} />
          <p className="text-sm text-gray-500 mt-1">{wordLabel}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/list/${id}`)}>
          {t('editWord.done')}
        </Button>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editWord.addWord')}</h2>
        <AddWordForm onAdd={addWord} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editWord.importFile')}</h2>
        <FileUpload onImport={handleImport} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editWord.importImage')}</h2>
        <ImageUpload onImport={handleImport} />
      </section>

      {list.words.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">{t('editWord.words')} ({list.words.length})</h2>
          <p className="text-xs text-gray-400">{t('editWord.clickToEdit')}</p>
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
