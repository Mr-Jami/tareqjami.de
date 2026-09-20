// schema.org nodes for the things the site is actually about, built from the
// same data that renders the pages. Base.astro emits the Person/Organization/
// WebSite/WebPage graph on every page; pages add these nodes for their own
// content. Server-side only.
import { data, localePath, type Lang } from './i18n';

export const SITE = 'https://tareqjami.de';
export const PERSON_ID = `${SITE}/#person`;

const absolute = (path: string) => (path.startsWith('http') ? path : SITE + path);

/** Open-source projects (SoftwareSourceCode) and recorded talks (VideoObject). */
export function homepageNodes(lang: Lang): object[] {
  const d = data[lang];
  // Only projects with a public repository; the app listed there has its own
  // SoftwareApplication node on its landing page.
  const projects = d.opensource
    .filter((p) => p.repo)
    .map((p) => ({
      '@type': 'SoftwareSourceCode',
      name: p.name,
      url: absolute(p.url),
      codeRepository: p.repo,
      description: p.bullets[0],
      ...(p.language && { programmingLanguage: p.language }),
      author: { '@id': PERSON_ID },
    }));
  const talks = d.talks.map((t) => ({
    '@type': 'VideoObject',
    name: t.title,
    description: t.description,
    thumbnailUrl: absolute(t.image),
    uploadDate: t.uploadDate,
    duration: `PT${t.durationMinutes}M`,
    url: t.url,
    embedUrl: t.url.replace('watch?v=', 'embed/'),
    inLanguage: lang,
    author: { '@id': PERSON_ID },
  }));
  return [...projects, ...talks];
}

/** The Simple Shot Timer Android app. */
export function appNode(opts: {
  path: string;
  lang: Lang;
  description: string;
  playUrl: string;
  icon: string;
  version: string;
  datePublished: string; // of the current version, YYYY-MM-DD
  screenshots: string[];
  repo: string;
}) {
  return {
    '@type': 'SoftwareApplication',
    name: 'Simple Shot Timer',
    url: SITE + localePath(opts.lang, opts.path),
    description: opts.description,
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Android',
    softwareVersion: opts.version,
    datePublished: opts.datePublished,
    installUrl: opts.playUrl,
    image: absolute(opts.icon),
    screenshot: opts.screenshots.map(absolute),
    isAccessibleForFree: true,
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    sameAs: [opts.playUrl, opts.repo],
    inLanguage: ['en', 'de', 'fr', 'es', 'ru'],
    author: { '@id': PERSON_ID },
    // Free app; no aggregateRating until there are real Play Store ratings.
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };
}
