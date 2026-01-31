'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Flame, Target, Zap, BookOpen, Calculator, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguageStore } from '@/lib/store/language-store';
import { LanguageToggle } from '@/components/ui/language-toggle';

// Achievement types
interface Achievement {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: React.ReactNode;
  category: 'streak' | 'xp' | 'cases' | 'practice' | 'special';
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Demo achievements data - all unlocked for demo mode
const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    titleEn: 'Getting Started',
    titleFr: 'Premiers Pas',
    descriptionEn: 'Maintain a 3-day streak',
    descriptionFr: 'Maintenir une série de 3 jours',
    icon: <Flame className="w-6 h-6" />,
    category: 'streak',
    progress: 3,
    target: 3,
    unlocked: true,
    unlockedDate: '2024-01-15',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    titleEn: 'Week Warrior',
    titleFr: 'Guerrier de la Semaine',
    descriptionEn: 'Maintain a 7-day streak',
    descriptionFr: 'Maintenir une série de 7 jours',
    icon: <Flame className="w-6 h-6" />,
    category: 'streak',
    progress: 7,
    target: 7,
    unlocked: true,
    unlockedDate: '2024-01-20',
    rarity: 'rare',
  },
  {
    id: 'streak_14',
    titleEn: 'Fortnight Focus',
    titleFr: 'Concentration Bimensuelle',
    descriptionEn: 'Maintain a 14-day streak',
    descriptionFr: 'Maintenir une série de 14 jours',
    icon: <Flame className="w-6 h-6" />,
    category: 'streak',
    progress: 14,
    target: 14,
    unlocked: true,
    unlockedDate: '2024-01-27',
    rarity: 'epic',
  },
  {
    id: 'streak_30',
    titleEn: 'Monthly Master',
    titleFr: 'Maître du Mois',
    descriptionEn: 'Maintain a 30-day streak',
    descriptionFr: 'Maintenir une série de 30 jours',
    icon: <Flame className="w-6 h-6" />,
    category: 'streak',
    progress: 30,
    target: 30,
    unlocked: true,
    unlockedDate: '2024-02-15',
    rarity: 'legendary',
  },
  // XP achievements
  {
    id: 'xp_100',
    titleEn: 'First Steps',
    titleFr: 'Première Étape',
    descriptionEn: 'Earn 100 XP',
    descriptionFr: 'Gagner 100 XP',
    icon: <Zap className="w-6 h-6" />,
    category: 'xp',
    progress: 100,
    target: 100,
    unlocked: true,
    unlockedDate: '2024-01-10',
    rarity: 'common',
  },
  {
    id: 'xp_500',
    titleEn: 'Rising Star',
    titleFr: 'Étoile Montante',
    descriptionEn: 'Earn 500 XP',
    descriptionFr: 'Gagner 500 XP',
    icon: <Star className="w-6 h-6" />,
    category: 'xp',
    progress: 500,
    target: 500,
    unlocked: true,
    unlockedDate: '2024-01-18',
    rarity: 'common',
  },
  {
    id: 'xp_1000',
    titleEn: 'XP Champion',
    titleFr: 'Champion XP',
    descriptionEn: 'Earn 1,000 XP',
    descriptionFr: 'Gagner 1 000 XP',
    icon: <Trophy className="w-6 h-6" />,
    category: 'xp',
    progress: 1000,
    target: 1000,
    unlocked: true,
    unlockedDate: '2024-01-25',
    rarity: 'rare',
  },
  {
    id: 'xp_5000',
    titleEn: 'XP Legend',
    titleFr: 'Légende XP',
    descriptionEn: 'Earn 5,000 XP',
    descriptionFr: 'Gagner 5 000 XP',
    icon: <Award className="w-6 h-6" />,
    category: 'xp',
    progress: 5000,
    target: 5000,
    unlocked: true,
    unlockedDate: '2024-02-10',
    rarity: 'legendary',
  },
  // Case achievements
  {
    id: 'case_1',
    titleEn: 'Case Cracker',
    titleFr: 'Décrypteur de Cas',
    descriptionEn: 'Complete your first case',
    descriptionFr: 'Terminer votre premier cas',
    icon: <BookOpen className="w-6 h-6" />,
    category: 'cases',
    progress: 3,
    target: 1,
    unlocked: true,
    unlockedDate: '2024-01-12',
    rarity: 'common',
  },
  {
    id: 'case_5',
    titleEn: 'Case Expert',
    titleFr: 'Expert en Cas',
    descriptionEn: 'Complete 5 cases',
    descriptionFr: 'Terminer 5 cas',
    icon: <BookOpen className="w-6 h-6" />,
    category: 'cases',
    progress: 5,
    target: 5,
    unlocked: true,
    unlockedDate: '2024-02-01',
    rarity: 'rare',
  },
  // Practice achievements
  {
    id: 'practice_perfect',
    titleEn: 'Perfect Session',
    titleFr: 'Session Parfaite',
    descriptionEn: 'Complete a session with 100% accuracy',
    descriptionFr: 'Terminer une session avec 100% de précision',
    icon: <Target className="w-6 h-6" />,
    category: 'practice',
    progress: 10,
    target: 1,
    unlocked: true,
    unlockedDate: '2024-01-14',
    rarity: 'rare',
  },
  {
    id: 'calculator_master',
    titleEn: 'Human Calculator',
    titleFr: 'Calculateur Humain',
    descriptionEn: 'Score 50+ in the mental math challenge',
    descriptionFr: 'Atteindre 50+ au défi de calcul mental',
    icon: <Calculator className="w-6 h-6" />,
    category: 'practice',
    progress: 65,
    target: 50,
    unlocked: true,
    unlockedDate: '2024-02-05',
    rarity: 'epic',
  },
];

