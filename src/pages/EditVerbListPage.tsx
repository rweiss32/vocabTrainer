import { useNavigate, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { useVerbLists } from '../hooks/useVerbLists';
import { useLanguage } from '../lang/LanguageContext';
import { VerbTable } from '../components/verblist/VerbTable';
import { AddVerbForm } from '../components/verblist/AddVerbForm';
import { VerbImageUpload } from '../components/verblist/VerbImageUpload';
import { VerbFileUpload } from '../components/verblist/VerbFileUpload';
import { Button } from '../components/common/Button';
import { EditableTitle } from '../components/common/EditableTitle';
import type { Verb } from '../types';

export function EditVerbListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { list, addVerb, updateVerb, deleteVerb, saveVerbs, renameList } = useVerbList(id!);
  const { lists } = useVerbLists();

  if (!list) {
    return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  }

  function handleImageImport(imported: Verb[]) {
    if (!list) return;
    const existingV1s = new Set(list.verbs.map((v) => v.v1.toLowerCase()));
    const newVerbs = imported.filter((v) => !existingV1s.has(v.v1.toLowerCase()));
    const skipped = imported.length - newVerbs.length;
    saveVerbs([...list.verbs, ...newVerbs]);
    if (skipped > 0) alert(`Imported ${newVerbs.length} verbs. ${skipped} duplicate(s) skipped.`);
  }

  const verbCount = list.verbs.length;
  const verbLabel = verbCount === 1 ? t('count.verbs', { n: verbCount }) : t('count.verbs_plural', { n: verbCount });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <EditableTitle value={list.name} onSave={renameList} existingNames={lists.map((l) => l.name)} />
          <p className="text-sm text-gray-500 mt-1">{verbLabel}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/verbs/${id}`)}>
          {t('editVerb.done')}
        </Button>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editVerb.addVerb')}</h2>
        <AddVerbForm onAdd={addVerb} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editVerb.importFile')}</h2>
        <VerbFileUpload onImport={handleImageImport} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">{t('editVerb.importImage')}</h2>
        <VerbImageUpload onImport={handleImageImport} />
      </section>

      {list.verbs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">{t('editVerb.verbs')} ({list.verbs.length})</h2>
          <p className="text-xs text-gray-400">{t('editVerb.clickToEdit')}</p>
          <VerbTable
            verbs={list.verbs}
            editable
            onUpdate={updateVerb}
            onDelete={deleteVerb}
          />
        </section>
      )}
    </div>
  );
}
