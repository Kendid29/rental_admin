import { en, TranslationType } from './en';
import { id } from './id';
import { zh } from './zh';

export const translations: Record<'en' | 'zh' | 'id', TranslationType> = {
  en,
  zh,
  id,
};

export * from './en';
