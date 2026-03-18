import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './lang/LanguageContext';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ListDetailPage } from './pages/ListDetailPage';
import { EditListPage } from './pages/EditListPage';
import { FlashcardPage } from './pages/FlashcardPage';
import { MatchingPage } from './pages/MatchingPage';
import { TypingPage } from './pages/TypingPage';
import { VerbsHomePage } from './pages/VerbsHomePage';
import { VerbListDetailPage } from './pages/VerbListDetailPage';
import { EditVerbListPage } from './pages/EditVerbListPage';
import { VerbFlashcardPage } from './pages/VerbFlashcardPage';
import { VerbTypingPage } from './pages/VerbTypingPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell><HomePage /></AppShell>,
    },
    {
      path: '/list/:id',
      element: <AppShell><ListDetailPage /></AppShell>,
    },
    {
      path: '/list/:id/edit',
      element: <AppShell><EditListPage /></AppShell>,
    },
    {
      path: '/list/:id/exercise/flashcard',
      element: <AppShell><FlashcardPage /></AppShell>,
    },
    {
      path: '/list/:id/exercise/matching',
      element: <AppShell><MatchingPage /></AppShell>,
    },
    {
      path: '/list/:id/exercise/typing',
      element: <AppShell><TypingPage /></AppShell>,
    },
    {
      path: '/verbs',
      element: <AppShell><VerbsHomePage /></AppShell>,
    },
    {
      path: '/verbs/:id',
      element: <AppShell><VerbListDetailPage /></AppShell>,
    },
    {
      path: '/verbs/:id/edit',
      element: <AppShell><EditVerbListPage /></AppShell>,
    },
    {
      path: '/verbs/:id/exercise/flashcard',
      element: <AppShell><VerbFlashcardPage /></AppShell>,
    },
    {
      path: '/verbs/:id/exercise/typing',
      element: <AppShell><VerbTypingPage /></AppShell>,
    },
  ],
  { basename: '/vocabTrainer' }
);

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
