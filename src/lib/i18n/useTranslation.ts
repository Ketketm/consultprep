'use client';

import { useLanguageStore } from '@/lib/store/language-store';
import { translations, type Translations } from './translations';

export function useTranslation(): { t: Translations; lang: 'fr' | 'en'; toggleLanguage: () => void } {
  const { language, toggleLanguage } = useLanguageStore();

  return {
    t: translations[language],
    lang: language,
    toggleLanguage,
  };
}
