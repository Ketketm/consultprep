/**
 * Gamification Logic
 * Handles XP, streaks, levels, and achievements
 */

import { LEVEL_THRESHOLDS, getLevelForXp } from '@/lib/types';

export interface DailyActivityCheck {
  userId: string;
  currentStreak: number;
  lastActivityDate: Date | null;
  streakFreezeAvailable: number;
}

export interface StreakUpdateResult {
  newStreak: number;
  streakMaintained: boolean;
  streakBroken: boolean;
  streakFreezeUsed: boolean;
  xpBonus: number;
}

/**
 * Check and update user's streak
 */
export function calculateStreakUpdate(check: DailyActivityCheck): StreakUpdateResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActivity = check.lastActivityDate ? new Date(check.lastActivityDate) : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  const result: StreakUpdateResult = {
    newStreak: check.currentStreak,
    streakMaintained: false,
    streakBroken: false,
    streakFreezeUsed: false,
    xpBonus: 0,
  };

  // Already practiced today
  if (lastActivity && lastActivity.getTime() === today.getTime()) {
    result.streakMaintained = true;
    return result;
  }

  // Practiced yesterday - streak continues
  if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
    result.newStreak = check.currentStreak + 1;
    result.streakMaintained = true;
    result.xpBonus = calculateStreakBonus(result.newStreak);
    return result;
  }

  // First activity ever
  if (!lastActivity) {
    result.newStreak = 1;
    return result;
  }

  // Missed yesterday but have streak freeze
  const daysMissed = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (check.streakFreezeAvailable > 0 && daysMissed <= 2) {
    // Freeze covers 1-2 days
    result.streakMaintained = true;
    result.streakFreezeUsed = true;
    result.newStreak = check.currentStreak + 1;
    result.xpBonus = calculateStreakBonus(result.newStreak);
    return result;
  }

  // Streak broken
  result.newStreak = 1;
  result.streakBroken = true;
  return result;
}

/**
 * Calculate XP bonus based on streak length
 * Diminishing returns after 7 days
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays <= 0) return 0;
  if (streakDays <= 7) return streakDays * 2; // 2-14 XP
  if (streakDays <= 30) return 14 + (streakDays - 7); // 15-37 XP
  return 37 + Math.floor((streakDays - 30) / 5); // Slower growth after 30 days
}

/**
 * Calculate XP for completing a session
 */
