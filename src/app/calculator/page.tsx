'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { HumanCalculator } from '@/components/calculator/HumanCalculator';
import { CalculatorStats } from '@/components/calculator/CalculatorStats';
import { CalculatorSettings } from '@/components/calculator/CalculatorSettings';
import { cn } from '@/lib/utils';

type TabType = 'play' | 'stats' | 'settings';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('play');
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch with persisted Zustand stores
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white text-xl">🧮</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Human Calculator</span>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('play')}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                activeTab === 'play'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Gamepad2 className="w-4 h-4" />
              Play
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mounted ? (
          <>
            {activeTab === 'play' && <HumanCalculator />}
            {activeTab === 'stats' && <CalculatorStats />}
            {activeTab === 'settings' && <CalculatorSettings />}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        )}
      </main>
    </div>
  );
}
