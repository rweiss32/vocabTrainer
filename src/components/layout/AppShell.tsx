import { Link, useLocation } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const inVerbs = location.pathname.startsWith('/verbs');
  const isSection = location.pathname === '/' || location.pathname === '/verbs';

  const backHref = inVerbs ? '/verbs' : '/';
  const backLabel = inVerbs ? 'All verb lists' : 'All lists';

  function navTabClass(active: boolean) {
    return `text-sm font-medium px-3 py-1 rounded-full transition-colors ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-500 hover:text-gray-800'
    }`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-indigo-600 text-lg hover:text-indigo-700 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            VocabTrainer
          </Link>
          <span className="text-xs text-gray-400 font-normal">v{__APP_VERSION__}</span>

          <div className="flex items-center gap-1 ml-2">
            <Link to="/" className={navTabClass(!inVerbs)}>Vocabulary</Link>
            <Link to="/verbs" className={navTabClass(inVerbs)}>Verb Forms</Link>
          </div>

          {!isSection && (
            <Link to={backHref} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>
          )}
        </div>
      </nav>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
