'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Zap,
  Clock,
  BookOpen,
  Award,
  Volume2,
  Moon,
  Globe,
  Target,
  ChevronRight,
  Settings,
  User,
  BarChart3,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useLanguageStore } from '@/lib/store/language-store';
import { useSettingsStore } from '@/lib/store/settings-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { playSound } from '@/lib/utils/sound';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { LevelBadge } from '@/components/gamification/level-badge';
import { XPBar } from '@/components/gamification/xp-bar';

// Demo user data - same as dashboard
// All stats maxed out for demo mode
const DEMO_USER = {
  displayName: 'Margaux Kettner',
  firstName: 'Margaux',
  avatarUrl: '/images/avatar-margaux.png',
  totalXp: 5000,
  currentLevel: 11, // Senior Partner at 5000 XP
  currentStreak: 30,
  longestStreak: 30,
  streakFreezeCount: 3,
  lastActivityDate: new Date().toISOString().split('T')[0],
  memberSince: '2024-01-01',
  targetCompany: 'McKinsey',
  experienceLevel: 'young_professional' as const,
  casesCompleted: 5,
  achievementsUnlocked: 12,
  totalAchievements: 12,
  practiceTimeMinutes: 2400,
};

const DAILY_GOAL_OPTIONS = [5, 10, 15, 20] as const;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { soundEffectsEnabled, toggleSoundEffects, darkModeEnabled, toggleDarkMode, dailyGoalMinutes, setDailyGoal } =
    useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle reset all data
  const handleResetAllData = () => {
    // Clear all localStorage keys for the app
    const keysToRemove = [
      'consultprep-calculator',
      'consultprep-case',
      'consultprep-settings',
      'consultprep-language',
      'consultprep-onboarding',
      'consultprep-gamification',
      'consultprep-progress',
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    setShowResetConfirm(false);
    // Reload the page to reset all state
    window.location.reload();
  };

  // Format practice time
  const practiceHours = Math.floor(DEMO_USER.practiceTimeMinutes / 60);
  const practiceMinutesRemaining = DEMO_USER.practiceTimeMinutes % 60;

  // Experience level label
  const experienceLevelLabel = {
    student: t.profile.student,
    young_professional: t.profile.youngProfessional,
    experienced: t.profile.experienced,
    career_changer: t.profile.careerChanger,
  }[DEMO_USER.experienceLevel];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

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
              <h1 className="font-bold text-xl text-gray-900">{t.profile.title}</h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24" />
            <CardContent className="relative pt-0 pb-6 px-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={DEMO_USER.avatarUrl}
                    alt={DEMO_USER.displayName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name and level */}
                <div className="flex-1 sm:pb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{DEMO_USER.displayName}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <LevelBadge level={DEMO_USER.currentLevel} showTitle />
                    <span className="text-sm text-gray-500">
                      {t.profile.memberSince}{' '}
                      {new Date(DEMO_USER.memberSince).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {/* XP Bar */}
              <div className="mt-6">
                <XPBar totalXP={DEMO_USER.totalXp} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statistics Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  {t.profile.statistics}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Total XP */}
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-gray-600">{t.profile.totalXp}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{DEMO_USER.totalXp.toLocaleString()}</p>
                  </div>

                  {/* Current Streak */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600">{t.profile.currentStreak}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {DEMO_USER.currentStreak} {t.profile.days}
                    </p>
                  </div>

                  {/* Longest Streak */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-600">{t.profile.longestStreak}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {DEMO_USER.longestStreak} {t.profile.days}
                    </p>
                  </div>

                  {/* Cases Completed */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600">{t.profile.casesCompleted}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{DEMO_USER.casesCompleted}</p>
                  </div>

                  {/* Practice Time */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">{t.profile.practiceTime}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {practiceHours}h {practiceMinutesRemaining}m
                    </p>
                  </div>

                  {/* Achievements */}
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-pink-500" />
                      <span className="text-sm text-gray-600">{t.profile.achievementsUnlocked}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {DEMO_USER.achievementsUnlocked}/{DEMO_USER.totalAchievements}
                    </p>
                  </div>
                </div>

                {/* View Achievements Link */}
                <Link href="/profile/achievements" className="block">
                  <Button variant="outline" className="w-full">
                    <Award className="w-4 h-4 mr-2" />
                    {t.profile.viewAchievements}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  {t.profile.settings}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {/* Sound Effects */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.profile.soundEffects}</p>
                      <p className="text-sm text-gray-500">{t.profile.soundEffectsDesc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={soundEffectsEnabled}
                    onCheckedChange={() => {
                      toggleSoundEffects();
                      // Play sound after toggle (will use new state)
                      setTimeout(() => playSound('toggle', !soundEffectsEnabled), 50);
                    }}
                  />
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{t.profile.darkMode}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.profile.darkModeDesc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={darkModeEnabled}
                    onCheckedChange={() => {
                      playSound('toggle', soundEffectsEnabled);
                      toggleDarkMode();
                    }}
                  />
                </div>

                {/* Language */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.profile.language}</p>
                      <p className="text-sm text-gray-500">{t.profile.languageDesc}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleLanguage}>
                    {language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                  </Button>
                </div>

                {/* Daily Goal */}
                <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.profile.dailyGoal}</p>
                      <p className="text-sm text-gray-500">{t.profile.dailyGoalDesc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-13">
                    {DAILY_GOAL_OPTIONS.map((minutes) => (
                      <Button
                        key={minutes}
                        variant={dailyGoalMinutes === minutes ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          playSound('click', soundEffectsEnabled);
                          setDailyGoal(minutes);
                        }}
                        className="flex-1"
                      >
                        {minutes}m
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  {t.profile.account}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Company */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">{t.profile.targetCompany}</p>
                    <p className="font-semibold text-gray-900">{DEMO_USER.targetCompany}</p>
                  </div>

                  {/* Experience Level */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">{t.profile.experienceLevel}</p>
                    <p className="font-semibold text-gray-900">{experienceLevelLabel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reset Data Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <RotateCcw className="w-5 h-5" />
                  {language === 'fr' ? 'Réinitialiser les données' : 'Reset Data'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {language === 'fr'
                    ? 'Effacer toutes vos données de progression et repartir à zéro. Cette action est irréversible.'
                    : 'Clear all your progress data and start fresh. This action cannot be undone.'}
                </p>

                {!showResetConfirm ? (
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Réinitialiser toutes les données' : 'Reset all data'}
                  </Button>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">
                          {language === 'fr' ? 'Êtes-vous sûr ?' : 'Are you sure?'}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {language === 'fr'
                            ? 'Toutes vos données seront supprimées : progression, XP, séries, cas importés, flashcards...'
                            : 'All your data will be deleted: progress, XP, streaks, imported cases, flashcards...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        {language === 'fr' ? 'Annuler' : 'Cancel'}
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleResetAllData}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {language === 'fr' ? 'Oui, tout supprimer' : 'Yes, delete everything'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
