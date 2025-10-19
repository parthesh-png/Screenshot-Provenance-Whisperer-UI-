import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { detectPlatform } from '@/lib/detector'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest){
  const { uploadId } = await req.json()
  const q = await pool.query('select id, ocr_text from uploads where id=$1',[uploadId])
  if(!q.rowCount) return NextResponse.json({error:'Not found'}, {status:404})

  const platform = detectPlatform(q.rows[0].ocr_text||'')
  await pool.query('update uploads set platform_guess=$1 where id=$2',[platform, uploadId])
  return NextResponse.json({ platform })
}
