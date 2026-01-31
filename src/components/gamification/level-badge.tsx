'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Sparkles } from 'lucide-react';
import { getLevelForXp, LEVEL_THRESHOLDS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

export function LevelBadge({ level, size = 'md', showTitle = false, className }: LevelBadgeProps) {
  const levelInfo = LEVEL_THRESHOLDS.find((l) => l.level === level) || LEVEL_THRESHOLDS[0];

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const getGradient = (lvl: number) => {
    if (lvl >= 10) return 'from-yellow-400 to-amber-600'; // Partner+
    if (lvl >= 7) return 'from-purple-400 to-purple-600'; // EM+
    if (lvl >= 4) return 'from-blue-400 to-blue-600'; // Senior Analyst+
    return 'from-gray-400 to-gray-600'; // Entry level
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-lg',
          sizeClasses[size],
          getGradient(level)
        )}
      >
        {level}
      </div>
      {showTitle && (
        <div>
          <p className="font-semibold text-gray-900">{levelInfo.title}</p>
          <p className="text-xs text-gray-500">Level {level}</p>
        </div>
      )}
    </div>
  );
}

interface LevelUpModalProps {
  show: boolean;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export function LevelUpModal({ show, newLevel, newTitle, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <Sparkles className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Level Up!
              </motion.h2>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="my-6"
              >
                <LevelBadge level={newLevel} size="lg" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg font-semibold text-primary-600 mb-1">{newTitle}</p>
                <p className="text-sm text-gray-500">Keep up the great work!</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
