import { Link, useParams } from 'react-router-dom';
import { useVerbList } from '../hooks/useVerbList';
import { useVerbLists } from '../hooks/useVerbLists';
import { useListStats } from '../hooks/useListStats';
import { useLanguage } from '../lang/LanguageContext';
import { VerbTable } from '../components/verblist/VerbTable';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { EditableTitle } from '../components/common/EditableTitle';
import { StatsSummaryBar } from '../components/common/StatsSummaryBar';

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

export function VerbListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { list, renameList } = useVerbList(id!);
  const { lists } = useVerbLists();
  const { stats } = useListStats(id!);

  if (!list) {
    return <div className="text-center py-16 text-gray-500">{t('common.listNotFound')}</div>;
  }

  const hasVerbs = list.verbs.length > 0;
  const verbCount = list.verbs.length;
  const verbLabel = verbCount === 1 ? t('count.verbs', { n: verbCount }) : t('count.verbs_plural', { n: verbCount });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <EditableTitle value={list.name} onSave={renameList} existingNames={lists.map((l) => l.name)} />
          <p className="text-sm text-gray-500 mt-1">{verbLabel}</p>
        </div>
        <Link to={`/verbs/${id}/edit`}>
          <Button variant="secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('verbDetail.editList')}
          </Button>
        </Link>
      </div>

      {!hasVerbs ? (
        <EmptyState
          title={t('verbDetail.noVerbs.title')}
          description={t('verbDetail.noVerbs.description')}
          action={
            <Link to={`/verbs/${id}/edit`}>
              <Button>{t('verbDetail.addVerbs')}</Button>
            </Link>
          }
        />
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">{t('verbDetail.exercises')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ExerciseCard
                to={`/verbs/${id}/exercise/flashcard`}
                title={t('exercise.flashcards')}
                description={t('exercise.verbFlashcards.desc')}
                disabled={!hasVerbs}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              <ExerciseCard
                to={`/verbs/${id}/exercise/typing`}
                title={t('exercise.typing')}
                description={t('exercise.verbTyping.desc')}
                disabled={!hasVerbs}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">{t('verbDetail.verbList')}</h2>
            <StatsSummaryBar stats={stats} total={list.verbs.length} />
            <VerbTable verbs={list.verbs} stats={stats} />
          </section>
        </>
      )}
    </div>
  );
}
