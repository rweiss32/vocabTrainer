import { useState, useRef, useEffect } from 'react';
import type { Word } from '../../../types';
import { Button } from '../../common/Button';

interface TypingQuestionProps {
  word: Word;
  questionNumber: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

export function TypingQuestion({ word, questionNumber, total, onAnswer }: TypingQuestionProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setSubmitted(false);
    inputRef.current?.focus();
  }, [word.id]);

  function handleSubmit() {
    if (!input.trim()) return;
    const isCorrect = input.trim().toLowerCase() === word.term.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
  }

  function handleNext() {
    onAnswer(correct);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Question {questionNumber} of {total}</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">What is the English word for...</p>
        <p className="text-4xl font-bold text-gray-900">{word.translation}</p>
      </div>

      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type the English term..."
          className={`w-full border-2 rounded-xl px-4 py-3 text-lg outline-none transition-colors ${
            submitted
              ? correct
                ? 'border-green-400 bg-green-50 text-green-800'
                : 'border-red-400 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-indigo-400'
          }`}
          value={input}
          onChange={(e) => !submitted && setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submitted ? handleNext() : handleSubmit(); }}
          readOnly={submitted}
        />

        {submitted && !correct && (
          <p className="text-sm text-gray-600">
            Correct answer: <span className="font-semibold text-gray-900">{word.term}</span>
          </p>
        )}
        {submitted && correct && (
          <p className="text-sm text-green-600 font-medium">Correct!</p>
        )}
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!input.trim()}>Check</Button>
        ) : (
          <Button onClick={handleNext}>
            {questionNumber < total ? 'Next' : 'See results'}
          </Button>
        )}
      </div>
    </div>
  );
}
