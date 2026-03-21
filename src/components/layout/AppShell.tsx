import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parseImportAll } from '../../services/importExport';
import * as storage from '../../services/storage';
import { ExportAllModal } from '../common/ExportAllModal';
import { ImportAllModal } from '../common/ImportAllModal';
import { useLanguage } from '../../lang/LanguageContext';
import { buildProgressText, shareProgress } from '../../services/shareProgress';
import type { WordList, VerbList } from '../../types';
import { playClick } from '../../services/sounds';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const inVerbs = location.pathname.startsWith('/verbs');
  const isSection = location.pathname === '/' || location.pathname === '/verbs';
  const importInputRef = useRef<HTMLInputElement>(null);
  const [exportData, setExportData] = useState<{ wordLists: WordList[]; verbLists: VerbList[] } | null>(null);
  const [importData, setImportData] = useState<{ wordLists: WordList[]; verbLists: VerbList[]; renamedWords: { original: string; renamed: string }[]; renamedVerbs: { original: string; renamed: string }[] } | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => storage.getSettings().soundEnabled);

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    storage.saveSettings({ ...storage.getSettings(), soundEnabled: next });
    if (next) playClick();
  }

  async function handleShare() {
    const text = buildProgressText(storage.getWordLists(), storage.getVerbLists(), lang);
    const result = await shareProgress(text);
    if (result === 'copied') {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  }

  function handleExportClick() {
    setExportData({ wordLists: storage.getWordLists(), verbLists: storage.getVerbLists() });
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const result = parseImportAll(
          content,
          storage.getWordLists().map((l) => l.name),
          storage.getVerbLists().map((l) => l.name),
        );
        if (result.wordLists.length === 0 && result.verbLists.length === 0) {
          alert('No valid lists found in the file.');
          return;
        }
        setImportData(result);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to import file.');
      }
      if (importInputRef.current) importInputRef.current.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  }

  function handleImportConfirm(wordLists: WordList[], verbLists: VerbList[]) {
    if (wordLists.length > 0) storage.saveWordLists([...storage.getWordLists(), ...wordLists]);
    if (verbLists.length > 0) storage.saveVerbLists([...storage.getVerbLists(), ...verbLists]);
    setImportData(null);
    window.location.reload();
  }

  const backHref = inVerbs ? '/verbs' : '/';
  const backLabel = inVerbs ? t('nav.allVerbLists') : t('nav.allLists');

  function navTabClass(active: boolean) {
    return `text-sm font-medium px-3 py-1 rounded-full transition-colors ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-500 hover:text-gray-800'
    }`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-indigo-600 text-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-9 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-bold text-sm">VocabTrainer</span>
          <span className="text-indigo-300 text-xs">v{__APP_VERSION__}</span>
        </div>
      </div>
      <nav className="bg-white border-b border-gray-200 sticky top-9 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Link to="/" className={navTabClass(!inVerbs)}>{t('nav.vocabulary')}</Link>
            <Link to="/verbs" className={navTabClass(inVerbs)}>{t('nav.verbForms')}</Link>
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {soundEnabled ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12M9 6.253v13m0-13C7.832 5.477 6.246 5 4.5 5A2.5 2.5 0 002 7.5v9A2.5 2.5 0 004.5 19c1.746 0 3.332-.477 4.5-1.253" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              title={lang === 'he' ? 'Switch to English' : 'עבור לעברית'}
              className="p-2 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors w-9 h-9 flex items-center justify-center"
            >
              {lang === 'he' ? 'EN' : 'עב'}
            </button>

            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleImportFile(e.target.files[0]); }}
            />
            <button
              onClick={() => importInputRef.current?.click()}
              title={t('common.import')}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button
              onClick={handleExportClick}
              title={t('common.export')}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={handleShare}
              title={t('share.copy')}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
            {!isSection && (
              <Link to={backHref} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backLabel}
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {exportData && (
        <ExportAllModal
          wordLists={exportData.wordLists}
          verbLists={exportData.verbLists}
          onClose={() => setExportData(null)}
        />
      )}

      {importData && (
        <ImportAllModal
          wordLists={importData.wordLists}
          verbLists={importData.verbLists}
          renamedWords={importData.renamedWords}
          renamedVerbs={importData.renamedVerbs}
          onConfirm={handleImportConfirm}
          onClose={() => setImportData(null)}
        />
      )}

      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {t('share.copied')}
        </div>
      )}
    </div>
  );
}
