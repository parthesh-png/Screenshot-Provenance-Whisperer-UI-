export function detectPlatform(ocr: string){
  const t = ocr.toLowerCase()
  if(/retweet|likes|reply|@\w+/.test(t)) return 'twitter'
  if(/reel|followers|following|instagram/.test(t)) return 'instagram'
  if(/subscribe|views|ago|channel/.test(t)) return 'youtube'
  if(/breaking|opinion|live|by\s/.test(t)) return 'news'
  return 'unknown'
}
