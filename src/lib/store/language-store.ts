import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fr' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',

      setLanguage: (lang) => set({ language: lang }),

      toggleLanguage: () => {
        const current = get().language;
        set({ language: current === 'fr' ? 'en' : 'fr' });
      },
    }),
    {
      name: 'consultprep-language',
    }
  )
);
