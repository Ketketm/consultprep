'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, TrendingUp, Calendar, Award, Calculator, Trophy, Zap, Volume2, Moon, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { useLanguageStore } from '@/lib/store/language-store';
import { useSettingsStore } from '@/lib/store/settings-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { playSound } from '@/lib/utils/sound';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { XPBar } from '@/components/gamification/xp-bar';
import { StreakCounter } from '@/components/gamification/streak-counter';
import { LevelBadge } from '@/components/gamification/level-badge';
import { SkillRadar, SkillBars } from '@/components/dashboard/skill-radar';
import { PillarCard } from '@/components/dashboard/pillar-card';
import { TodayMission } from '@/components/dashboard/today-mission';

// Demo data - in production this would come from Supabase
// All stats maxed out for demo mode
const DEMO_USER = {
  displayName: 'Margaux Kettner',
  firstName: 'Margaux',
  avatarUrl: '/images/avatar-margaux.png',
  totalXp: 5000,
  currentLevel: 11, // Senior Partner at 5000 XP
  currentStreak: 30,
  streakFreezeCount: 3,
  lastActivityDate: new Date().toISOString().split('T')[0],
};

const DEMO_PILLARS_EN = [
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

const DEMO_PILLARS_FR = [
  {
    id: '1',
    slug: 'case_resolution',
    name: 'Résolution de Cas',
    description: 'Maîtrisez l\'art de la résolution structurée avec des cas interactifs',
    colorHex: '#3b82f6',
    iconUrl: null,
  },
  {
    id: '2',
    slug: 'maths_tools',
    name: 'Maths & Outils Business',
    description: 'CAGR, WACC, VAN et frameworks essentiels à portée de main',
    colorHex: '#22c55e',
    iconUrl: null,
  },
  {
    id: '3',
    slug: 'business_sense',
    name: 'Sens des Affaires',
    description: 'Développez votre réflexe d\'hypothèses avec des scénarios réels',
    colorHex: '#f59e0b',
    iconUrl: null,
  },
  {
    id: '4',
    slug: 'industry_insights',
    name: 'Connaissances Sectorielles',
    description: 'Marges, tendances et benchmarks par industrie',
    colorHex: '#8b5cf6',
    iconUrl: null,
  },
  {
    id: '5',
    slug: 'general_knowledge',
    name: 'Culture Générale',
    description: 'Données macro pour market sizing: PIB, population, stats clés',
    colorHex: '#ec4899',
    iconUrl: null,
  },
];

// Demo progress - all at 100% for demo mode
// Items match actual content: case_resolution (5 demo cases), maths_tools (70 flashcards),
// business_sense (12 drills), industry_insights (20 items), general_knowledge (10 items)
const DEMO_PROGRESS = [
  { percentage: 100, itemsCompleted: 5, itemsTotal: 5, isUnlocked: true },    // Case Resolution: 5 demo cases (3 profit + 1 brainteaser + 1 out_of_the_box)
  { percentage: 100, itemsCompleted: 70, itemsTotal: 70, isUnlocked: true },  // Maths & Tools: 70 flashcards
  { percentage: 100, itemsCompleted: 12, itemsTotal: 12, isUnlocked: true },  // Business Sense: 12 drills
  { percentage: 100, itemsCompleted: 20, itemsTotal: 20, isUnlocked: true },  // Industry Insights: 20 items (pharma 4 + retail 5 + tech 5 + education 6)
  { percentage: 100, itemsCompleted: 10, itemsTotal: 10, isUnlocked: true },  // General Knowledge: 10 items
];

// Subcategories for each pillar
const PILLAR_SUBCATEGORIES: Record<string, Array<{ id: string; labelEn: string; labelFr: string; count: number; icon: string; color: string }>> = {
  case_resolution: [
    { id: 'profit', labelEn: 'Profitability', labelFr: 'Profitabilité', count: 3, icon: '💰', color: 'bg-green-100 text-green-700' },
    { id: 'brainteaser', labelEn: 'Brainteaser', labelFr: 'Casse-tête', count: 1, icon: '🧩', color: 'bg-purple-100 text-purple-700' },
    { id: 'out_of_the_box', labelEn: 'Out of the box', labelFr: 'Hors des sentiers', count: 1, icon: '💡', color: 'bg-orange-100 text-orange-700' },
  ],
  maths_tools: [
    { id: 'squares', labelEn: 'Squares', labelFr: 'Carrés', count: 25, icon: '🔢', color: 'bg-blue-100 text-blue-700' },
    { id: 'cubes', labelEn: 'Cubes', labelFr: 'Cubes', count: 20, icon: '📦', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'tricks', labelEn: 'Mental tricks', labelFr: 'Astuces', count: 6, icon: '🧠', color: 'bg-purple-100 text-purple-700' },
    { id: 'conversions', labelEn: 'Conversions', labelFr: 'Conversions', count: 10, icon: '🔄', color: 'bg-teal-100 text-teal-700' },
    { id: 'formulas', labelEn: 'Formulas', labelFr: 'Formules', count: 9, icon: '📐', color: 'bg-green-100 text-green-700' },
  ],
  business_sense: [
    { id: 'profitability', labelEn: 'Profitability', labelFr: 'Profitabilité', count: 4, icon: '📈', color: 'bg-green-100 text-green-700' },
    { id: 'unit_economics', labelEn: 'Unit Economics', labelFr: 'Unit Economics', count: 4, icon: '💵', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'revenue', labelEn: 'Revenue', labelFr: 'Revenu', count: 4, icon: '💹', color: 'bg-blue-100 text-blue-700' },
  ],
  industry_insights: [
    { id: 'pharma', labelEn: 'Pharma', labelFr: 'Pharma', count: 4, icon: '💊', color: 'bg-red-100 text-red-700' },
    { id: 'retail', labelEn: 'Retail', labelFr: 'Retail', count: 5, icon: '🛒', color: 'bg-orange-100 text-orange-700' },
    { id: 'tech', labelEn: 'Tech & SaaS', labelFr: 'Tech & SaaS', count: 5, icon: '💻', color: 'bg-blue-100 text-blue-700' },
    { id: 'education', labelEn: 'Education', labelFr: 'Éducation', count: 6, icon: '🎓', color: 'bg-indigo-100 text-indigo-700' },
  ],
  general_knowledge: [
    { id: 'geography', labelEn: 'Geography', labelFr: 'Géographie', count: 4, icon: '🌍', color: 'bg-green-100 text-green-700' },
    { id: 'economics', labelEn: 'Economics', labelFr: 'Économie', count: 3, icon: '📊', color: 'bg-blue-100 text-blue-700' },
    { id: 'demographics', labelEn: 'Demographics', labelFr: 'Démographie', count: 3, icon: '👥', color: 'bg-purple-100 text-purple-700' },
  ],
};

// Demo skills - all at 100% for demo mode
const DEMO_SKILL_DATA = [
  { pillar: 'Case', proficiency: 100, fullMark: 100 },
  { pillar: 'Math', proficiency: 100, fullMark: 100 },
  { pillar: 'Biz Sense', proficiency: 100, fullMark: 100 },
  { pillar: 'Industry', proficiency: 100, fullMark: 100 },
  { pillar: 'General', proficiency: 100, fullMark: 100 },
];

const DEMO_SKILL_BARS = [
  { pillar: 'Case Resolution', proficiency: 100, color: '#3b82f6' },
  { pillar: 'Maths & Tools', proficiency: 100, color: '#22c55e' },
  { pillar: 'Business Sense', proficiency: 100, color: '#f59e0b' },
  { pillar: 'Industry Insights', proficiency: 100, color: '#8b5cf6' },
  { pillar: 'General Knowledge', proficiency: 100, color: '#ec4899' },
];

// Helper to get current day of week (0 = Monday, 6 = Sunday)
function getCurrentDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday=0 to 6, Monday=1 to 0, etc.
}

