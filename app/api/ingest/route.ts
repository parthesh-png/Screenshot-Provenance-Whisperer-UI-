import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Pool } from 'pg'
import { runOCR } from '@/lib/ocr'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest){
  const form = await req.formData()
  const file = form.get('file') as File
  if(!file) return NextResponse.json({error:'No file'}, {status:400})

  const filename = `${Date.now()}_${file.name}`
  const buf = Buffer.from(await file.arrayBuffer())
  const out = path.join(process.cwd(),'public','uploads',filename)
  await writeFile(out, buf)

  const ocr = await runOCR(buf)
  const { rows } = await pool.query(
    `insert into uploads(filename, ocr_text, status) values ($1,$2,'ingested') returning id`,
    [filename, ocr]
  )
  return NextResponse.json({ uploadId: rows[0].id, filename })
}
