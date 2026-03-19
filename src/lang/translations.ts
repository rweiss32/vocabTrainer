export type Lang = 'en' | 'he';

const en = {
  // Navigation
  'nav.vocabulary': 'Vocabulary',
  'nav.verbForms': 'Verb Forms',
  'nav.allLists': 'All lists',
  'nav.allVerbLists': 'All verb lists',

  // Common
  'common.cancel': 'Cancel',
  'common.import': 'Import',
  'common.export': 'Export',
  'common.create': 'Create',
  'common.done': 'Done',
  'common.study': 'Study',
  'common.edit': 'Edit',
  'common.back': 'Back',
  'common.newList': 'New list',
  'common.createList': 'Create a list',
  'common.duplicateName': 'A list with this name already exists.',
  'common.listNotFound': 'List not found.',

  // Home page
  'home.title': 'My Word Lists',
  'home.subtitle': 'Create and study your English vocabulary',
  'home.modal.title': 'New word list',
  'home.modal.placeholder': 'e.g. Unit 5 — Animals',
  'home.empty.title': 'No word lists yet',
  'home.empty.description': 'Create your first list to start training your vocabulary.',

  // Verbs home page
  'verbs.title': 'Verb Forms',
  'verbs.subtitle': 'Practice irregular verbs — V1, V2, V3',
  'verbs.modal.title': 'New verb list',
  'verbs.modal.placeholder': 'e.g. Irregular Verbs — Set 1',
  'verbs.empty.title': 'No verb lists yet',
  'verbs.empty.description': 'Create your first list to start practising irregular verbs.',

  // List detail page
  'listDetail.editList': 'Edit list',
  'listDetail.export': 'Export',
  'listDetail.exercises': 'Exercises',
  'listDetail.wordList': 'Word list',
  'listDetail.noWords.title': 'No words in this list',
  'listDetail.noWords.description': 'Add words to start practising.',
  'listDetail.addWords': 'Add words',

  // Verb list detail page
  'verbDetail.editList': 'Edit list',
  'verbDetail.exercises': 'Exercises',
  'verbDetail.verbList': 'Verb list',
  'verbDetail.noVerbs.title': 'No verbs in this list',
  'verbDetail.noVerbs.description': 'Add verbs to start practising.',
  'verbDetail.addVerbs': 'Add verbs',

  // Exercise cards
  'exercise.flashcards': 'Flashcards',
  'exercise.flashcards.desc': 'Flip cards to reveal translations',
  'exercise.matching': 'Matching',
  'exercise.matching.desc': 'Connect words to their translations',
  'exercise.typing': 'Typing',
  'exercise.typing.desc': 'See the translation, type the English term',
  'exercise.verbFlashcards.desc': 'See V1, flip to reveal V2 and V3',
  'exercise.verbTyping.desc': 'See V1, type V2 and V3',

  // Flashcard deck
  'flashcard.prev': 'Prev',
  'flashcard.next': 'Next',
  'flashcard.shuffle': 'Shuffle',
  'flashcard.englishToTranslation': 'English → Translation',
  'flashcard.translationToEnglish': 'Translation → English',
  'flashcard.weakWords': '⚡ Weak words',
  'flashcard.allWords': 'All words',
  'flashcard.weakVerbs': '⚡ Weak verbs',
  'flashcard.allVerbs': 'All verbs',
  'flashcard.stillLearning': '👎 Still learning',
  'flashcard.gotIt': '👍 Got it!',
  'flashcard.hintFlip': 'Use ← → arrow keys to navigate, Space to flip',
  'flashcard.hintRate': 'Rate yourself, or use ← → to navigate',
  'flashcard.done.title': 'Session complete!',
  'flashcard.done.known': '% known',
  'flashcard.done.tryAgain': 'Try again',
  'flashcard.done.backToList': 'Back to list',

  // Flashcard card face labels
  'card.english': 'English',
  'card.translation': 'Translation',
  'card.clickToFlip': 'Click to flip',
  'card.v1': 'V1 — Base form',
  'card.v2': 'V2 — Past simple',
  'card.v3': 'V3 — Past participle',

  // Typing session
  'typing.weakWords': '⚡ Weak words',
  'typing.allWords': 'All words',
  'typing.weakVerbs': '⚡ Weak verbs',
  'typing.allVerbs': 'All verbs',
  'typing.done.title': 'Session complete!',
  'typing.done.correct': '% correct',
  'typing.done.tryAgain': 'Try again',
  'typing.done.backToList': 'Back to list',

  // Typing question
  'typing.q.questionOf': 'Question {n} of {total}',
  'typing.q.whatIs': 'What is the English word for...',
  'typing.q.placeholder': 'Type the English term...',
  'typing.q.correct': 'Correct!',
  'typing.q.correctAnswer': 'Correct answer:',
  'typing.q.check': 'Check',
  'typing.q.next': 'Next',
  'typing.q.seeResults': 'See results',

  // Verb typing question
  'verbTyping.q.v1Label': 'V1 — Base form',
  'verbTyping.q.v2Label': 'V2 — Past simple',
  'verbTyping.q.v3Label': 'V3 — Past participle',
  'verbTyping.q.v2Placeholder': 'Type V2...',
  'verbTyping.q.v3Placeholder': 'Type V3...',
  'verbTyping.q.correct': 'Correct!',
  'verbTyping.q.correctAnswer': 'Correct:',

  // Matching board
  'matching.matched': 'matched',
  'matching.mistake': 'mistake',
  'matching.mistakes': 'mistakes',
  'matching.noMistakes': 'No mistakes yet',
  'matching.english': 'English',
  'matching.translation': 'Translation',

  // Matching page
  'matching.pageTitle': 'Matching — {name}',
  'matching.needMoreWords': 'Need at least 2 words for matching.',
  'matching.instruction': 'Click a word on the left, then its translation on the right.',
  'matching.perfect': 'Perfect match!',
  'matching.roundComplete': 'Round complete!',
  'matching.noMistakesMsg': 'No mistakes — excellent work!',
  'matching.mistakeCount': '{n} mistake',
  'matching.mistakeCount_plural': '{n} mistakes',
  'matching.playAgain': 'Play again',
  'matching.backToList': 'Back to list',

  // Exercise page titles and empty states
  'page.flashcards.title': 'Flashcards — {name}',
  'page.typing.title': 'Typing — {name}',
  'page.noWords': 'No words in this list.',
  'page.noVerbs': 'No verbs in this list.',

  // Tables
  'table.score': 'Score',
  'table.english': 'English',
  'table.translation': 'Translation',
  'table.v1': 'V1 — Base',
  'table.v2': 'V2 — Past simple',
  'table.v3': 'V3 — Past participle',
  'table.meaning': 'Meaning',
  'table.noWords': 'No words yet.',
  'table.noVerbs': 'No verbs yet.',

  // Stat dots
  'stats.mastered': 'mastered',
  'stats.learning': 'learning',
  'stats.needsPractice': 'needs practice',
  'stats.notYetPracticed': 'not yet practiced',
  'statDot.mastered': 'Mastered',
  'statDot.learning': 'Learning',
  'statDot.needsPractice': 'Needs practice',
  'statDot.notYetPracticed': 'Not yet practiced',

  // Edit word list page
  'editWord.addWord': 'Add word',
  'editWord.importFile': 'Import from file',
  'editWord.importImage': 'Import from image',
  'editWord.done': 'Done',
  'editWord.words': 'Words',
  'editWord.clickToEdit': 'Click any cell to edit. Hover a row to reveal the delete button.',

  // Edit verb list page
  'editVerb.addVerb': 'Add verb',
  'editVerb.importFile': 'Import from file',
  'editVerb.importImage': 'Import from image',
  'editVerb.done': 'Done',
  'editVerb.verbs': 'Verbs',
  'editVerb.clickToEdit': 'Click any cell to edit. Hover a row to reveal the delete button.',

  // Import/Export modals
  'modal.export.title': 'Export lists',
  'modal.export.description': 'Select the lists to include in the export file.',
  'modal.export.selectAll': 'Select all',
  'modal.export.wordLists': 'Word Lists',
  'modal.export.verbLists': 'Verb Lists',
  'modal.export.selected': 'Export {n} list',
  'modal.export.selected_plural': 'Export {n} lists',
  'modal.import.title': 'Import lists',
  'modal.import.description': 'Select the lists to import.',
  'modal.import.noLists': 'No lists found in the file.',
  'modal.import.wordLists': 'Word Lists',
  'modal.import.verbLists': 'Verb Lists',
  'modal.import.renamed': '{n} list renamed to avoid conflicts',
  'modal.import.renamed_plural': '{n} lists renamed to avoid conflicts',

  // Upload / drop zones
  'upload.dropFileOr': 'Drop a file here or',
  'upload.dropImageOr': 'Drop an image here or',
  'upload.browse': 'browse',
  'upload.wordFileHint': 'TSV or CSV — one word pair per line',
  'upload.verbFileHint': 'TSV or CSV — columns: v1, v2, v3, translation',
  'upload.imageHint': 'JPG, PNG — printed English words only',
  'upload.verbImageHint': 'Works best with lines like: go / went / gone',
  'upload.scanning': 'Scanning image...',
  'upload.fetchingTranslations': 'Fetching translations... ({done}/{total})',
  'upload.wordsReady': '{n} word ready to import',
  'upload.wordsReady_plural': '{n} words ready to import',
  'upload.verbsReady': '{n} verb ready to import',
  'upload.verbsReady_plural': '{n} verbs ready to import',
  'upload.verbsMissing': '{n} verb missing V2/V3 — fill in or uncheck',
  'upload.verbsMissing_plural': '{n} verbs missing V2/V3 — fill in or uncheck',
  'upload.previewWords': 'Preview — {n} words found',
  'upload.previewVerbs': 'Preview — {n} verbs found',
  'upload.fetchingCell': 'fetching...',
  'upload.translationPlaceholder': 'type translation...',
  'upload.meaningPlaceholder': 'meaning...',
  'upload.scanError': 'Could not scan the image. Try a clearer photo with printed text.',
  'upload.noWordsFound': 'No English words found in the image.',
  'upload.noVerbsFound': 'No verbs found in the image.',
  'upload.suggestedTitle': 'Suggested from built-in table',
  'upload.suggestedHint': 'Italic values are suggestions from the built-in table — verify before importing.',

  // Add word / verb forms
  'form.englishTerm': 'English term',
  'form.translation': 'Translation',
  'form.fetchingSuggestion': 'fetching...',
  'form.useSuggestion': '↑ use this',
  'form.suggestionError': 'Could not fetch suggestion.',
  'form.add': 'Add',
  'form.meaningOptional': 'Meaning (optional)',

  // Word / verb counts
  'count.words': '{n} word',
  'count.words_plural': '{n} words',
  'count.verbs': '{n} verb',
  'count.verbs_plural': '{n} verbs',

  // Share progress
  'share.button': 'Share Progress',
  'share.copied': 'Copied!',
  'share.shared': 'Shared!',
} as const;

