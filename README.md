# tareqjami.de

Personal one-page developer profile for Tareq Jami. Built with [Astro](https://astro.build/) and deployed to [Netlify](https://www.netlify.com/).

## Status
✅ One-page profile generated from the CV, in English and German, with a light/dark theme toggle (persisted to `localStorage`).

Content lives in `src/lib/i18n.ts` (bilingual data + render helpers). Every page is built once per language — English at the root (`/`, `/impressum/`, …) and German under `/de/` — from the pages in `src/pages/[...lang]/`, so both languages are static HTML that works without JavaScript and is crawlable. Each page links its other-language version via `<link rel="alternate" hreflang>` and the sitemap; the EN/DE switch in the header is a plain link between the two URLs. The downloadable CVs (`public/tareq-jami-cv-en.pdf`, `public/tareq-jami-cv-de.pdf`) are generated from the same data: after changing `i18n.ts`, run `npm run cv` (needs Microsoft Edge, prints headless) and commit the PDFs.

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
├── public/                 # static files served as-is (e.g. tareq-jami-cv-en.pdf)
├── scripts/build-cv.mjs    # renders the CV PDFs from src/lib/i18n.ts
├── scripts/build-images.mjs # writes the avatar variants + OG image from src/assets/profile.png
├── src/
│   ├── assets/profile.png  # avatar source (npm run images → public/profile-*, og-image.png)
│   ├── layouts/Base.astro  # head (canonical, hreflang, JSON-LD), header, footer
│   ├── lib/i18n.ts         # bilingual content + render helpers
│   ├── lib/routes.ts       # getStaticPaths: one build per language
│   ├── styles/global.css   # styles (theme tokens, layout)
│   └── pages/[...lang]/    # index, impressum, datenschutz, success, apps/simpleshottimer
├── astro.config.mjs
├── netlify.toml            # Netlify build config
└── package.json
```

## Contact form
The contact section is a [Netlify Forms](https://docs.netlify.com/forms/setup/) form (`name="contact"`), detected automatically from the built HTML. It works without JavaScript (POSTs and redirects to `/success/` or `/de/success/`); with JS it submits via `fetch` and shows an inline message. A honeypot (`bot-field`) guards against spam.

After the first deploy: enable the form in **Netlify → Forms**, and add a notification (**Forms → Settings → Form notifications**) to get submissions by email. Submissions are also stored in the Netlify dashboard.

## Legal pages
- `/impressum/` (EN) and `/de/impressum/` (DE) — Impressum (§ 5 DDG).
- `/datenschutz/` (EN) and `/de/datenschutz/` (DE) — Datenschutzerklärung / privacy policy, covering Netlify hosting + Netlify Forms as processor, server logs, local storage, GDPR legal bases and data-subject rights. German is the authoritative version; review with a lawyer before relying on it.

## Deploy
Connected to Netlify — pushes to `main` trigger a build (`npm run build`) and publish the `dist/` folder.

## Domains
Primary (canonical): **tareqjami.de**. Aliases redirect to it with a 301: **jami.cc**, **jami-it.de**, **tareqjami.com** (and any `www.` host).

Short links on the primary domain also live in `netlify.toml` (e.g. `/talks/strong-types` → the YouTube recording of the HH.js talk). They use a 302 so the target can change later; add one `[[redirects]]` block per link.

Redirects are defined in `netlify.toml`; every page also sets a self-referencing `<link rel="canonical">` on `https://tareqjami.de` so only the primary domain is indexed. A sitemap (`@astrojs/sitemap`, output `/sitemap-index.xml`) and `public/robots.txt` are generated/served for SEO.

To finish hookup in Netlify (**Site → Domain management**):
1. Add all four domains as custom domains; set `tareqjami.de` as **Primary domain**.
2. Point each registrar's DNS at Netlify:
   - **Apex** (`tareqjami.de`, `jami.cc`, `jami-it.de`, `tareqjami.com`): `A` record → `75.2.60.5` (or use Netlify DNS / an `ALIAS`/`ANAME` to the site's `*.netlify.app`).
   - **www**: `CNAME` → `<your-site>.netlify.app`.
3. Netlify auto-provisions HTTPS (Let's Encrypt) for every attached domain.
