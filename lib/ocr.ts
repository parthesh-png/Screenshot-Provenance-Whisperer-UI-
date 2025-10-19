import Tesseract from 'tesseract.js'
import { translate } from '@vitalets/google-translate-api'

export async function runOCR(buf: Buffer) {
  // 1️⃣ OCR multiple languages (English + Hindi + others)
  const { data } = await Tesseract.recognize(buf, 'eng+hin+tam+tel+ben')
  const originalText = data.text.trim()

  if (!originalText) return { text: '', lang: 'unknown' }

  try {
    // 2️⃣ Translate the text
    const result = await translate(originalText, { to: 'en' })

    // result may not have precise TypeScript typings for `from`; access safely
    const translatedText = result.text
    const detectedLang = ((result as any)?.from?.language?.iso) ?? 'unknown'  // e.g. "hi" for Hindi

    return {
      text: translatedText,
      lang: detectedLang
    }
  } catch (error) {
    console.error('Translation failed:', error)
    // fallback
    return { text: originalText, lang: 'unknown' }
  }
}
