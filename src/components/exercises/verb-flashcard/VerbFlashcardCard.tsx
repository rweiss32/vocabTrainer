import type { Verb } from '../../../types';
import { useLanguage } from '../../../lang/LanguageContext';
import { SpeakButton } from '../../common/SpeakButton';
import { useSounds } from '../../../hooks/useSounds';

interface VerbFlashcardCardProps {
  verb: Verb;
  flipped: boolean;
  onClick: () => void;
}

export function VerbFlashcardCard({ verb, flipped, onClick }: VerbFlashcardCardProps) {
  const { t } = useLanguage();
  const { playFlip } = useSounds();

  function handleClick() { playFlip(); onClick(); }
  return (
    <div className="card-scene w-full h-64 cursor-pointer select-none" onClick={handleClick}>
      <div className={`card-flip ${flipped ? 'is-flipped' : ''}`}>
        {/* Front — V1 */}
        <div className="card-face bg-white rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 p-8">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('card.v1')}</span>
          <p className="text-4xl font-semibold text-gray-900 text-center">{verb.v1}</p>
          <SpeakButton text={verb.v1} className="text-gray-400 hover:text-indigo-500" />
          {verb.meaning && (
            <p className="text-sm text-gray-400 text-center">{verb.meaning}</p>
          )}
          <span className="text-xs text-gray-300 mt-4">{t('card.clickToFlip')}</span>
        </div>
        {/* Back — V2 + V3 */}
        <div className="card-face card-face-back bg-indigo-600 rounded-2xl border-2 border-indigo-600 shadow-sm flex flex-col items-center justify-center gap-4 p-8">
          <div className="text-center">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">{t('card.v2')}</span>
            <p className="text-3xl font-semibold text-white mt-1">{verb.v2}</p>
            <SpeakButton text={verb.v2} className="text-indigo-200 hover:text-white mx-auto mt-1" />
          </div>
          <div className="w-16 border-t border-indigo-400" />
          <div className="text-center">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">{t('card.v3')}</span>
            <p className="text-3xl font-semibold text-white mt-1">{verb.v3}</p>
            <SpeakButton text={verb.v3} className="text-indigo-200 hover:text-white mx-auto mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
