// schema.org nodes for the things the site is actually about, built from the
// same data that renders the pages. Base.astro emits the Person/Organization/
// WebSite/WebPage graph on every page; pages add these nodes for their own
// content. Server-side only.
import { data, type Lang } from './i18n';

export const SITE = 'https://tareqjami.de';
export const PERSON_ID = `${SITE}/#person`;

const absolute = (path: string) => (path.startsWith('http') ? path : SITE + path);

/** Open-source projects (SoftwareSourceCode) and recorded talks (VideoObject). */
export function homepageNodes(lang: Lang): object[] {
  const d = data[lang];
  // Only projects with a public repository; the app listed there is described
  // by its own site (simpleshottimer.com).
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
