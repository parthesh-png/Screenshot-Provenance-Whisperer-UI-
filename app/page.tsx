'use client'
import { useState } from 'react'

export default function Home(){
  const [file,setFile] = useState<File|null>(null)
  const [uploadId,setUploadId] = useState<string>('')
  const [platform,setPlatform] = useState<string>('')
  const [verdict,setVerdict] = useState<string>('')
  const [ref,setRef] = useState<any>(null)
  const [cardUrl,setCardUrl] = useState<string>('')

  async function upload(){
    if(!file) return
    const fd = new FormData(); fd.append('file', file)
    const r = await fetch('/api/ingest',{ method:'POST', body: fd })
    const j = await r.json(); setUploadId(j.uploadId)
  }
  async function detect(){
    const r = await fetch('/api/detect',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ uploadId })})
    const j = await r.json(); setPlatform(j.platform)
  }
  async function verify(){
    const r = await fetch('/api/verify',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ uploadId })})
    const j = await r.json(); setVerdict(j.verdict); setRef(j.reference)
  }
  async function publish(size:'square'|'story', lang:'en'|'hi'){
    const r = await fetch('/api/publish',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ uploadId, size, lang })})
    const j = await r.json(); setCardUrl(j.url)
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Screenshot Provenance Whisperer</h1>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <div className="flex flex-wrap gap-2">
          <button onClick={upload} className="px-4 py-2 rounded-xl bg-blue-600">1) Upload</button>
          <button onClick={detect} disabled={!uploadId} className="px-4 py-2 rounded-xl bg-emerald-600 disabled:opacity-40">2) Detect</button>
          <button onClick={verify} disabled={!uploadId} className="px-4 py-2 rounded-xl bg-purple-600 disabled:opacity-40">3) Verify</button>
          <button onClick={()=>publish('square','en')} disabled={!verdict} className="px-4 py-2 rounded-xl bg-fuchsia-600 disabled:opacity-40">4) Publish EN</button>
          <button onClick={()=>publish('square','hi')} disabled={!verdict} className="px-4 py-2 rounded-xl bg-pink-600 disabled:opacity-40">Publish HI</button>
        </div>

        <div className="bg-neutral-900 p-4 rounded-xl">
          <p>Upload ID: {uploadId||'—'}</p>
          <p>Platform: <b>{platform||'—'}</b></p>
          <p>Verdict: <b>{verdict||'—'}</b></p>
          {ref && (
            <div className="text-sm text-neutral-300 mt-2">
              <div>Ref: {ref.title} ({ref.outlet||new URL(ref.url).host})</div>
              <div>Published: {ref.published_at ? new Date(ref.published_at).toDateString() : '—'}</div>
              <a className="underline" href={ref.url} target="_blank">Open Source</a>
            </div>
          )}
        </div>

        {cardUrl && (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardUrl} alt="card" className="rounded-xl border border-neutral-800" />
            <div className="flex gap-3">
              <a className="px-4 py-2 rounded-xl bg-neutral-800" href={cardUrl} download>Download</a>
              <a className="px-4 py-2 rounded-xl bg-neutral-800"
                href={`whatsapp://send?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + cardUrl : cardUrl)}`}>
                Share WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
