'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementToastProps {
  show: boolean;
  achievement: {
    name: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    xpReward: number;
  } | null;
  onClose: () => void;
}

export function AchievementToast({ show, achievement, onClose }: AchievementToastProps) {
  if (!achievement) return null;

  const tierColors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600',
  };

  const tierBgColors = {
    bronze: 'bg-amber-50 border-amber-200',
    silver: 'bg-gray-50 border-gray-200',
    gold: 'bg-yellow-50 border-yellow-200',
    platinum: 'bg-cyan-50 border-cyan-200',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 z-50"
        >
          <div
            className={cn(
              'flex items-center gap-4 px-6 py-4 rounded-2xl border-2 shadow-lg min-w-[300px]',
              tierBgColors[achievement.tier]
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br',
                tierColors[achievement.tier]
              )}
            >
              <Trophy className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Achievement Unlocked!
              </p>
              <p className="font-bold text-gray-900">{achievement.name}</p>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              {achievement.xpReward > 0 && (
                <p className="text-sm font-medium text-primary-600 mt-1">
                  +{achievement.xpReward} XP
                </p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementCardProps {
  achievement: {
    name: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    earned: boolean;
    earnedAt?: string;
  };
  className?: string;
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  const tierColors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600',
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 p-4 rounded-xl border bg-white transition-all',
        achievement.earned ? 'border-gray-200' : 'border-gray-100 opacity-50',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full',
          achievement.earned
            ? cn('bg-gradient-to-br', tierColors[achievement.tier])
            : 'bg-gray-200'
        )}
      >
        {achievement.earned ? (
          <Trophy className="w-6 h-6 text-white" />
        ) : (
          <Star className="w-6 h-6 text-gray-400" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{achievement.name}</p>
        <p className="text-sm text-gray-500">{achievement.description}</p>
      </div>

      {achievement.earned && achievement.earnedAt && (
        <div className="text-xs text-gray-400">
          {new Date(achievement.earnedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
