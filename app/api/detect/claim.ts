// lib/claim.ts
export function summarizeClaim(ocrText: string): string {
  // naive summary for hackathon (regex or first 200 chars)
  const clean = ocrText.replace(/\s+/g, ' ').trim()
  return clean.length > 200 ? clean.slice(0, 200) + '…' : clean
}
