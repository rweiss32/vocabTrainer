import { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import { translateToHebrew } from '../../services/translationService';
import { useLanguage } from '../../lang/LanguageContext';

interface AddWordFormProps {
  onAdd: (term: string, translation: string) => void;
}

export function AddWordForm({ onAdd }: AddWordFormProps) {
  const { t } = useLanguage();
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const termRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-fetch suggestion after user stops typing the English term
  useEffect(() => {
    setSuggestion(null);
    setSuggestionError(false);

    const trimmed = term.trim();
    if (!trimmed) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestion(true);
      try {
        const result = await translateToHebrew(trimmed);
        setSuggestion(result);
      } catch {
        setSuggestionError(true);
      } finally {
        setLoadingSuggestion(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [term]);

  function acceptSuggestion() {
    if (suggestion) {
      setTranslation(suggestion);
      setSuggestion(null);
    }
  }

  function handleSubmit() {
    const trimmedTerm = term.trim();
    const tr = translation.trim();
    if (!trimmedTerm || !tr) return;
    onAdd(trimmedTerm, tr);
    setTerm('');
    setTranslation('');
    setSuggestion(null);
    setSuggestionError(false);
    termRef.current?.focus();
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">{t('form.englishTerm')}</label>
        <input
          ref={termRef}
          type="text"
          placeholder="e.g. ephemeral"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {t('form.translation')}
          {loadingSuggestion && (
            <span className="ml-2 text-indigo-400 font-normal">{t('form.fetchingSuggestion')}</span>
          )}
        </label>
        <input
          type="text"
          placeholder="e.g. ארעי"
          dir="auto"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        />
        {suggestion && !translation && (
          <button
            type="button"
            onClick={acceptSuggestion}
            className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 group"
          >
            <span className="bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 font-medium group-hover:bg-indigo-100 transition-colors" dir="rtl">
              {suggestion}
            </span>
            <span className="text-gray-400 group-hover:text-indigo-600">{t('form.useSuggestion')}</span>
          </button>
        )}
        {suggestionError && (
          <p className="mt-1 text-xs text-gray-400">{t('form.suggestionError')}</p>
        )}
      </div>

      <div className="pt-5">
        <Button onClick={handleSubmit} disabled={!term.trim() || !translation.trim()}>
          {t('form.add')}
        </Button>
      </div>
    </div>
  );
}
