import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { Pool } from 'pg'
import { composeCard } from '@/lib/card'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest){
  const { uploadId, lang='en', size='square' } = await req.json()
  const q = await pool.query(`
    select u.filename, u.ocr_text, u.verdict, r.title, r.outlet, r.url, r.published_at
    from uploads u left join referenceset r on u.reference_id=r.id
    where u.id=$1`,[uploadId])
  if(!q.rowCount) return NextResponse.json({error:'Not found'}, {status:404})
  const row = q.rows[0]

  const src = path.join(process.cwd(),'public','uploads',row.filename)
  const buf = await readFile(src)
  const card = await composeCard(buf,{
    status: (row.verdict||'unclear'),
    source: row.outlet ? `${row.outlet}` : (new URL(row.url||'https://example.com')).host,
    firstSeen: row.published_at ? new Date(row.published_at).toDateString() : undefined,
    claim: row.ocr_text||'',
    lang, size,
    refUrl: row.url||'https://example.com'
  })

  const outName = `${Date.now()}_card_${size}.jpg`
  const outPath = path.join(process.cwd(),'public','cards',outName)
  await writeFile(outPath, card)
  await pool.query('insert into cards(upload_id, status, lang, image_url) values ($1,$2,$3,$4)',[
    uploadId, row.verdict||'unclear', lang, `/cards/${outName}`
  ])
  return NextResponse.json({ url: `/cards/${outName}` })
}