const CATEGORY_LABELS = {
  streak: { en: 'Streak', fr: 'Série' },
  xp: { en: 'Experience', fr: 'Expérience' },
  cases: { en: 'Cases', fr: 'Cas' },
  practice: { en: 'Practice', fr: 'Pratique' },
  special: { en: 'Special', fr: 'Spécial' },
};

const RARITY_CONFIG = {
  common: {
    label: { en: 'Common', fr: 'Commun' },
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gray-200',
  },
  rare: {
    label: { en: 'Rare', fr: 'Rare' },
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
  epic: {
    label: { en: 'Epic', fr: 'Épique' },
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
  legendary: {
    label: { en: 'Legendary', fr: 'Légendaire' },
    bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    iconBg: 'bg-gradient-to-br from-yellow-200 to-amber-200',
  },
};

export default function AchievementsPage() {
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const overallProgress = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = selectedCategory
    ? ACHIEVEMENTS.filter((a) => a.category === selectedCategory)
    : ACHIEVEMENTS;

  // Sort: unlocked first, then by rarity
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

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
              <h1 className="font-bold text-xl text-gray-900">
                {language === 'fr' ? 'Succès' : 'Achievements'}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {unlockedCount} / {totalCount}
                </h2>
                <p className="text-gray-500">
                  {language === 'fr' ? 'Succès débloqués' : 'Achievements unlocked'}
                </p>
                <div className="mt-3">
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-sm text-gray-400 mt-1">{overallProgress}% {language === 'fr' ? 'complété' : 'complete'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {language === 'fr' ? 'Tous' : 'All'}
          </Button>
          {Object.entries(CATEGORY_LABELS).map(([key, labels]) => {
            const count = ACHIEVEMENTS.filter((a) => a.category === key && a.unlocked).length;
            const total = ACHIEVEMENTS.filter((a) => a.category === key).length;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
              >
                {language === 'fr' ? labels.fr : labels.en}
                <span className="ml-2 text-xs opacity-70">({count}/{total})</span>
              </Button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedAchievements.map((achievement, index) => {
            const rarityConfig = RARITY_CONFIG[achievement.rarity];
            const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`overflow-hidden transition-all ${
                    achievement.unlocked
                      ? `${rarityConfig.bgColor} border-2 ${rarityConfig.borderColor}`
                      : 'bg-gray-100 border-gray-200 opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.unlocked ? rarityConfig.iconBg : 'bg-gray-200'
                        } ${achievement.unlocked ? rarityConfig.textColor : 'text-gray-400'}`}
                      >
                        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold truncate ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {language === 'fr' ? achievement.titleFr : achievement.titleEn}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            achievement.unlocked ? rarityConfig.textColor : 'text-gray-400'
                          } ${achievement.unlocked ? rarityConfig.bgColor : 'bg-gray-200'}`}>
                            {language === 'fr' ? rarityConfig.label.fr : rarityConfig.label.en}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${achievement.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                          {language === 'fr' ? achievement.descriptionFr : achievement.descriptionEn}
                        </p>
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span>{achievement.progress} / {achievement.target}</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-1.5" />
                          </div>
                        )}
                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-xs text-gray-400 mt-2">
                            {language === 'fr' ? 'Débloqué le' : 'Unlocked on'} {new Date(achievement.unlockedDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
