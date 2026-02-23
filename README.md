# Spaceship Monster

A minimal, SEO-friendly landing site for spaceship.monster.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Deployment to Vercel

### First-time setup

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js configuration
6. Click "Deploy"

### Custom domain (spaceship.monster)

1. In your Vercel project, go to Settings → Domains
2. Add `spaceship.monster` as a domain
3. Vercel will provide DNS records to add

#### Cloudflare DNS configuration

Add these records in Cloudflare DNS:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | spaceship.monster | cname.vercel-dns.com | Proxied (orange cloud) |

For the root domain (`spaceship.monster`), use the CNAME record above (Vercel supports CNAME flattening).

4. After adding DNS records, click "Verify" in Vercel
5. Wait for SSL certificate to provision (usually a few minutes)

### Environment variables

No environment variables required for this basic setup.

## Project Structure

```
app/
├── layout.tsx       # Root layout with metadata
├── page.tsx         # Home page
├── tools/
│   └── page.tsx     # Tools list page (placeholder)
├── blog/
│   └── page.tsx     # Blog list page (placeholder)
├── robots.ts        # robots.txt configuration
└── sitemap.ts       # sitemap.xml configuration
```
