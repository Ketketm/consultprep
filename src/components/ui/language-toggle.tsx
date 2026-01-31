'use client';

import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/lib/store/language-store';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
  };

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium transition-colors',
          'bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
          className
        )}
      >
        <span className="text-gray-400">FR</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">EN</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium transition-colors',
        'bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <span className={cn(
        'transition-colors',
        language === 'fr' ? 'text-gray-900 font-semibold' : 'text-gray-400'
      )}>
        FR
      </span>
      <span className="text-gray-300">/</span>
      <span className={cn(
        'transition-colors',
        language === 'en' ? 'text-gray-900 font-semibold' : 'text-gray-400'
      )}>
        EN
      </span>
    </button>
  );
}