// Helper to get greeting based on time of day
function getGreeting(lang: 'fr' | 'en'): string {
  const hour = new Date().getHours();
  if (lang === 'fr') {
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { personalBest, sessions } = useCalculatorStore();
  const { soundEffectsEnabled, toggleSoundEffects, darkModeEnabled, toggleDarkMode } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Get localized pillars
  const DEMO_PILLARS = language === 'fr' ? DEMO_PILLARS_FR : DEMO_PILLARS_EN;

  // Get day names based on language
  const dayNames = [t.dashboard.mon, t.dashboard.tue, t.dashboard.wed, t.dashboard.thu, t.dashboard.fri, t.dashboard.sat, t.dashboard.sun];

  // Hydration protection for persisted store data
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Demo notifications (translated)
  const notifications = [
    {
      id: 1,
      title: language === 'fr' ? 'Nouveau cas disponible !' : 'New case available!',
      message: language === 'fr' ? 'Le cas Oil & Gas Target Costing est maintenant disponible' : 'Oil & Gas Target Costing case is now live',
      time: language === 'fr' ? 'Il y a 2h' : '2h ago',
      unread: true
    },
    {
      id: 2,
      title: language === 'fr' ? 'Milestone de série !' : 'Streak milestone!',
      message: language === 'fr' ? 'Vous avez atteint une série de 14 jours !' : 'You reached a 14-day streak!',
      time: language === 'fr' ? 'Il y a 1j' : '1d ago',
      unread: true
    },
    {
      id: 3,
      title: language === 'fr' ? 'Rappel de révision' : 'Review reminder',
      message: language === 'fr' ? '12 flashcards sont à réviser' : '12 flashcards are due for review',
      time: language === 'fr' ? 'Il y a 2j' : '2d ago',
      unread: false
    },
  ];

  // Calculate This Week activity
  const todayIndex = getCurrentDayIndex();
  const activeDays = todayIndex + 1; // Days including today
  const greeting = getGreeting(language);

  // Loading placeholder during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ConsultPrep</span>
            </div>

            {/* Gamification stats */}
            <div className="hidden md:flex items-center gap-6">
              <StreakCounter
                currentStreak={DEMO_USER.currentStreak}
                streakFreezeCount={DEMO_USER.streakFreezeCount}
                lastActivityDate={DEMO_USER.lastActivityDate}
              />
              <div className="h-8 w-px bg-gray-200" />
              <XPBar totalXP={DEMO_USER.totalXp} showDetails={false} showXP={false} showProgress={false} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <LanguageToggle />

              {/* Notifications dropdown */}
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="relative"
                >
                  <Bell className="w-5 h-5 text-gray-500" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">{t.dashboard.notifications}</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-primary-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              {notif.unread && <span className="w-2 h-2 mt-2 bg-primary-500 rounded-full flex-shrink-0" />}
                              <div className={notif.unread ? '' : 'ml-5'}>
                                <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                                <p className="text-gray-500 text-xs mt-1">{notif.message}</p>
                                <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <Button variant="ghost" className="w-full text-sm text-primary-600">
                          {t.dashboard.viewAllNotifications}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile avatar with settings dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="ml-2 flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-200 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Image
                      src={DEMO_USER.avatarUrl}
                      alt={DEMO_USER.displayName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Profile header */}
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200">
                            <Image
                              src={DEMO_USER.avatarUrl}
                              alt={DEMO_USER.displayName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{DEMO_USER.displayName}</p>
                            <div className="flex items-center gap-2">
                              <LevelBadge level={DEMO_USER.currentLevel} size="sm" />
                              <span className="text-xs text-gray-500">{t.dashboard.level} {DEMO_USER.currentLevel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{t.dashboard.profile}</span>
                        </Link>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1">{t.dashboard.soundEffects}</span>
                          <Switch
                            checked={soundEffectsEnabled}
                            onCheckedChange={() => {
                              toggleSoundEffects();
                              setTimeout(() => playSound('toggle', !soundEffectsEnabled), 50);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <Moon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1">{t.dashboard.darkMode}</span>
                          <Switch
                            checked={darkModeEnabled}
                            onCheckedChange={() => {
                              playSound('toggle', soundEffectsEnabled);
                              toggleDarkMode();
                            }}
                          />
                        </div>
                        <Link href="/help" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <HelpCircle className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{t.dashboard.helpSupport}</span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 w-full text-left">
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">{t.dashboard.signOut}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {DEMO_USER.firstName}!
          </h1>
          <p className="text-gray-500 mt-1">
            {t.dashboard.readyToCrush}
          </p>
        </motion.div>

        {/* Mobile gamification stats */}
        <div className="md:hidden mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <StreakCounter
                  currentStreak={DEMO_USER.currentStreak}
                  streakFreezeCount={DEMO_USER.streakFreezeCount}
                  lastActivityDate={DEMO_USER.lastActivityDate}
                />
                <LevelBadge level={DEMO_USER.currentLevel} showTitle />
              </div>
              <div className="mt-4">
                <XPBar totalXP={DEMO_USER.totalXp} showXP={false} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Mission & Radar */}
          <div className="lg:col-span-1 space-y-6">
            <TodayMission
              reviewDueCount={0}
              weakestTopic={null}
              suggestedSessionType="quick_drill"
              estimatedMinutes={5}
            />

            {/* Skill Radar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  {t.dashboard.skillOverview}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Radar on larger screens, bars on mobile */}
                <div className="hidden sm:block">
                  <SkillRadar data={DEMO_SKILL_DATA} />
                </div>
                <div className="sm:hidden">
                  <SkillBars data={DEMO_SKILL_BARS} />
                </div>

                {/* All areas mastered indicator */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    {language === 'fr' ? '🎉 Tous les domaines maîtrisés !' : '🎉 All areas mastered!'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {language === 'fr' ? 'Continuez à pratiquer pour maintenir vos compétences' : 'Keep practicing to maintain your skills'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent achievements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  {t.dashboard.recentAchievements}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <span>🏆</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t.dashboard.weekWarrior}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">7 {t.dashboard.streakAchieved}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <span>⭐</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t.dashboard.risingStar}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.earnedXp} 500 XP</p>
                  </div>
                </div>
                <Link href="/profile/achievements" className="block">
                  <Button variant="ghost" className="w-full text-sm">
                    {t.dashboard.viewAllAchievements}
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

          {/* Right column - Pillars */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t.dashboard.continueLearning}</h2>
              <Link href="/learn">
                <Button variant="ghost" size="sm">
                  {t.dashboard.viewAll}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMO_PILLARS.map((pillar, index) => (
                <PillarCard
                  key={pillar.id}
                  pillar={pillar}
                  progress={DEMO_PROGRESS[index]}
                  index={index}
                  subcategories={PILLAR_SUBCATEGORIES[pillar.slug]}
                />
              ))}

              {/* Human Calculator Module - in Continue Learning */}
              <Link href="/calculator" className="block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-700 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                          <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                          <Trophy className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                            {personalBest}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t.dashboard.humanCalculator}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.dashboard.trainYourBrain}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{t.dashboard.trainNow}</span>
                        </div>
                        {sessions.length > 0 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">{sessions.length} {t.dashboard.sessions}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>

            {/* Weekly progress */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  {t.dashboard.thisWeek}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map((day, i) => {
                    const isToday = i === todayIndex;
                    const isActive = i <= todayIndex; // Days up to and including today
                    return (
                      <div key={day} className="text-center">
                        <p className="text-xs text-gray-500 mb-2">{day}</p>
                        <div
                          className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                            isToday
                              ? 'bg-primary-500 text-white'
                              : isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isActive ? '✓' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-center text-gray-500 mt-4">
                  {activeDays}/7 {t.dashboard.daysCompleted}. {t.dashboard.keepGoing}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Demo Mode Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 border border-amber-300 rounded-full shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-medium text-amber-800">Demo Mode</span>
        </div>
      </div>
    </div>
  );
}
