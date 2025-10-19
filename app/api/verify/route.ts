import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function pickKeywords(text:string){
  return (text||'')
   .toLowerCase()
   .replace(/[^a-z0-9\s]/g,' ')
   .split(/\s+/).filter(w=>w.length>4).slice(0,10).join(' ')
}

export async function POST(req: NextRequest){
  const { uploadId } = await req.json()
  const up = await pool.query('select id, ocr_text, platform_guess from uploads where id=$1',[uploadId])
  if(!up.rowCount) return NextResponse.json({error:'Not found'}, {status:404})
  const ocr = up.rows[0].ocr_text||''
  const query = `%${pickKeywords(ocr)}%`

  const refs = await pool.query(`select id,title,outlet,url,summary,published_at from referenceset
                                 where title ilike $1 or summary ilike $1
                                 order by published_at desc limit 5`,[query])

  let verdict: 'true'|'out_of_context'|'unclear' = 'unclear'
  let ref = refs.rows[0] || null
  if(ref) verdict = 'out_of_context'

  await pool.query('update uploads set verdict=$1, reference_id=$2, status=$3 where id=$4',[
    verdict, ref?.id || null, 'verified', uploadId
  ])

  return NextResponse.json({ verdict, reference: ref })
}
