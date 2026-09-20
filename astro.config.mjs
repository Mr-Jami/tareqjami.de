// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site deployed to Netlify. `site` is the canonical domain and is
// used to generate absolute URLs in the sitemap.
//
// Every page is built once per language: English at the root, German under
// /de/ (src/pages/[...lang]). The sitemap's i18n option pairs the two
// versions of each page as hreflang alternates.
export default defineConfig({
  site: 'https://tareqjami.de',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/success/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', de: 'de' } },
    }),
  ],
});
