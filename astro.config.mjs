// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site deployed to Netlify. `site` is the canonical domain and is
// used to generate absolute URLs in the sitemap.
export default defineConfig({
  site: 'https://tareqjami.de',
  integrations: [sitemap({ filter: (page) => !page.includes('/success') })],
});
