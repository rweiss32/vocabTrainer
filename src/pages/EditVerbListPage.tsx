import { useNavigate, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { useVerbLists } from '../hooks/useVerbLists';
import { VerbTable } from '../components/verblist/VerbTable';
import { AddVerbForm } from '../components/verblist/AddVerbForm';
import { Button } from '../components/common/Button';
import { EditableTitle } from '../components/common/EditableTitle';

export function EditVerbListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { list, addVerb, updateVerb, deleteVerb, renameList } = useVerbList(id!);
  const { lists } = useVerbLists();

  if (!list) {
    return <div className="text-center py-16 text-gray-500">List not found.</div>;
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