const he: { [K in keyof typeof en]: string } = {
  // Navigation
  'nav.vocabulary': 'אוצר מילים',
  'nav.verbForms': 'פעלים',
  'nav.allLists': 'כל הרשימות',
  'nav.allVerbLists': 'כל רשימות הפעלים',

  // Common
  'common.cancel': 'ביטול',
  'common.import': 'ייבוא',
  'common.export': 'ייצוא',
  'common.create': 'צור',
  'common.done': 'סיום',
  'common.study': 'תרגל',
  'common.edit': 'ערוך',
  'common.back': 'חזרה',
  'common.newList': 'רשימה חדשה',
  'common.createList': 'צור רשימה',
  'common.duplicateName': 'רשימה בשם זה כבר קיימת.',
  'common.listNotFound': 'הרשימה לא נמצאה.',

  // Home page
  'home.title': 'רשימות המילים שלי',
  'home.subtitle': 'צור ולמד את אוצר המילים שלך באנגלית',
  'home.modal.title': 'רשימת מילים חדשה',
  'home.modal.placeholder': 'למשל: יחידה 5 — בעלי חיים',
  'home.empty.title': 'אין רשימות מילים עדיין',
  'home.empty.description': 'צור את הרשימה הראשונה שלך כדי להתחיל לתרגל.',

  // Verbs home page
  'verbs.title': 'פעלים',
  'verbs.subtitle': 'תרגול פעלים לא סדירים — V1, V2, V3',
  'verbs.modal.title': 'רשימת פעלים חדשה',
  'verbs.modal.placeholder': 'למשל: פעלים לא סדירים — סט 1',
  'verbs.empty.title': 'אין רשימות פעלים עדיין',
  'verbs.empty.description': 'צור את הרשימה הראשונה שלך כדי להתחיל לתרגל פעלים לא סדירים.',

  // List detail page
  'listDetail.editList': 'ערוך רשימה',
  'listDetail.export': 'ייצוא',
  'listDetail.exercises': 'תרגילים',
  'listDetail.wordList': 'רשימת מילים',
  'listDetail.noWords.title': 'אין מילים ברשימה זו',
  'listDetail.noWords.description': 'הוסף מילים כדי להתחיל לתרגל.',
  'listDetail.addWords': 'הוסף מילים',

  // Verb list detail page
  'verbDetail.editList': 'ערוך רשימה',
  'verbDetail.exercises': 'תרגילים',
  'verbDetail.verbList': 'רשימת פעלים',
  'verbDetail.noVerbs.title': 'אין פעלים ברשימה זו',
  'verbDetail.noVerbs.description': 'הוסף פעלים כדי להתחיל לתרגל.',
  'verbDetail.addVerbs': 'הוסף פעלים',

  // Exercise cards
  'exercise.flashcards': 'כרטיסיות',
  'exercise.flashcards.desc': 'הפוך כרטיסיות לגילוי תרגומים',
  'exercise.matching': 'התאמה',
  'exercise.matching.desc': 'חבר מילים לתרגומיהן',
  'exercise.typing': 'הקלדה',
  'exercise.typing.desc': 'ראה את התרגום, הקלד את המילה באנגלית',
  'exercise.verbFlashcards.desc': 'ראה V1, הפוך לגילוי V2 ו-V3',
  'exercise.verbTyping.desc': 'ראה V1, הקלד V2 ו-V3',

  // Flashcard deck
  'flashcard.prev': 'קודם',
  'flashcard.next': 'הבא',
  'flashcard.shuffle': 'ערבב',
  'flashcard.englishToTranslation': 'אנגלית ← תרגום',
  'flashcard.translationToEnglish': 'תרגום ← אנגלית',
  'flashcard.weakWords': '⚡ מילים חלשות',
  'flashcard.allWords': 'כל המילים',
  'flashcard.weakVerbs': '⚡ פעלים חלשים',
  'flashcard.allVerbs': 'כל הפעלים',
  'flashcard.stillLearning': '👎 עדיין לומד',
  'flashcard.gotIt': '👍 ידעתי!',
  'flashcard.hintFlip': 'השתמש ב-← → לניווט, רווח להפיכה',
  'flashcard.hintRate': 'דרג את עצמך, או השתמש ב-← → לניווט',
  'flashcard.done.title': 'הסשן הסתיים!',
  'flashcard.done.known': '% ידועות',
  'flashcard.done.tryAgain': 'נסה שוב',
  'flashcard.done.backToList': 'חזרה לרשימה',

  // Flashcard card face labels
  'card.english': 'אנגלית',
  'card.translation': 'תרגום',
  'card.clickToFlip': 'לחץ להפיכה',
  'card.v1': 'V1 — צורת בסיס',
  'card.v2': 'V2 — עבר פשוט',
  'card.v3': 'V3 — שם הפועל',

  // Typing session
  'typing.weakWords': '⚡ מילים חלשות',
  'typing.allWords': 'כל המילים',
  'typing.weakVerbs': '⚡ פעלים חלשים',
  'typing.allVerbs': 'כל הפעלים',
  'typing.done.title': 'הסשן הסתיים!',
  'typing.done.correct': '% נכון',
  'typing.done.tryAgain': 'נסה שוב',
  'typing.done.backToList': 'חזרה לרשימה',

  // Typing question
  'typing.q.questionOf': 'שאלה {n} מתוך {total}',
  'typing.q.whatIs': '...מה המילה באנגלית עבור',
  'typing.q.placeholder': '...הקלד את המילה באנגלית',
  'typing.q.correct': '!נכון',
  'typing.q.correctAnswer': ':התשובה הנכונה',
  'typing.q.check': 'בדוק',
  'typing.q.next': 'הבא',
  'typing.q.seeResults': 'ראה תוצאות',

  // Verb typing question
  'verbTyping.q.v1Label': 'V1 — צורת בסיס',
  'verbTyping.q.v2Label': 'V2 — עבר פשוט',
  'verbTyping.q.v3Label': 'V3 — שם הפועל',
  'verbTyping.q.v2Placeholder': '...הקלד V2',
  'verbTyping.q.v3Placeholder': '...הקלד V3',
  'verbTyping.q.correct': '!נכון',
  'verbTyping.q.correctAnswer': ':נכון',

  // Matching board
  'matching.matched': 'הותאמו',
  'matching.mistake': 'טעות',
  'matching.mistakes': 'טעויות',
  'matching.noMistakes': 'אין טעויות עדיין',
  'matching.english': 'אנגלית',
  'matching.translation': 'תרגום',

  // Matching page
  'matching.pageTitle': 'התאמה — {name}',
  'matching.needMoreWords': 'צריך לפחות 2 מילים להתאמה.',
  'matching.instruction': 'לחץ על מילה משמאל, ואחר כך על תרגומה מימין.',
  'matching.perfect': 'התאמה מושלמת!',
  'matching.roundComplete': 'סיבוב הושלם!',
  'matching.noMistakesMsg': 'אין טעויות — עבודה מצוינת!',
  'matching.mistakeCount': 'טעות {n}',
  'matching.mistakeCount_plural': '{n} טעויות',
  'matching.playAgain': 'שחק שוב',
  'matching.backToList': 'חזרה לרשימה',

  // Exercise page titles and empty states
  'page.flashcards.title': 'כרטיסיות — {name}',
  'page.typing.title': 'הקלדה — {name}',
  'page.noWords': 'אין מילים ברשימה זו.',
  'page.noVerbs': 'אין פעלים ברשימה זו.',

  // Tables
  'table.score': 'ניקוד',
  'table.english': 'אנגלית',
  'table.translation': 'תרגום',
  'table.v1': 'V1 — בסיס',
  'table.v2': 'V2 — עבר פשוט',
  'table.v3': 'V3 — שם הפועל',
  'table.meaning': 'משמעות',
  'table.noWords': '.אין מילים עדיין',
  'table.noVerbs': '.אין פעלים עדיין',

  // Stat dots
  'stats.mastered': 'שולט',
  'stats.learning': 'לומד',
  'stats.needsPractice': 'צריך תרגול',
  'stats.notYetPracticed': 'טרם תורגל',
  'statDot.mastered': 'שולט',
  'statDot.learning': 'לומד',
  'statDot.needsPractice': 'צריך תרגול',
  'statDot.notYetPracticed': 'טרם תורגל',

  // Edit word list page
  'editWord.addWord': 'הוסף מילה',
  'editWord.importFile': 'ייבוא מקובץ',
  'editWord.importImage': 'ייבוא מתמונה',
  'editWord.done': 'סיום',
  'editWord.words': 'מילים',
  'editWord.clickToEdit': 'לחץ על תא לעריכה. העבר עכבר על שורה לגילוי כפתור המחיקה.',

  // Edit verb list page
  'editVerb.addVerb': 'הוסף פועל',
  'editVerb.importFile': 'ייבוא מקובץ',
  'editVerb.importImage': 'ייבוא מתמונה',
  'editVerb.done': 'סיום',
  'editVerb.verbs': 'פעלים',
  'editVerb.clickToEdit': 'לחץ על תא לעריכה. העבר עכבר על שורה לגילוי כפתור המחיקה.',

  // Import/Export modals
  'modal.export.title': 'ייצוא רשימות',
  'modal.export.description': 'בחר את הרשימות לכלול בקובץ הייצוא.',
  'modal.export.selectAll': 'בחר הכל',
  'modal.export.wordLists': 'רשימות מילים',
  'modal.export.verbLists': 'רשימות פעלים',
  'modal.export.selected': 'ייצוא {n} רשימה',
  'modal.export.selected_plural': 'ייצוא {n} רשימות',
  'modal.import.title': 'ייבוא רשימות',
  'modal.import.description': 'בחר את הרשימות לייבוא.',
  'modal.import.noLists': 'לא נמצאו רשימות בקובץ.',
  'modal.import.wordLists': 'רשימות מילים',
  'modal.import.verbLists': 'רשימות פעלים',
  'modal.import.renamed': '{n} רשימה שונתה למניעת כפילויות',
  'modal.import.renamed_plural': '{n} רשימות שונו למניעת כפילויות',

  // Upload / drop zones
  'upload.dropFileOr': 'הפל קובץ כאן או',
  'upload.dropImageOr': 'הפל תמונה כאן או',
  'upload.browse': 'עיין',
  'upload.wordFileHint': 'TSV או CSV — זוג מילים בכל שורה',
  'upload.verbFileHint': 'TSV או CSV — עמודות: v1, v2, v3, תרגום',
  'upload.imageHint': 'JPG, PNG — מילים מודפסות באנגלית בלבד',
  'upload.verbImageHint': 'עובד הכי טוב עם שורות כמו: go / went / gone',
  'upload.scanning': 'סורק תמונה...',
  'upload.fetchingTranslations': 'מאחזר תרגומים... ({done}/{total})',
  'upload.wordsReady': 'מילה {n} מוכנה לייבוא',
  'upload.wordsReady_plural': '{n} מילים מוכנות לייבוא',
  'upload.verbsReady': 'פועל {n} מוכן לייבוא',
  'upload.verbsReady_plural': '{n} פעלים מוכנים לייבוא',
  'upload.verbsMissing': 'פועל {n} חסר V2/V3 — מלא או בטל',
  'upload.verbsMissing_plural': '{n} פעלים חסרים V2/V3 — מלא או בטל',
  'upload.previewWords': 'תצוגה מקדימה — {n} מילים נמצאו',
  'upload.previewVerbs': 'תצוגה מקדימה — {n} פעלים נמצאו',
  'upload.fetchingCell': 'מאחזר...',
  'upload.translationPlaceholder': 'הקלד תרגום...',
  'upload.meaningPlaceholder': 'משמעות...',
  'upload.scanError': 'לא ניתן לסרוק את התמונה. נסה תמונה ברורה יותר עם טקסט מודפס.',
  'upload.noWordsFound': 'לא נמצאו מילים באנגלית בתמונה.',
  'upload.noVerbsFound': 'לא נמצאו פעלים בתמונה.',
  'upload.suggestedTitle': 'הצעה מהטבלה המובנית',
  'upload.suggestedHint': 'ערכים נטויים הם הצעות מהטבלה המובנית — אמת לפני הייבוא.',

  // Add word / verb forms
  'form.englishTerm': 'מונח באנגלית',
  'form.translation': 'תרגום',
  'form.fetchingSuggestion': 'מאחזר...',
  'form.useSuggestion': '↑ השתמש בזה',
  'form.suggestionError': 'לא ניתן לאחזר הצעה.',
  'form.add': 'הוסף',
  'form.meaningOptional': 'משמעות (אופציונלי)',

  // Word / verb counts
  'count.words': 'מילה {n}',
  'count.words_plural': '{n} מילים',
  'count.verbs': 'פועל {n}',
  'count.verbs_plural': '{n} פעלים',

  // Share progress
  'share.button': 'שתף התקדמות',
  'share.copied': 'הועתק!',
  'share.shared': 'שותף!',
};

export type TranslationKey = keyof typeof en;
export type TranslationsDict = Record<TranslationKey, string>;

export const translations: Record<Lang, TranslationsDict> = { en, he };
