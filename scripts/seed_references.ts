import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const refs = [
  {
    title: 'WHO: COVID myth-busting (2020)',
    outlet: 'WHO',
    url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
    language: 'en',
    published_at: '2020-03-15T00:00:00Z',
    summary: 'WHO resource debunking common misinformation.'
  },
  {
    title: 'PIB Fact Check portal',
    outlet: 'PIB',
    url: 'https://pib.gov.in/FactCheck.aspx',
    language: 'en',
    published_at: '2019-01-01T00:00:00Z',
    summary: 'Indian government fact-check portal.'
  },
  {
    title: 'UNICEF: Vaccine facts for parents',
    outlet: 'UNICEF',
    url: 'https://www.unicef.org/immunization',
    language: 'en',
    published_at: '2021-05-20T00:00:00Z',
    summary: 'Trusted vaccine guidance for families.'
  }
]

async function main(){
  for (const r of refs) {
    await pool.query(
      `insert into referenceset(title,outlet,url,language,published_at,summary)
       values ($1,$2,$3,$4,$5,$6) on conflict do nothing`,
      [r.title,r.outlet,r.url,r.language,r.published_at,r.summary]
    )
  }
  console.log('Seeded reference rows')
  await pool.end()
}
main().catch(e => { console.error(e); process.exit(1) })
