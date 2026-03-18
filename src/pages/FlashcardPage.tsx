import { Link, useParams } from 'react-router-dom';
import { useWordList } from '../hooks/useWordList';
import { FlashcardDeck } from '../components/exercises/flashcard/FlashcardDeck';
import { Button } from '../components/common/Button';
import { useLanguage } from '../lang/LanguageContext';

export function FlashcardPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { list } = useWordList(id!);

  if (!list) return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  if (list.words.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p>{t('page.noWords')}</p>
      <Link to={`/list/${id}/edit`}><Button className="mt-4">{t('listDetail.addWords')}</Button></Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('page.flashcards.title', { name: list.name })}</h1>
        <Link to={`/list/${id}`}>
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
      <FlashcardDeck words={list.words} listId={id!} />
    </div>
  );
}
