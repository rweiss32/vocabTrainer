import { useNavigate, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { useVerbLists } from '../hooks/useVerbLists';
import { VerbTable } from '../components/verblist/VerbTable';
import { AddVerbForm } from '../components/verblist/AddVerbForm';
import { VerbImageUpload } from '../components/verblist/VerbImageUpload';
import { Button } from '../components/common/Button';
import { EditableTitle } from '../components/common/EditableTitle';
import type { Verb } from '../types';

export function EditVerbListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { list, addVerb, updateVerb, deleteVerb, saveVerbs, renameList } = useVerbList(id!);
  const { lists } = useVerbLists();

  if (!list) {
    return <div className="text-center py-16 text-gray-500">List not found.</div>;
  }

  function handleImageImport(imported: Verb[]) {
    if (!list) return;
    const existingV1s = new Set(list.verbs.map((v) => v.v1.toLowerCase()));
    const newVerbs = imported.filter((v) => !existingV1s.has(v.v1.toLowerCase()));
    const skipped = imported.length - newVerbs.length;
    saveVerbs([...list.verbs, ...newVerbs]);
    if (skipped > 0) alert(`Imported ${newVerbs.length} verbs. ${skipped} duplicate(s) skipped.`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <EditableTitle value={list.name} onSave={renameList} existingNames={lists.map((l) => l.name)} />
          <p className="text-sm text-gray-500 mt-1">{list.verbs.length} verb{list.verbs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/verbs/${id}`)}>
          Done
        </Button>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Add verb</h2>
        <AddVerbForm onAdd={addVerb} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Import from image</h2>
        <p className="text-sm text-gray-500">
          Upload a photo with verb forms. Works best with lines like <code className="bg-gray-100 px-1 rounded">go / went / gone</code>.
          Missing V2/V3 are suggested from the built-in table or flagged for manual entry.
        </p>
        <VerbImageUpload onImport={handleImageImport} />
      </section>

      {list.verbs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Verbs ({list.verbs.length})</h2>
          <p className="text-xs text-gray-400">Click any cell to edit. Hover a row to reveal the delete button.</p>
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
