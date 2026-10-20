import { dictionaries, DEFAULT_LANG, type Key, type Lang } from './i18n';

/**
 * Server-side translation helper.
 *
 * The site is statically built in the default language (English) and swapped in
 * the browser. That keeps the HTML crawlable and avoids duplicating every route
 * while still giving an instant, no-reload toggle.
 */
export function useTranslations(lang: Lang = DEFAULT_LANG) {
  const dict = dictionaries[lang];

  return {
    lang,
    /** Translate a key. */
    t: (key: Key): string => dict[key],
    /** Translate a key into a list (pipe-separated source). */
    tList: (key: Key): string[] => dict[key].split('|'),
  };
}

export type { Key, Lang };
