/**
 * Language state shared by every inline island.
 *
 * Translation payload lives inline in the markup as `data-en` / `data-fr`
 * attributes, so swapping language is a pure DOM write: no fetch, no reload,
 * no duplicate HTML rendering from the server.
 */

const STORAGE_KEY = 'lang';

export type Lang = 'en' | 'fr';

export function currentLang(): Lang {
  return document.documentElement.dataset.lang === 'fr' ? 'fr' : 'en';
}

type Listener = (lang: Lang) => void;
const listeners = new Set<Listener>();

export function onLangChange(fn: Listener): void {
  listeners.add(fn);
}

/** Run now and again on every language change (for JS-rendered content). */
export function watchLang(fn: Listener): void {
  fn(currentLang());
  onLangChange(fn);
}

function pick(el: HTMLElement, lang: Lang): string | undefined {
  const value = lang === 'fr' ? el.dataset.fr : el.dataset.en;
  return value ?? el.dataset.en;
}

function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang;

  for (const el of document.querySelectorAll<HTMLElement>('[data-en]')) {
    if (el.dataset.skipI18n !== undefined) continue;
    const value = pick(el, lang);
    if (value !== undefined) el.innerHTML = value;
  }

  // e.g. data-en-aria-label="..." / data-fr-aria-label="..."
  for (const el of document.querySelectorAll<HTMLElement>('[data-en][data-fr]')) {
    for (const attr of ['aria-label', 'title', 'placeholder', 'alt']) {
      const value = el.dataset[`${lang}${attr.replace(/(^|-)([a-z])/g, (_m, _d, c) => c.toUpperCase())}`];
      const fallback = el.dataset[`en${attr.replace(/(^|-)([a-z])/g, (_m, _d, c) => c.toUpperCase())}`];
      const next = value ?? fallback;
      if (next !== undefined) el.setAttribute(attr, next);
    }
  }

  const title = document.querySelector<HTMLTitleElement>('title[data-fr-title]');
  if (title) {
    title.textContent = lang === 'fr' ? title.dataset.frTitle! : title.dataset.enTitle!;
  }

  const desc = document.querySelector<HTMLMetaElement>('meta[name="description"][data-fr-desc]');
  if (desc) {
    desc.content = lang === 'fr' ? desc.dataset.frDesc! : desc.dataset.enDesc!;
  }

  for (const btn of document.querySelectorAll<HTMLElement>('[data-lang-btn]')) {
    const active = btn.dataset.langBtn === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  }

  const sw = document.getElementById('lang-switch');
  if (sw) {
    const label = lang === 'fr' ? 'Language / Langue' : 'Language / Langue';
    sw.setAttribute('aria-label', label);
  }

  listeners.forEach((fn) => fn(lang));
}

function persist(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode — the ?lang= param still applies for this visit */
  }
}

export function setLang(lang: Lang, save = true): void {
  applyLang(lang);
  if (save) persist(lang);
}

export function initLangSwitch(): void {
  for (const btn of document.querySelectorAll<HTMLElement>('[data-lang-btn]')) {
    if (btn.dataset.bound === '1') continue;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const next: Lang = btn.dataset.langBtn === 'fr' ? 'fr' : 'en';
      setLang(next);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      history.replaceState(null, '', url);
    });
  }
}
