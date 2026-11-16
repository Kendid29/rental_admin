import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'zh' | 'id';

interface LocaleStoreState {
  locale: Locale;
}

interface LocaleStoreActions {
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export type LocaleStore = LocaleStoreState & LocaleStoreActions;

const getDayjsLocale = (loc: Locale) => {
  if (loc === 'zh') return 'zh-cn';
  if (loc === 'id') return 'id';
  return 'en';
};

const syncNextLocaleCookie = (locale: Locale) => {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
};

const NEXT_LOCALE_MAP: Record<Locale, Locale> = {
  en: 'zh',
  zh: 'id',
  id: 'en',
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale(locale: Locale) {
        dayjs.locale(getDayjsLocale(locale));
        syncNextLocaleCookie(locale);
        set({ locale });
      },
      toggleLocale() {
        const current = get().locale;
        const next: Locale = NEXT_LOCALE_MAP[current] || 'en';

        dayjs.locale(getDayjsLocale(next));
        syncNextLocaleCookie(next);
        set({ locale: next });
      },
    }),
    {
      name: 'rentaku_locale',
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          dayjs.locale(getDayjsLocale(state.locale));
          syncNextLocaleCookie(state.locale);
        }
      },
    },
  ),
);
