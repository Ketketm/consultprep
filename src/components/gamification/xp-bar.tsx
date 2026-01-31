'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getXpProgressToNextLevel, getLevelForXp } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';

interface XPBarProps {
  totalXP: number;
  className?: string;
  showDetails?: boolean;
  showXP?: boolean;
  showProgress?: boolean;
}

export function XPBar({ totalXP, className, showDetails = true, showXP = true, showProgress = true }: XPBarProps) {
  const currentLevel = getLevelForXp(totalXP);
  const progress = getXpProgressToNextLevel(totalXP);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700">
            <span className="text-sm font-bold">{currentLevel.level}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{currentLevel.title}</p>
            {showDetails && (
              <p className="text-xs text-gray-500">
                {formatNumber(progress.current)} / {formatNumber(progress.required)} XP to next level
              </p>
            )}
          </div>
        </div>
        {showXP && (
          <div className="flex items-center gap-1 text-primary-600">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">{formatNumber(totalXP)} XP</span>
          </div>
        )}
      </div>

      {showProgress && <Progress value={progress.percentage} className="h-2" />}
    </div>
  );
}

interface XPPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XPPopup({ amount, show, onComplete }: XPPopupProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 1000);
      }}
      className="fixed top-20 right-8 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg">
        <Zap className="w-5 h-5" />
        <span className="font-bold">+{amount} XP</span>
      </div>
    </motion.div>
  );
}
