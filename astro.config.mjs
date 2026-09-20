// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { lastModified, neutralPath } from './src/lib/lastmod.ts';

// Static site deployed to Netlify. `site` is the canonical domain and is
// used to generate absolute URLs in the sitemap.
//
// Every page is built once per language: English at the root, German under
// /de/ (src/pages/[...lang]). The sitemap's i18n option pairs the two
// versions of each page as hreflang alternates, and <lastmod> is the last
// content commit of each page (src/lib/lastmod.ts), never the build time.
const SITE = 'https://tareqjami.de';

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/success/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', de: 'de' } },
      // The downloadable CVs are worth indexing on their own.
      customPages: [`${SITE}/tareq-jami-cv-en.pdf`, `${SITE}/tareq-jami-cv-de.pdf`],
      serialize(item) {
        const modified = lastModified(neutralPath(item.url, ['/de']));
        return modified ? { ...item, lastmod: modified.toISOString() } : item;
      },
    }),
  ],
});
