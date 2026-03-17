import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { useWordLists } from '../hooks/useWordLists';
import { WordTable } from '../components/wordlist/WordTable';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { EditableTitle } from '../components/common/EditableTitle';

interface ExerciseCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function ExerciseCard({ to, title, description, icon, disabled }: ExerciseCardProps) {
  const content = (
    <div className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-shadow ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:shadow-md hover:border-indigo-200 cursor-pointer'}`}>
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );

  if (disabled) return content;
  return <Link to={to}>{content}</Link>;
}

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { list, renameList } = useWordList(id!);
  const { lists } = useWordLists();

  if (!list) {
    return <div className="text-center py-16 text-gray-500">List not found.</div>;
  }

  const hasWords = list.words.length > 0;
  const hasEnoughForMatching = list.words.length >= 2;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <EditableTitle value={list.name} onSave={renameList} existingNames={lists.map((l) => l.name)} />
          <p className="text-sm text-gray-500 mt-1">{list.words.length} word{list.words.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to={`/list/${id}/edit`}>
          <Button variant="secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit list
          </Button>
        </Link>
      </div>

      {!hasWords ? (
        <EmptyState
          title="No words in this list"
          description="Add words to start practising."
          action={
            <Link to={`/list/${id}/edit`}>
              <Button>Add words</Button>
            </Link>
          }
        />
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">Exercises</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ExerciseCard
                to={`/list/${id}/exercise/flashcard`}
                title="Flashcards"
                description="Flip cards to reveal translations"
                disabled={!hasWords}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              <ExerciseCard
                to={`/list/${id}/exercise/matching`}
                title="Matching"
                description="Connect words to their translations"
                disabled={!hasEnoughForMatching}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                }
              />
              <ExerciseCard
                to={`/list/${id}/exercise/typing`}
                title="Typing"
                description="See the translation, type the English term"
                disabled={!hasWords}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">Word list</h2>
            <WordTable words={list.words} />
          </section>
        </>
      )}
    </div>
  );
}
