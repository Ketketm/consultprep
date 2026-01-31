'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PillarCard } from '@/components/dashboard/pillar-card';
import { XPBar } from '@/components/gamification/xp-bar';
import { formatNumber } from '@/lib/utils';

// Demo data - same as dashboard for consistency
const DEMO_PILLARS = [
  {
    id: '1',
    slug: 'case_resolution',
    name: 'Case Resolution',
    description: 'Master the art of structured problem-solving with interactive cases',
    colorHex: '#3b82f6',
    iconUrl: null,
  },
  {
    id: '2',
    slug: 'maths_tools',
    name: 'Maths & Business Tools',
    description: 'CAGR, WACC, NPV and essential frameworks at your fingertips',
    colorHex: '#22c55e',
    iconUrl: null,
  },
  {
    id: '3',
    slug: 'business_sense',
    name: 'Business Sense',
    description: 'Develop your hypothesis reflex with real-world scenarios',
    colorHex: '#f59e0b',
    iconUrl: null,
  },
  {
    id: '4',
    slug: 'industry_insights',
    name: 'Industry Insights',
    description: 'Know margins, trends, and benchmarks across key industries',
    colorHex: '#8b5cf6',
    iconUrl: null,
  },
  {
    id: '5',
    slug: 'general_knowledge',
    name: 'General Knowledge',
    description: 'Macro data for market sizing: GDP, population, key stats',
    colorHex: '#ec4899',
    iconUrl: null,
  },
];

// Demo progress - all at 100% for demo mode
// Items match actual content: case_resolution (5 demo cases), maths_tools (70 flashcards),
// business_sense (12 drills), industry_insights (20 items), general_knowledge (10 items)
const DEMO_PROGRESS = [
  { percentage: 100, itemsCompleted: 5, itemsTotal: 5, isUnlocked: true },    // Case Resolution: 5 demo cases
  { percentage: 100, itemsCompleted: 70, itemsTotal: 70, isUnlocked: true },  // Maths & Tools: 70 flashcards
  { percentage: 100, itemsCompleted: 12, itemsTotal: 12, isUnlocked: true },  // Business Sense: 12 drills
  { percentage: 100, itemsCompleted: 20, itemsTotal: 20, isUnlocked: true },  // Industry Insights: 20 items
  { percentage: 100, itemsCompleted: 10, itemsTotal: 10, isUnlocked: true },  // General Knowledge: 10 items
];

const DEMO_USER = {
  totalXp: 5000,
};

export default function LearnPage() {
  const totalItems = DEMO_PROGRESS.reduce((sum, p) => sum + p.itemsTotal, 0);
  const completedItems = DEMO_PROGRESS.reduce((sum, p) => sum + p.itemsCompleted, 0);
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">Learn</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="hidden md:block">
                <XPBar totalXP={DEMO_USER.totalXp} showDetails={false} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Paths</h1>
          <p className="text-gray-500">
            Master all 5 pillars to ace your consulting interview
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(completedItems)} / {formatNumber(totalItems)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xl">5</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Learning Pillars</p>
                  <p className="text-2xl font-bold text-gray-900">5 Pillars</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pillars grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              All Learning Pillars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_PILLARS.map((pillar, index) => (
                <PillarCard
                  key={pillar.id}
                  pillar={pillar}
                  progress={DEMO_PROGRESS[index]}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
