// Last content change per page, read from git at build time. Used for the
// sitemap's <lastmod> and the ProfilePage's dateModified. Stamping every URL
// with the build time would be worse than nothing (search engines discount
// uniform, machine-generated dates), so each page maps to the source files
// that carry its content, and the date is the last commit touching them.
//
// Returns undefined (→ the field is omitted) when git history is not
// available, e.g. in a shallow clone whose only commit is the tip.
import { execFileSync } from 'node:child_process';

// Language-neutral path → the files whose commits count as content changes.
const PAGE_SOURCES: Record<string, string[]> = {
  '/': ['src/lib/i18n.ts', 'src/pages/[...lang]/index.astro'],
  '/impressum/': ['src/pages/[...lang]/impressum.astro'],
  '/datenschutz/': ['src/pages/[...lang]/datenschutz.astro'],
  '/apps/simpleshottimer/': ['src/pages/[...lang]/apps/simpleshottimer.astro'],
  '/tareq-jami-cv-en.pdf': ['public/tareq-jami-cv-en.pdf'],
  '/tareq-jami-cv-de.pdf': ['public/tareq-jami-cv-de.pdf'],
};

function git(...args: string[]): string | undefined {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

const usable = git('rev-parse', '--is-shallow-repository') === 'false';
const cache = new Map<string, Date | undefined>();

/** Last commit date of the content behind a language-neutral path. */
export function lastModified(path: string): Date | undefined {
  const files = PAGE_SOURCES[path];
  if (!files || !usable) return undefined;
  if (!cache.has(path)) {
    const iso = git('log', '-1', '--format=%cI', '--', ...files);
    cache.set(path, iso ? new Date(iso) : undefined);
  }
  return cache.get(path);
}

/** Strips the site origin and language prefix from a sitemap URL. */
export function neutralPath(url: string, prefixes: string[]): string {
  let path = new URL(url).pathname;
  for (const p of prefixes) {
    if (path === p || path.startsWith(p + '/')) path = path.slice(p.length) || '/';
  }
  return path;
}
