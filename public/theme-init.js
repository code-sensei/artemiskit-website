/* Shared, pre-paint theme controller for the website and documentation. */
(() => {
  if (window.ArtemisTheme) return;
  const key = 'artemiskit-theme';
  const allowed = ['system', 'light', 'dark', 'contrast'];
  const parse = value => allowed.includes(value) ? value : 'system';
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const contrast = matchMedia('(prefers-contrast: more)');
  const forced = matchMedia('(forced-colors: active)');
  const load = () => { try { return parse(localStorage.getItem(key)); } catch { return 'system'; } };
  let preference = load();
  function syncPickers() {
    document.querySelectorAll('[data-ak-theme-picker]').forEach(picker => { picker.value = preference; });
  }
  function apply() {
    const high = preference === 'contrast' || (preference === 'system' && (contrast.matches || forced.matches));
    const resolved = high || preference === 'dark' || (preference === 'system' && dark.matches) ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.akTheme = preference;
    document.documentElement.dataset.contrast = high ? 'high' : 'normal';
    document.documentElement.style.colorScheme = resolved;
    syncPickers();
  }
  function set(value) {
    preference = parse(value);
    try { if (preference === 'system') localStorage.removeItem(key); else localStorage.setItem(key, preference); } catch { /* Storage may be unavailable. */ }
    apply();
  }
  window.ArtemisTheme = { set, apply, preference: () => preference };
  apply();
  [dark, contrast, forced].forEach(media => media.addEventListener('change', () => { if (preference === 'system') apply(); }));
  document.addEventListener('change', event => { if (event.target?.matches?.('[data-ak-theme-picker]')) set(event.target.value); });
  document.addEventListener('DOMContentLoaded', syncPickers);
  document.addEventListener('astro:page-load', () => { preference = load(); apply(); });
  window.addEventListener('pageshow', () => { preference = load(); apply(); });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { preference = load(); apply(); } });
})();
