import { createWorker } from 'tesseract.js';

export type OcrProgressCallback = (progress: number) => void;

export async function extractWordsFromImage(
  file: File,
  onProgress?: OcrProgressCallback
): Promise<string[]> {
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);
    return parseOcrText(data.text);
  } finally {
    await worker.terminate();
  }
}

function parseOcrText(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/[^a-zA-Z\s'-]/g, '').trim())
    .filter((line) => line.length >= 2)
    .filter((line) => /[a-zA-Z]/.test(line));
}
