import type { ListStats } from '../../types';
import { getStatColor } from './StatDot';
import { useLanguage } from '../../lang/LanguageContext';

interface StatsSummaryBarProps {
  stats: ListStats;
  total: number;
}

export function StatsSummaryBar({ stats, total }: StatsSummaryBarProps) {
  const { t } = useLanguage();
  const entries = Object.values(stats);
  const seen = entries.length;
  if (seen === 0) return null;

  const mastered = entries.filter((s) => getStatColor(s) === 'green').length;
  const learning = entries.filter((s) => getStatColor(s) === 'yellow').length;
  const struggling = entries.filter((s) => getStatColor(s) === 'red').length;
  const unseen = total - seen;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
      {mastered > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          <span>{mastered} {t('stats.mastered')}</span>
        </span>
      )}
      {learning > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span>{learning} {t('stats.learning')}</span>
        </span>
      )}
      {struggling > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span>{struggling} {t('stats.needsPractice')}</span>
        </span>
      )}
      {unseen > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
          <span>{unseen} {t('stats.notYetPracticed')}</span>
        </span>
      )}
    </div>
  );
}
