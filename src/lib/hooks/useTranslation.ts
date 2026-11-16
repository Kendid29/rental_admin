'use client';

import { useMemo } from 'react';

import { useLocaleStore } from '@/lib/zustand/locale.store';
import { translations, TranslationType } from '@/locales';

export const useTranslation = () => {
  const { locale, setLocale, toggleLocale } = useLocaleStore();

  const currentTranslation: TranslationType = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);

  const tSidebar = (englishLabel: any): string => {
    if (!englishLabel) return '';
    const str = Array.isArray(englishLabel) ? String(englishLabel[0] || '') : String(englishLabel);

    if (!str || typeof str !== 'string') return '';
    const dict = currentTranslation.sidebar as Record<string, string>;
    const normalized = str.toLowerCase().trim();

    return dict[normalized] || dict[str] || str;
  };

  const tStatus = (statusKey: any): string => {
    if (!statusKey) return '';
    const str = Array.isArray(statusKey) ? String(statusKey[0] || '') : String(statusKey);
    const dict = currentTranslation.status as Record<string, string>;
    const normalizedKey = str.toLowerCase().trim();

    return dict[normalizedKey] || str;
  };

  const tCommon = (text: any): string => {
    if (!text) return '';
    const str = Array.isArray(text) ? String(text[0] || '') : String(text);

    if (!str || typeof str !== 'string') return '';
    const commonDict = (currentTranslation.common || {}) as Record<string, string>;
    const pageDict = (currentTranslation.pages || {}) as Record<string, string>;
    const sidebarDict = (currentTranslation.sidebar || {}) as Record<string, string>;
    const statusDict = (currentTranslation.status || {}) as Record<string, string>;
    const normalized = str.toLowerCase().trim();
    const matched =
      commonDict[normalized] ||
      commonDict[str] ||
      pageDict[normalized] ||
      pageDict[str] ||
      sidebarDict[normalized] ||
      sidebarDict[str] ||
      statusDict[normalized] ||
      statusDict[str];

    if (matched) return matched;

    if (locale === 'zh' && /^\d+\s*nights?$/iu.test(normalized)) {
      return normalized.replace(/(\d+)\s*nights?/iu, '$1 晚');
    }

    if (locale === 'id' && /^\d+\s*nights?$/iu.test(normalized)) {
      return normalized.replace(/(\d+)\s*nights?/iu, '$1 Malam');
    }

    return str;
  };

  const tPage = (text: any): string => {
    if (!text) return '';
    const str = Array.isArray(text) ? String(text[0] || '') : String(text);

    if (!str) return '';
    const pageDict = (currentTranslation.pages || {}) as Record<string, string>;
    const commonDict = (currentTranslation.common || {}) as Record<string, string>;
    const normalized = str.toLowerCase().trim();

    return (
      pageDict[normalized] ||
      pageDict[str] ||
      commonDict[normalized] ||
      commonDict[str] ||
      tSidebar(str) ||
      str
    );
  };

  return {
    locale,
    setLocale,
    toggleLocale,
    isZh: locale === 'zh',
    isId: locale === 'id',
    t: currentTranslation,
    tSidebar,
    tStatus,
    tPage,
    tCommon,
  };
};

export { useTranslations, useLocale } from 'next-intl';

export default useTranslation;
