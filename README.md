# Yojana Matcher 🇮🇳

AI-powered government scheme eligibility checker for Indian citizens. Built with Next.js 15 App Router + Gemini 2.5 Flash.

## Stack
- **Next.js 15** (App Router, SSR + Client Islands)
- **TypeScript**
- **Tailwind CSS 3**
- **Google Gemini 2.5 Flash** (`@google/generative-ai`)
- **Lucide React** (icons)

## Project Structure

```
├── app/
│   ├── _components/
│   │   └── YojanaForm.tsx     # Interactive form (Client Component)
│   ├── api/match/
│   │   └── route.ts           # POST /api/match — Gemini + scheme filter
│   ├── globals.css
│   ├── icon.tsx               # Dynamic favicon
│   ├── layout.tsx             # Root layout + metadata + JSON-LD
│   ├── page.tsx               # Server Component (SSR shell)
│   ├── robots.ts              # Robots.txt
│   └── sitemap.ts             # Sitemap.xml
├── lib/
│   └── schemes.ts             # Mock DB + matchSchemes() filter
├── .env.local                 # GEMINI_API_KEY (do NOT commit)
└── next.config.ts
```

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Add the environment variable in Vercel dashboard:
   - `GEMINI_API_KEY` = your key
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`
4. Deploy.

> ⚠️ Never commit `.env.local` — it's gitignored by default.

## Adding More Schemes

Edit `lib/schemes.ts` — add an object to the `schemes` array following the existing pattern. The `matchSchemes()` function auto-picks it up.

## Disclaimer

This tool aggregates publicly available information about Indian Central Government schemes. It is **not** an official government portal. Always verify eligibility on the official `.gov.in` portal before applying.
