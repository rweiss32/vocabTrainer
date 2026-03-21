import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WordList } from '../../types';
import { Button } from '../common/Button';
import { useLanguage } from '../../lang/LanguageContext';
import { buildShareUrl } from '../../services/shareUrl';

interface WordListCardProps {
  list: WordList;
  existingNames: string[];
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function WordListCard({ list, existingNames, onDelete, onRename }: WordListCardProps) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  function handleCopyLink() {
    const url = buildShareUrl(list, 'words');
    navigator.clipboard.writeText(url);
    setShareUrl(url);
    setTimeout(() => setShareUrl(null), 4000);
  }

  const isDuplicate =
    name.trim().toLowerCase() !== list.name.toLowerCase() &&
    existingNames.some((n) => n.toLowerCase() === name.trim().toLowerCase());

  function handleRename() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== list.name && !isDuplicate) onRename(list.id, trimmed);
    setEditing(false);
    setName(list.name);
  }

  function handleCancel() {
    setEditing(false);
    setName(list.name);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {editing ? (
        <div>
          <input
            autoFocus
            className={`text-lg font-semibold text-gray-900 border-b-2 outline-none w-full ${isDuplicate ? 'border-red-400' : 'border-indigo-400'}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          {isDuplicate && (
            <p className="text-xs text-red-500 mt-1">{t('common.duplicateName')}</p>
          )}
        </div>
      ) : (
        <h3
          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 truncate"
          onClick={() => setEditing(true)}
          title="Click to rename"
        >
          {list.name}
        </h3>
      )}

      <p className="text-sm text-gray-500">{list.words.length === 1 ? t('count.words', { n: list.words.length }) : t('count.words_plural', { n: list.words.length })}</p>

      {shareUrl && (
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
          <span>{t('shareUrl.linkCopiedMsg', { name: list.name })}</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded-full transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.848L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.365l-.36-.214-3.727.977.994-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
            </svg>
            {t('shareUrl.whatsapp')}
          </a>
        </div>
      )}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        <Link to={`/list/${list.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full justify-center">{t('common.study')}</Button>
        </Link>
        <Link to={`/list/${list.id}/edit`}>
          <Button variant="secondary" size="sm">{t('common.edit')}</Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          title={shareUrl ? t('shareUrl.linkCopied') : t('shareUrl.copyLink')}
          onClick={handleCopyLink}
          className={shareUrl ? 'text-green-500' : 'text-gray-400 hover:text-indigo-500'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50"
          onClick={() => { if (confirm(`Delete "${list.name}"?`)) onDelete(list.id); }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
