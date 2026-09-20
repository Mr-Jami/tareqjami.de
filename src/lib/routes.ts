// Every page lives under src/pages/[...lang]/ and is built once per language:
// the default language at the root (/impressum/) and the others under their
// prefix (/de/impressum/). This is the shared getStaticPaths for those pages.
import { DEFAULT_LANG, LANGS, type Lang } from './i18n';

export function getStaticPaths() {
  return LANGS.map((lang) => ({
    // A rest parameter of `undefined` builds the route without a prefix.
    params: { lang: lang === DEFAULT_LANG ? undefined : lang },
    props: { lang },
  }));
}

export interface LangProps {
  lang: Lang;
}
