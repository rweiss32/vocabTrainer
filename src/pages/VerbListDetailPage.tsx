import { useState } from 'react';
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
import { buildShareUrl } from '../services/shareUrl';

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
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  function handleCopyLink() {
    if (!list) return;
    const url = buildShareUrl(list, 'verbs');
    navigator.clipboard.writeText(url);
    setShareUrl(url);
    setTimeout(() => setShareUrl(null), 4000);
  }

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
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              title={shareUrl ? t('shareUrl.linkCopied') : t('shareUrl.copyLink')}
              onClick={handleCopyLink}
              className={shareUrl ? 'text-green-500' : 'text-gray-400 hover:text-indigo-500'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </Button>
            <Link to={`/verbs/${id}/edit`}>
              <Button variant="secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {t('verbDetail.editList')}
              </Button>
            </Link>
          </div>
          {shareUrl && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
              <span>{t('shareUrl.linkCopiedMsg', { name: list.name })}</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded-full transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.848L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.365l-.36-.214-3.727.977.994-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
                {t('shareUrl.whatsapp')}
              </a>
            </div>
          )}
        </div>
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
