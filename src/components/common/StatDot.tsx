import type { ItemStat } from '../../types';

export type StatColor = 'green' | 'yellow' | 'red' | 'gray';

export function getStatColor(stat?: ItemStat): StatColor {
  if (!stat) return 'gray';
  const total = stat.correct + stat.incorrect;
  if (total < 3) return 'gray';
  const rate = stat.correct / total;
  if (rate >= 0.8) return 'green';
  if (rate >= 0.5) return 'yellow';
  return 'red';
}

const colorClasses: Record<StatColor, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  red: 'bg-red-400',
  gray: 'bg-gray-300',
};

const titles: Record<StatColor, string> = {
  green: 'Mastered',
  yellow: 'Learning',
  red: 'Needs practice',
  gray: 'Not yet practiced',
};

interface StatDotProps {
  stat?: ItemStat;
}

export function StatDot({ stat }: StatDotProps) {
  const color = getStatColor(stat);
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${colorClasses[color]}`}
      title={titles[color]}
    />
  );
}
