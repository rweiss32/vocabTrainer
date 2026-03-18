import type { ItemStat } from '../../types';

export type StatColor = 'green' | 'yellow' | 'red' | 'gray';

export function statCounts(stat?: ItemStat): { correct: number; total: number } {
  if (!stat) return { correct: 0, total: 0 };
  return {
    correct: stat.history.filter(Boolean).length,
    total: stat.history.length,
  };
}

export function getStatColor(stat?: ItemStat): StatColor {
  if (!stat) return 'gray';
  const { correct, total } = statCounts(stat);
  if (total < 3) return 'gray';
  const rate = correct / total;
  if (rate >= 0.8) return 'green';
  if (rate >= 0.5) return 'yellow';
  return 'red';
}

const dotColors: Record<StatColor, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  red: 'bg-red-400',
  gray: 'bg-gray-300',
};

const textColors: Record<StatColor, string> = {
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-500',
  gray: 'text-gray-400',
};

interface StatDotProps {
  stat?: ItemStat;
}

export function StatDot({ stat }: StatDotProps) {
  const color = getStatColor(stat);
  const { correct, total } = statCounts(stat);
  const title = total === 0
    ? 'Not yet practiced'
    : `${correct}/${total} correct (last ${total} attempt${total !== 1 ? 's' : ''})`;

  if (total === 0) {
    return <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" title={title} />;
  }

  return (
    <span className="inline-flex items-center gap-1" title={title}>
      <span className={`w-2.5 h-2.5 rounded-full ${dotColors[color]} inline-block shrink-0`} />
      <span className={`text-xs font-medium tabular-nums ${textColors[color]}`}>
        {correct}/{total}
      </span>
    </span>
  );
}
