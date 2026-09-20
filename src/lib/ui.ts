// Shared client-side controls used on every page: the theme switch and the
// footer year. Language is a matter of URL (/ vs /de/), not of client state.

export function initControls(): void {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');

  function syncTheme(): void {
    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-checked',
        root.getAttribute('data-theme') === 'dark' ? 'true' : 'false',
      );
    }
  }

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
}
