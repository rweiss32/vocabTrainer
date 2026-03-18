import type { ListStats, ItemStat } from '../../types';

function getColor(stat: ItemStat): 'green' | 'yellow' | 'red' {
  const total = stat.correct + stat.incorrect;
  if (total < 3) return 'yellow';
  const rate = stat.correct / total;
  if (rate >= 0.8) return 'green';
  if (rate >= 0.5) return 'yellow';
  return 'red';
}

interface StatsSummaryBarProps {
  stats: ListStats;
  total: number;
}

export function StatsSummaryBar({ stats, total }: StatsSummaryBarProps) {
  const entries = Object.values(stats);
  const seen = entries.length;
  if (seen === 0) return null;

  const mastered = entries.filter((s) => getColor(s) === 'green').length;
  const learning = entries.filter((s) => getColor(s) === 'yellow').length;
  const struggling = entries.filter((s) => getColor(s) === 'red').length;
  const unseen = total - seen;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
      {mastered > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          <span>{mastered} mastered</span>
        </span>
      )}
      {learning > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span>{learning} learning</span>
        </span>
      )}
      {struggling > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span>{struggling} needs practice</span>
        </span>
      )}
      {unseen > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
          <span>{unseen} not yet practiced</span>
        </span>
      )}
    </div>
  );
}
