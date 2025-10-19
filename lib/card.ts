import sharp from 'sharp'
import QRCode from 'qrcode'

export async function composeCard(base: Buffer, opts:{
  status: 'true'|'out_of_context'|'unclear',
  source: string,
  firstSeen?: string,
  claim: string,
  lang: 'en'|'hi',
  refUrl: string,
  size: 'square'|'story'
}){
  const width = 1080
  const height = opts.size==='story'?1920:1080
  const bannerColor = opts.status==='out_of_context'? '#8a1d1d' : opts.status==='true'? '#166534' : '#3f3f46'

  const qrData = await QRCode.toDataURL(opts.refUrl)
  const qrBuf = Buffer.from(qrData.split(',')[1],'base64')

  const baseResized = await sharp(base).resize(width,height,{fit:'cover'}).jpeg().toBuffer()
  const banner = await sharp({create:{width,height:260,channels:3,background: bannerColor}}).png().toBuffer()
  const composed = await sharp(baseResized).composite([
    { input: banner, top: height-260, left:0 },
    { input: qrBuf, top: height-240, left: width-240 }
  ]).toBuffer()

  const statusLabel = opts.lang==='hi' ? 'स्थिति' : 'Status'
  const sourceLabel = opts.lang==='hi' ? 'स्रोत' : 'Source'
  const seenLabel   = opts.lang==='hi' ? 'पहली बार देखा गया' : 'First seen'
  const claimShort = (opts.claim||'').replace(/\s+/g,' ').slice(0,90)

  const svg = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>.h{fill:#fff;font-size:40px;font-family:Arial;font-weight:700}.b{fill:#fff;font-size:30px;font-family:Arial}</style>
    <text x="40" y="${height-210}" class="h">${statusLabel}: ${opts.status.replace('_',' ')}</text>
    <text x="40" y="${height-165}" class="b">${claimShort}</text>
    <text x="40" y="${height-120}" class="b">${sourceLabel}: ${opts.source}</text>
    <text x="40" y="${height-75}"  class="b">${seenLabel}: ${opts.firstSeen || '—'}</text>

  </svg>`)
  return sharp(composed).composite([{ input: svg, top:0, left:0 }]).jpeg({quality:90}).toBuffer()
}
