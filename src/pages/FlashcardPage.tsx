import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { FlashcardDeck } from '../components/exercises/flashcard/FlashcardDeck';
import { Button } from '../components/common/Button';

export function FlashcardPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useWordList(id!);

  if (!list) return <div className="text-center py-16 text-gray-500">List not found.</div>;
  if (list.words.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p>No words in this list.</p>
      <Link to={`/list/${id}/edit`}><Button className="mt-4">Add words</Button></Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Flashcards — {list.name}</h1>
        <Link to={`/list/${id}`}>
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
      <FlashcardDeck words={list.words} listId={id!} />
    </div>
  );
}
