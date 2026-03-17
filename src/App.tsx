import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ListDetailPage } from './pages/ListDetailPage';
import { EditListPage } from './pages/EditListPage';
import { FlashcardPage } from './pages/FlashcardPage';
import { MatchingPage } from './pages/MatchingPage';
import { TypingPage } from './pages/TypingPage';

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
  ],
  { basename: '/vocabTrainer' }
);

export default function App() {
  return <RouterProvider router={router} />;
}
