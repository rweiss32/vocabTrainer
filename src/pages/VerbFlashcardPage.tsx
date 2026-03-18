import { Link, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { VerbFlashcardDeck } from '../components/exercises/verb-flashcard/VerbFlashcardDeck';
import { Button } from '../components/common/Button';
import { useLanguage } from '../lang/LanguageContext';

export function VerbFlashcardPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { list } = useVerbList(id!);

  if (!list) return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  if (list.verbs.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p>{t('page.noVerbs')}</p>
      <Link to={`/verbs/${id}/edit`}><Button className="mt-4">{t('verbDetail.addVerbs')}</Button></Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('page.flashcards.title', { name: list.name })}</h1>
        <Link to={`/verbs/${id}`}>
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
      <VerbFlashcardDeck verbs={list.verbs} listId={id!} />
    </div>
  );
}
