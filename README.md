# Screenshot Provenance Whisperer
Makes the correction travel with the screenshot.

## Quickstart
1) Create a Supabase project and run the schema from the hackathon doc.
2) Copy `.env.example` to `.env.local` and fill `DATABASE_URL` from Supabase.
3) Install deps: `npm install`
4) Seed refs: `npm run seed` (or `npx ts-node scripts/seed_references.ts`)
5) Run dev: `npm run dev` → open http://localhost:3000

## Flow
Upload → Detect → Verify → Publish → Download card
