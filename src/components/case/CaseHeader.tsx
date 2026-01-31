'use client';

import { X, Clock, FileText, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseMode } from '@/lib/types/case-types';

interface CaseHeaderProps {
  title: string;
  elapsedTime: string;
  onClose: () => void;
}

export function CaseHeader({ title, elapsedTime, onClose }: CaseHeaderProps) {
  const { mode, setMode } = useCaseStore();

  const handleModeChange = (newMode: CaseMode) => {
    setMode(newMode);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Close button and title */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[400px]">
                {title}
              </h1>
            </div>
          </div>

          {/* Center: Mode toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleModeChange('on_paper')}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${mode === 'on_paper'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <FileText className="w-4 h-4" />
              On Paper
            </button>
            <button
              onClick={() => handleModeChange('on_screen')}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${mode === 'on_screen'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Monitor className="w-4 h-4" />
              On Screen
            </button>
          </div>

          {/* Right: Language toggle and Timer */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{elapsedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