export function calculateSessionXP(params: {
  itemsCorrect: number;
  itemsAttempted: number;
  sessionType: string;
  streakBonus: number;
  perfectBonus: boolean;
}): {
  baseXP: number;
  accuracyBonus: number;
  streakBonus: number;
  perfectBonus: number;
  totalXP: number;
} {
  const { itemsCorrect, itemsAttempted, sessionType, streakBonus, perfectBonus } = params;

  // Base XP per correct answer
  const xpPerItem: Record<string, number> = {
    practice: 5,
    review: 8, // Review is harder, worth more
    quick_drill: 4,
    full_case: 10,
  };

  const baseXP = itemsCorrect * (xpPerItem[sessionType] || 5);

  // Accuracy bonus (only if > 80%)
  const accuracy = itemsAttempted > 0 ? itemsCorrect / itemsAttempted : 0;
  const accuracyBonusAmount = accuracy >= 0.8 ? Math.round(baseXP * 0.2) : 0;

  // Perfect session bonus
  const perfectBonusAmount = perfectBonus && itemsAttempted >= 5 ? 25 : 0;

  return {
    baseXP,
    accuracyBonus: accuracyBonusAmount,
    streakBonus,
    perfectBonus: perfectBonusAmount,
    totalXP: baseXP + accuracyBonusAmount + streakBonus + perfectBonusAmount,
  };
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(
  currentLevel: number,
  currentXP: number,
  xpToAdd: number
): { leveledUp: boolean; newLevel: number; newTitle: string } | null {
  const newTotalXP = currentXP + xpToAdd;
  const newLevelInfo = getLevelForXp(newTotalXP);

  if (newLevelInfo.level > currentLevel) {
    return {
      leveledUp: true,
      newLevel: newLevelInfo.level,
      newTitle: newLevelInfo.title,
    };
  }

  return null;
}

/**
 * Get random encouragement message based on performance
 */
export function getEncouragementMessage(params: {
  wasCorrect: boolean;
  streak: number;
  accuracy: number;
}): string {
  const { wasCorrect, streak, accuracy } = params;

  const correctMessages = [
    'Excellent!',
    'Perfect!',
    'Outstanding!',
    'Nailed it!',
    'Brilliant!',
    'Sharp thinking!',
    'McKinsey material!',
    'Consultant mode: ON',
  ];

  const incorrectMessages = [
    'Good try!',
    'Almost there!',
    'Keep learning!',
    'You got this next time!',
    'Part of the process!',
  ];

  const streakMessages: Record<number, string> = {
    7: "One week strong! You're building a habit.",
    14: 'Two weeks! Consistency is key.',
    30: 'One month streak! Incredible dedication.',
    50: "50 days! You're unstoppable!",
    100: "100 DAYS! You're a legend!",
  };

  // Check for streak milestone
  if (streakMessages[streak]) {
    return streakMessages[streak];
  }

  if (!wasCorrect) {
    return incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
  }

  // High accuracy bonus message
  if (accuracy >= 0.9) {
    return correctMessages[Math.floor(Math.random() * correctMessages.length)];
  }

  return correctMessages[Math.floor(Math.random() * correctMessages.length)];
}

/**
 * Achievement definitions
 */
export const ACHIEVEMENT_DEFINITIONS = [
  // Streak achievements
  { slug: 'streak_3', name: 'Getting Started', description: '3-day streak', type: 'streak', value: 3, tier: 'bronze', xp: 10 },
  { slug: 'streak_7', name: 'Week Warrior', description: '7-day streak', type: 'streak', value: 7, tier: 'bronze', xp: 25 },
  { slug: 'streak_14', name: 'Fortnight Fighter', description: '14-day streak', type: 'streak', value: 14, tier: 'silver', xp: 50 },
  { slug: 'streak_30', name: 'Monthly Master', description: '30-day streak', type: 'streak', value: 30, tier: 'gold', xp: 100 },
  { slug: 'streak_100', name: 'Centurion', description: '100-day streak', type: 'streak', value: 100, tier: 'platinum', xp: 500 },

  // XP achievements
  { slug: 'xp_100', name: 'First Steps', description: 'Earn 100 XP', type: 'total_xp', value: 100, tier: 'bronze', xp: 0 },
  { slug: 'xp_500', name: 'Rising Star', description: 'Earn 500 XP', type: 'total_xp', value: 500, tier: 'bronze', xp: 0 },
  { slug: 'xp_1000', name: 'Consultant', description: 'Earn 1,000 XP', type: 'total_xp', value: 1000, tier: 'silver', xp: 0 },
  { slug: 'xp_5000', name: 'Expert', description: 'Earn 5,000 XP', type: 'total_xp', value: 5000, tier: 'gold', xp: 0 },
  { slug: 'xp_10000', name: 'Partner Material', description: 'Earn 10,000 XP', type: 'total_xp', value: 10000, tier: 'platinum', xp: 0 },

  // Perfect session achievements
  { slug: 'perfect_1', name: 'Flawless', description: 'Complete a perfect session', type: 'perfect_sessions', value: 1, tier: 'bronze', xp: 15 },
  { slug: 'perfect_10', name: 'Precision Player', description: '10 perfect sessions', type: 'perfect_sessions', value: 10, tier: 'silver', xp: 50 },
  { slug: 'perfect_50', name: 'Perfectionist', description: '50 perfect sessions', type: 'perfect_sessions', value: 50, tier: 'gold', xp: 150 },
] as const;

/**
 * Check if user earned any new achievements
 */
export function checkNewAchievements(params: {
  currentStreak: number;
  totalXP: number;
  perfectSessions: number;
  earnedAchievementSlugs: string[];
}): typeof ACHIEVEMENT_DEFINITIONS[number][] {
  const { currentStreak, totalXP, perfectSessions, earnedAchievementSlugs } = params;

  const newAchievements: typeof ACHIEVEMENT_DEFINITIONS[number][] = [];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    // Skip if already earned
    if (earnedAchievementSlugs.includes(achievement.slug)) {
      continue;
    }

    let earned = false;

    switch (achievement.type) {
      case 'streak':
        earned = currentStreak >= achievement.value;
        break;
      case 'total_xp':
        earned = totalXP >= achievement.value;
        break;
      case 'perfect_sessions':
        earned = perfectSessions >= achievement.value;
        break;
    }

    if (earned) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}
