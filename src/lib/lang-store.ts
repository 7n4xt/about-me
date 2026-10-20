/**
 * Language state shared by every inline island.
 *
 * Markup carries both translations:
 *   <span data-en="English" data-fr="Français">English</span>
 *   <a data-en-aria-label="Home" data-fr-aria-label="Accueil">
 *
 * `data-en` marks an element as translatable content; `data-en-*` marks a
 * translatable attribute. Keeping the two prefixes apart means the attribute
 * pass never mistakes an option value for a text node.
 */
const STORAGE_KEY = 'lang';

export type Lang = 'en' | 'fr';

const ATTRS = ['aria-label', 'title', 'placeholder', 'alt'] as const;

/** camelCase a dashed attribute name: "aria-label" -> "AriaLabel" */
const camel = (name: string) => name.replace(/(^|-)([a-z])/g, (_m, _d, c: string) => c.toUpperCase());

export function currentLang(): Lang {
  return document.documentElement.dataset.lang === 'fr' ? 'fr' : 'en';
}

type Listener = (lang: Lang) => void;
const listeners = new Set<Listener>();

/** Run now and again on every language change (for JS-rendered content). */
export function watchLang(fn: Listener): void {
  fn(currentLang());
  listeners.add(fn);
}

function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang;

  // Translatable text: only elements that actually carry both versions.
  for (const el of document.querySelectorAll<HTMLElement>('[data-en]')) {
    const value = lang === 'fr' ? el.dataset.fr : el.dataset.en;
    if (value !== undefined) el.innerHTML = value;
  }

  // Translatable attributes.
  for (const attr of ATTRS) {
    const enKey = `en${camel(attr)}` as const;
    const frKey = `fr${camel(attr)}` as const;
    for (const el of document.querySelectorAll<HTMLElement>(`[data-${enKey}]`)) {
      const value = el.dataset[(lang === 'fr' ? frKey : enKey) as keyof DOMStringMap] as string | undefined;
      if (value !== undefined) el.setAttribute(attr, value);
    }
  }

  // <title> and meta description switch only on fully translated pages.
  const title = document.querySelector<HTMLTitleElement>('title[data-fr-title]');
  if (title) {
    title.textContent =
      (lang === 'fr' ? title.dataset.frTitle : title.dataset.enTitle) ?? title.textContent;
  }

  const desc = document.querySelector<HTMLMetaElement>('meta[name="description"][data-fr-desc]');
  if (desc) {
    desc.content = (lang === 'fr' ? desc.dataset.frDesc : desc.dataset.enDesc) ?? desc.content;
  }

  for (const btn of document.querySelectorAll<HTMLElement>('[data-lang-btn]')) {
    const active = btn.dataset.langBtn === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
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

/** Apply a language. `save: false` is used for the first paint. */
export function setLang(lang: Lang, save = true): void {
  applyLang(lang);
  if (save) persist(lang);
}

/**
 * Boots the switcher on every page.
 *
 * Layout.astro calls this from an is:inline script so the behaviour is not tied
 * to any single component's bundle (Astro only ships a component's <script> on
 * routes that render that component).
 */
export function initLang(): void {
  // Honour ?lang= above the stored preference (shareable links win).
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  const initial: Lang = fromUrl === 'fr' || fromUrl === 'en' ? fromUrl : currentLang();

  setLang(initial, false);
  if (fromUrl) persist(initial);

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

/* Keep the old name working for the islands that already import it. */
export const initLangSwitch = initLang;
