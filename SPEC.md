# VocabTrainer — Project Specification

## Overview
A web-based English vocabulary trainer for Hebrew speakers. Students can create word lists, study them, and practise through multiple exercise modes.

## Live Site
https://rweiss32.github.io/vocabTrainer/

## Repository
https://github.com/rweiss32/vocabTrainer

## Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Storage:** localStorage (no backend — migration-ready for REST API)
- **Deployment:** GitHub Actions → GitHub Pages (auto-deploys on push to `main`)

---

## Data Model

```typescript
interface Word {
  id: string;        // crypto.randomUUID()
  term: string;      // English word
  translation: string; // Hebrew translation
}

interface WordList {
  id: string;
  name: string;
  words: Word[];
  createdAt: number;
  updatedAt: number;
}

interface AppSettings {
  nativeLanguage: string;    // default: "Hebrew"
  matchingPairCount: number; // default: 8
}
```

### localStorage Keys
- `vt_word_lists` → `WordList[]`
- `vt_settings` → `AppSettings`

---

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Grid of word list cards, create/delete/rename lists |
| `/list/:id` | ListDetailPage | Read-only word table + exercise launch buttons |
| `/list/:id/edit` | EditListPage | Add/edit/delete words, file import |
| `/list/:id/exercise/flashcard` | FlashcardPage | Flashcard exercise |
| `/list/:id/exercise/matching` | MatchingPage | Matching exercise |
| `/list/:id/exercise/typing` | TypingPage | Typing exercise |

---

## Features

### Word List Management
- Create / rename / delete lists from home page
- Inline rename: click the list name on any page (home card, detail page, edit page) — pencil icon appears on hover, Enter saves, Escape cancels
- Word table is sortable by term or translation (click column header)

### Word Entry
- **Manual:** type English term + Hebrew translation, press Enter or click Add
- **Auto-suggest translation:** while typing the English term, the app fetches a Hebrew translation suggestion from the MyMemory free API (600ms debounce). Suggestion appears as a clickable chip — click to accept, or ignore and type your own.
- **File import:** upload TSV or CSV file (max 500 rows). Preview shown before confirming. Duplicate terms (case-insensitive) are skipped with a count shown.

### File Import Format
- TSV (tab-separated) or CSV (comma-separated)
- One word pair per line: `English term<TAB>Hebrew translation`
- Lines starting with `#` are comments (skipped)
- Auto-detects and skips header row if first row contains words like "term", "word", "translation"
- Optional 3rd column ignored in V1

### Exercises

#### Flashcards
- Deck of all words, shuffleable
- Front: English term (or translation if direction toggled)
- Back: translation (indigo background)
- Keyboard: Space/Enter = flip, ← → = navigate
- Toggle direction button (English→Hebrew or Hebrew→English)
- Progress bar + counter

#### Matching
- Two columns: shuffled English terms | shuffled translations
- Click one from each column to pair
- Correct → turns green and locks
- Wrong → red flash, resets after 700ms, mistake counter increments
- Uses random subset of up to 8 pairs
- Completion screen with emoji feedback based on mistake count

#### Typing
- Shows Hebrew translation, student types English term
- Case-insensitive exact match
- After submit: shows correct/wrong + correct answer if wrong
- Progress bar, score tracked
- Completion screen with percentage score

---

## File Structure

```
vocabTrainer/
├── .github/workflows/deploy.yml   # GitHub Actions → GitHub Pages
├── src/
│   ├── App.tsx                    # Router (basename: /vocabTrainer)
│   ├── main.tsx
│   ├── index.css                  # Tailwind + flashcard flip animation CSS
│   ├── types/index.ts             # Word, WordList, AppSettings interfaces
│   ├── constants/index.ts         # localStorage keys, MAX_FILE_ROWS=500, MAX_MATCHING_PAIRS=8
│   ├── services/
│   │   ├── storage.ts             # All localStorage operations (never call localStorage directly from components)
│   │   ├── fileParser.ts          # TSV/CSV parsing, returns { words, warnings }
│   │   └── translationService.ts  # MyMemory API call (translateToHebrew)
│   ├── hooks/
│   │   ├── useWordLists.ts        # CRUD for all lists: createList, deleteList, renameList
│   │   └── useWordList.ts         # Single list: addWord, updateWord, deleteWord, saveWords, renameList
│   ├── components/
│   │   ├── layout/AppShell.tsx    # Nav bar + page wrapper
│   │   ├── common/
│   │   │   ├── Button.tsx         # variants: primary, secondary, danger, ghost; sizes: sm, md, lg
│   │   │   ├── Modal.tsx          # Escape key closes, backdrop click closes
│   │   │   ├── EmptyState.tsx
│   │   │   └── EditableTitle.tsx  # Click-to-edit heading (used for list name on detail+edit pages)
│   │   ├── wordlist/
│   │   │   ├── WordListCard.tsx   # Home page card with inline rename, study/edit/delete actions
│   │   │   ├── WordTable.tsx      # Sortable table; editable mode: click cell to edit, hover for delete
│   │   │   ├── AddWordForm.tsx    # Manual entry + auto-translation suggestion
│   │   │   └── FileUpload.tsx     # Drag-drop + file input, preview before import
│   │   └── exercises/
│   │       ├── flashcard/FlashcardCard.tsx + FlashcardDeck.tsx
│   │       ├── matching/MatchingBoard.tsx
│   │       └── typing/TypingQuestion.tsx + TypingSession.tsx
│   └── pages/
│       ├── HomePage.tsx
│       ├── ListDetailPage.tsx
│       ├── EditListPage.tsx
│       ├── FlashcardPage.tsx
│       ├── MatchingPage.tsx
│       └── TypingPage.tsx
```

---

## Architecture Decisions

| Decision | Reason |
|---|---|
| localStorage only (no backend) | Simple V1; all storage ops go through `services/storage.ts` to make REST migration easy |
| MyMemory API for translation | Free, no API key, supports Hebrew, browser CORS-friendly |
| No external state management | React `useState` + custom hooks is sufficient at this data scale |
| `crypto.randomUUID()` for IDs | Built-in, no dependency |
| Tailwind CSS v3 | Utility-first, fast to build with |
| `basename: '/vocabTrainer'` in router | Required for GitHub Pages subdirectory hosting |

---

## REST API Migration Path (future)
All localStorage calls are isolated in `services/storage.ts`. Functions map 1:1 to REST endpoints:
- `getWordLists()` → `GET /api/lists`
- `getWordList(id)` → `GET /api/lists/:id`
- `createWordList(name)` → `POST /api/lists`
- `updateWordList(id, data)` → `PUT /api/lists/:id`
- `deleteWordList(id)` → `DELETE /api/lists/:id`

---

## Planned / Future Features (V2+)
- Backend + user accounts for sharing lists between users
- Picture upload with OCR to extract word lists from photos (Claude vision API)
- AI-generated example sentences for fill-in-the-blank exercise
- Verb conjugation training (V1 / V2 / V3 forms)
- Spaced repetition (resurface hard words more often)

---

## Development

```bash
npm install       # install dependencies
npm run dev       # start local dev server
npm run build     # production build (outputs to dist/)
```

Push to `main` → GitHub Actions builds and deploys automatically to GitHub Pages.

## Git Branch Convention
Features are developed in separate branches (e.g. `feature/rename-list`, `feature/translation-suggestion`), merged to `main`, then pushed to trigger deployment.
