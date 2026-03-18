import { useState, useRef, useEffect } from 'react';
import type { Verb } from '../../../types';
import { Button } from '../../common/Button';

interface VerbTypingQuestionProps {
  verb: Verb;
  questionNumber: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

export function VerbTypingQuestion({ verb, questionNumber, total, onAnswer }: VerbTypingQuestionProps) {
  const [v2Input, setV2Input] = useState('');
  const [v3Input, setV3Input] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [v2Correct, setV2Correct] = useState(false);
  const [v3Correct, setV3Correct] = useState(false);
  const v2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setV2Input('');
    setV3Input('');
    setSubmitted(false);
    v2Ref.current?.focus();
  }, [verb.id]);

  function handleSubmit() {
    if (!v2Input.trim() || !v3Input.trim()) return;
    const isV2Correct = v2Input.trim().toLowerCase() === verb.v2.toLowerCase();
    const isV3Correct = v3Input.trim().toLowerCase() === verb.v3.toLowerCase();
    setV2Correct(isV2Correct);
    setV3Correct(isV3Correct);
    setSubmitted(true);
  }

  function handleNext() {
    onAnswer(v2Correct && v3Correct);
  }

  function inputClass(correct: boolean) {
    if (!submitted) return 'border-gray-300 focus:border-indigo-400';
    return correct ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800';
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Question {questionNumber} of {total}</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">V1 — Base form</p>
        <p className="text-4xl font-bold text-gray-900">{verb.v1}</p>
        {verb.meaning && (
          <p className="text-sm text-gray-400">{verb.meaning}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">V2 — Past simple</label>
          <input
            ref={v2Ref}
            type="text"
            placeholder="Type V2..."
            className={`w-full border-2 rounded-xl px-4 py-3 text-lg outline-none transition-colors ${inputClass(v2Correct)}`}
            value={v2Input}
            onChange={(e) => !submitted && setV2Input(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitted ? handleNext() : handleSubmit(); }}
            readOnly={submitted}
          />
          {submitted && !v2Correct && (
            <p className="text-sm text-gray-600">
              Correct: <span className="font-semibold text-gray-900">{verb.v2}</span>
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">V3 — Past participle</label>
          <input
            type="text"
            placeholder="Type V3..."
            className={`w-full border-2 rounded-xl px-4 py-3 text-lg outline-none transition-colors ${inputClass(v3Correct)}`}
            value={v3Input}
            onChange={(e) => !submitted && setV3Input(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitted ? handleNext() : handleSubmit(); }}
            readOnly={submitted}
          />
          {submitted && !v3Correct && (
            <p className="text-sm text-gray-600">
              Correct: <span className="font-semibold text-gray-900">{verb.v3}</span>
            </p>
          )}
        </div>

        {submitted && v2Correct && v3Correct && (
          <p className="text-sm text-green-600 font-medium">Correct!</p>
        )}
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!v2Input.trim() || !v3Input.trim()}>Check</Button>
        ) : (
          <Button onClick={handleNext}>
            {questionNumber < total ? 'Next' : 'See results'}
          </Button>
        )}
      </div>
    </div>
  );
}
