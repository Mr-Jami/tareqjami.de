# tareqjami.de

Personal one-page developer profile for Tareq Jami. Built with [Astro](https://astro.build/) and deployed to [Netlify](https://www.netlify.com/).

## Status
✅ One-page profile generated from the CV, with a light/dark theme toggle and German/English language toggle (both persisted to `localStorage`).

Content lives in `src/lib/i18n.ts` (bilingual data + render helpers) and is server-rendered in `src/pages/index.astro`, so the page works without JavaScript and is SEO-friendly. The downloadable CV lives at `public/tareq-jami-cv.pdf` (served at `/tareq-jami-cv.pdf`); to update it, replace that file.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure
```
.
├── public/                 # static files served as-is (e.g. tareq-jami-cv.pdf)
├── src/
│   ├── lib/i18n.ts         # bilingual content + render helpers
│   ├── styles/global.css   # styles (theme tokens, layout)
│   └── pages/index.astro   # the one-page profile
├── astro.config.mjs
├── netlify.toml            # Netlify build config
└── package.json
```

## Contact form
The contact section is a [Netlify Forms](https://docs.netlify.com/forms/setup/) form (`name="contact"`), detected automatically from the built HTML. It works without JavaScript (POSTs and redirects to `/success`); with JS it submits via `fetch` and shows an inline message. A honeypot (`bot-field`) guards against spam.

After the first deploy: enable the form in **Netlify → Forms**, and add a notification (**Forms → Settings → Form notifications**) to get submissions by email. Submissions are also stored in the Netlify dashboard.

## Legal pages
- `/impressum` — Impressum (§ 5 DDG), bilingual DE/EN.
- `/datenschutz` — Datenschutzerklärung / privacy policy, bilingual DE/EN, covering Netlify hosting + Netlify Forms as processor, server logs, local storage, GDPR legal bases and data-subject rights. German is the authoritative version; review with a lawyer before relying on it.

## Deploy
Connected to Netlify — pushes to `main` trigger a build (`npm run build`) and publish the `dist/` folder.

## Domains
Primary (canonical): **tareqjami.de**. Aliases redirect to it with a 301: **jami.cc**, **jami-it.de**, **tareqjami.com** (and any `www.` host).

Redirects are defined in `netlify.toml`; the page also sets `<link rel="canonical">` to `https://tareqjami.de/` so only the primary domain is indexed. A sitemap (`@astrojs/sitemap`, output `/sitemap-index.xml`) and `public/robots.txt` are generated/served for SEO.

To finish hookup in Netlify (**Site → Domain management**):
1. Add all four domains as custom domains; set `tareqjami.de` as **Primary domain**.
2. Point each registrar's DNS at Netlify:
   - **Apex** (`tareqjami.de`, `jami.cc`, `jami-it.de`, `tareqjami.com`): `A` record → `75.2.60.5` (or use Netlify DNS / an `ALIAS`/`ANAME` to the site's `*.netlify.app`).
   - **www**: `CNAME` → `<your-site>.netlify.app`.
3. Netlify auto-provisions HTTPS (Let's Encrypt) for every attached domain.
