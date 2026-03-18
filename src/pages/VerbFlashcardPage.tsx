import { Link, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { VerbFlashcardDeck } from '../components/exercises/verb-flashcard/VerbFlashcardDeck';
import { Button } from '../components/common/Button';

export function VerbFlashcardPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useVerbList(id!);

  if (!list) return <div className="text-center py-16 text-gray-500">List not found.</div>;
  if (list.verbs.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p>No verbs in this list.</p>
      <Link to={`/verbs/${id}/edit`}><Button className="mt-4">Add verbs</Button></Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Flashcards — {list.name}</h1>
        <Link to={`/verbs/${id}`}>
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
      <VerbFlashcardDeck verbs={list.verbs} />
    </div>
  );
}
