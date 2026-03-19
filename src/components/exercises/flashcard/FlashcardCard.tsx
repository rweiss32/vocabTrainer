import type { Word } from '../../../types';
import { useLanguage } from '../../../lang/LanguageContext';
import { SpeakButton } from '../../common/SpeakButton';

interface FlashcardCardProps {
  word: Word;
  flipped: boolean;
  showTranslationFirst: boolean;
  onClick: () => void;
}

export function FlashcardCard({ word, flipped, showTranslationFirst, onClick }: FlashcardCardProps) {
  const { t } = useLanguage();
  const front = showTranslationFirst ? word.translation : word.term;
  const back = showTranslationFirst ? word.term : word.translation;
  const frontLabel = showTranslationFirst ? t('card.translation') : t('card.english');
  const backLabel = showTranslationFirst ? t('card.english') : t('card.translation');
  const frontIsEnglish = !showTranslationFirst;
  const backIsEnglish = showTranslationFirst;

  return (
    <div className="card-scene w-full h-64 cursor-pointer select-none" onClick={onClick}>
      <div className={`card-flip ${flipped ? 'is-flipped' : ''}`}>
        {/* Front */}
        <div className="card-face bg-white rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 p-8">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{frontLabel}</span>
          <p className="text-3xl font-semibold text-gray-900 text-center">{front}</p>
          {frontIsEnglish && <SpeakButton text={front} className="text-gray-400 hover:text-indigo-500" />}
          <span className="text-xs text-gray-300 mt-4">{t('card.clickToFlip')}</span>
        </div>
        {/* Back */}
        <div className="card-face card-face-back bg-indigo-600 rounded-2xl border-2 border-indigo-600 shadow-sm flex flex-col items-center justify-center gap-3 p-8">
          <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">{backLabel}</span>
          <p className="text-3xl font-semibold text-white text-center">{back}</p>
          {backIsEnglish && <SpeakButton text={back} className="text-indigo-200 hover:text-white" />}
        </div>
      </div>
    </div>
  );
}
