// MyMemory free translation API — no API key required (500 words/day per IP)
// Docs: https://mymemory.translated.net/doc/spec.php

export async function translateToHebrew(term: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=en|he`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation request failed');
  const data = await res.json();
  const translation: string = data?.responseData?.translatedText;
  if (!translation) throw new Error('No translation returned');
  return translation;
}
