'use client';

import { motion } from 'framer-motion';
import { Flame, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  streakFreezeCount: number;
  lastActivityDate: string | null;
  className?: string;
}

export function StreakCounter({
  currentStreak,
  streakFreezeCount,
  lastActivityDate,
  className,
}: StreakCounterProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = lastActivityDate ? new Date(lastActivityDate) : null;
  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  const isActiveToday = lastActivity && lastActivity.getTime() === today.getTime();
  const isAtRisk = !isActiveToday && currentStreak > 0;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Streak */}
      <motion.div
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full',
          isActiveToday ? 'bg-orange-100' : isAtRisk ? 'bg-red-100' : 'bg-gray-100'
        )}
        animate={isAtRisk ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: isAtRisk ? Infinity : 0, duration: 2 }}
      >
        <Flame
          className={cn(
            'w-5 h-5',
            isActiveToday ? 'text-orange-500' : isAtRisk ? 'text-red-500' : 'text-gray-400'
          )}
        />
        <span
          className={cn(
            'font-bold text-lg',
            isActiveToday ? 'text-orange-600' : isAtRisk ? 'text-red-600' : 'text-gray-500'
          )}
        >
          {currentStreak}
        </span>
        <span className="text-sm text-gray-500">day{currentStreak !== 1 ? 's' : ''}</span>
      </motion.div>

      {/* Streak freeze */}
      {streakFreezeCount > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 rounded-full">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">{streakFreezeCount}</span>
        </div>
      )}

      {/* At risk warning */}
      {isAtRisk && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 rounded-full text-red-700">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">At risk!</span>
        </div>
      )}
    </div>
  );
}

interface StreakMilestoneProps {
  streak: number;
  show: boolean;
  onClose: () => void;
}

export function StreakMilestone({ streak, show, onClose }: StreakMilestoneProps) {
  if (!show) return null;

  const milestones: Record<number, { message: string; emoji: string }> = {
    3: { message: '3-day streak! You\'re building momentum!', emoji: '🔥' },
    7: { message: 'One week strong! Consistency is key!', emoji: '🎯' },
    14: { message: 'Two weeks! You\'re unstoppable!', emoji: '⚡' },
    30: { message: 'One month streak! Incredible dedication!', emoji: '🏆' },
    50: { message: '50 days! You\'re a legend!', emoji: '👑' },
    100: { message: '100 DAYS! Partner material!', emoji: '💎' },
  };

  const milestone = milestones[streak];
  if (!milestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl mb-4"
        >
          {milestone.emoji}
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {streak}-Day Streak!
        </h2>
        <p className="text-gray-600 mb-6">{milestone.message}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Keep Going!
        </button>
      </motion.div>
    </motion.div>
  );
}
