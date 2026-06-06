// Shared client-side controls (theme + language toggles) used on every page.
// Pages register a `langchange` listener for their own content/title updates,
// then call initControls() once.
import { data, type Lang } from './i18n';

export function currentLang(): Lang {
  return document.documentElement.getAttribute('data-lang') === 'de' ? 'de' : 'en';
}

export function initControls(): void {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');
  const langSeg = document.getElementById('lang-seg');

  function syncTheme(): void {
    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-checked',
        root.getAttribute('data-theme') === 'dark' ? 'true' : 'false',
      );
    }
  }

  function setLang(lang: Lang): void {
    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
    if (themeBtn) themeBtn.setAttribute('aria-label', data[lang].ui.themeToggleAria);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  langSeg?.querySelectorAll<HTMLButtonElement>('[data-lang-opt]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.langOpt === 'de' ? 'de' : 'en'));
  });

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    syncTheme();
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  syncTheme();
  // Fire once so pages render content/title/aria for the pre-paint language.
  setLang(currentLang());
}
