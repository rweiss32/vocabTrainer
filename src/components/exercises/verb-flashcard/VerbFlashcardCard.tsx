import type { Verb } from '../../../types';

interface VerbFlashcardCardProps {
  verb: Verb;
  flipped: boolean;
  onClick: () => void;
}

export function VerbFlashcardCard({ verb, flipped, onClick }: VerbFlashcardCardProps) {
  return (
    <div className="card-scene w-full h-64 cursor-pointer select-none" onClick={onClick}>
      <div className={`card-flip ${flipped ? 'is-flipped' : ''}`}>
        {/* Front — V1 */}
        <div className="card-face bg-white rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 p-8">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">V1 — Base form</span>
          <p className="text-4xl font-semibold text-gray-900 text-center">{verb.v1}</p>
          {verb.meaning && (
            <p className="text-sm text-gray-400 text-center">{verb.meaning}</p>
          )}
          <span className="text-xs text-gray-300 mt-4">Click to flip</span>
        </div>
        {/* Back — V2 + V3 */}
        <div className="card-face card-face-back bg-indigo-600 rounded-2xl border-2 border-indigo-600 shadow-sm flex flex-col items-center justify-center gap-4 p-8">
          <div className="text-center">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">V2 — Past simple</span>
            <p className="text-3xl font-semibold text-white mt-1">{verb.v2}</p>
          </div>
          <div className="w-16 border-t border-indigo-400" />
          <div className="text-center">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">V3 — Past participle</span>
            <p className="text-3xl font-semibold text-white mt-1">{verb.v3}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
