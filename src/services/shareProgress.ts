import type { WordList, VerbList, ItemStat } from '../types';
import { getListStats } from './storage';

function summarizeList(listId: string, itemCount: number, name: string) {
  const stats = getListStats(listId);
  const items = Object.values(stats) as ItemStat[];
  const correct = items.reduce((s, i) => s + i.history.filter(Boolean).length, 0);
  const total = items.reduce((s, i) => s + i.history.length, 0);
  return { name, itemCount, correct, total };
}

export function buildProgressText(
  wordLists: WordList[],
  verbLists: VerbList[],
  lang: 'en' | 'he',
): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const wordSummaries = wordLists.map((l) => summarizeList(l.id, l.words.length, l.name));
  const verbSummaries = verbLists.map((l) => summarizeList(l.id, l.verbs.length, l.name));
  const allSummaries = [...wordSummaries, ...verbSummaries];
  const totalCorrect = allSummaries.reduce((s, l) => s + l.correct, 0);
  const totalAnswers = allSummaries.reduce((s, l) => s + l.total, 0);
  const overallPct = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  const isHe = lang === 'he';
  const lines: string[] = [];
  lines.push(`📚 VocabTrainer — ${isHe ? 'דוח התקדמות' : 'Progress Report'}`);
  lines.push(date);

  if (wordSummaries.length > 0) {
    lines.push('');
    lines.push(isHe ? '📖 רשימות מילים:' : '📖 Word Lists:');
    for (const s of wordSummaries) {
      const pct = s.total > 0 ? ` (${Math.round((s.correct / s.total) * 100)}%)` : '';
      const detail =
        s.total > 0
          ? `${s.correct}/${s.total}${pct} ✅`
          : isHe ? 'לא תורגל' : 'not practiced';
      const unit = isHe ? 'מילים' : 'words';
      lines.push(`• ${s.name} (${s.itemCount} ${unit}): ${detail}`);
    }
  }

  if (verbSummaries.length > 0) {
    lines.push('');
    lines.push(isHe ? '🔤 רשימות פעלים:' : '🔤 Verb Lists:');
    for (const s of verbSummaries) {
      const pct = s.total > 0 ? ` (${Math.round((s.correct / s.total) * 100)}%)` : '';
      const detail =
        s.total > 0
          ? `${s.correct}/${s.total}${pct} ✅`
          : isHe ? 'לא תורגל' : 'not practiced';
      const unit = isHe ? 'פעלים' : 'verbs';
      lines.push(`• ${s.name} (${s.itemCount} ${unit}): ${detail}`);
    }
  }

  if (totalAnswers > 0) {
    lines.push('');
    lines.push(`📊 ${isHe ? 'סה"כ' : 'Overall'}: ${totalCorrect}/${totalAnswers} (${overallPct}%)`);
  }

  return lines.join('\n');
}

export async function shareProgress(text: string): Promise<'shared' | 'copied'> {
  if (navigator.share && navigator.maxTouchPoints > 0) {
    await navigator.share({ text });
    return 'shared';
  }
  await navigator.clipboard.writeText(text);
  return 'copied';
}
