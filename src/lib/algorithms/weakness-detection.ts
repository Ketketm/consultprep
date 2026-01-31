/**
 * Weakness Detection Algorithm
 * Identifies user's weak areas for targeted practice
 */

import type { TopicProficiency, WeaknessProfile } from '@/lib/types';

/**
 * Calculate proficiency score for a topic
 * Weighted combination of multiple factors
 *
 * @param masteryRate - items_mastered / items_total (0-1)
 * @param recentAccuracy - Last 10 attempts accuracy (0-1)
 * @param averageQuality - Average SM-2 quality (0-5)
 * @param recencyFactor - Decay based on days since practice (0-1)
 */
export function calculateTopicProficiency(params: {
  masteryRate: number;
  recentAccuracy: number;
  averageQuality: number;
  recencyFactor: number;
}): number {
  const { masteryRate, recentAccuracy, averageQuality, recencyFactor } = params;

  const weights = {
    mastery: 0.35,
    recentAccuracy: 0.3,
    quality: 0.2,
    recency: 0.15,
  };

  const normalizedQuality = averageQuality / 5; // Convert to 0-1

  const score =
    masteryRate * weights.mastery +
    recentAccuracy * weights.recentAccuracy +
    normalizedQuality * weights.quality +
    recencyFactor * weights.recency;

  return Math.round(score * 1000) / 10; // 0-100 with one decimal
}

/**
 * Calculate recency decay factor
 * Returns 1.0 for practiced today, decays over time
 *
 * Uses exponential decay with half-life of 7 days
 */
export function calculateRecencyFactor(daysSinceLastPractice: number): number {
  const halfLife = 7;
  return Math.pow(0.5, daysSinceLastPractice / halfLife);
}

/**
 * Categorize topics into weakness buckets
 */
export function categorizeWeaknesses(proficiencies: TopicProficiency[]): WeaknessProfile {
  const unlocked = proficiencies.filter((p) => p.isUnlocked);

  return {
    criticalWeaknesses: unlocked
      .filter((p) => p.proficiencyScore < 40)
      .sort((a, b) => a.proficiencyScore - b.proficiencyScore),

    moderateWeaknesses: unlocked
      .filter((p) => p.proficiencyScore >= 40 && p.proficiencyScore < 60)
      .sort((a, b) => a.proficiencyScore - b.proficiencyScore),

    rustingTopics: unlocked
      .filter((p) => p.proficiencyScore >= 60 && p.daysSinceLastPractice > 7)
      .sort((a, b) => b.daysSinceLastPractice - a.daysSinceLastPractice),

    strengthAreas: unlocked
      .filter((p) => p.proficiencyScore >= 80)
      .sort((a, b) => b.proficiencyScore - a.proficiencyScore),
  };
}

/**
 * Get priority score for a topic (higher = more urgent)
 */
export function getTopicPriority(proficiency: TopicProficiency): number {
  let priority = 0;

  // Critical weakness: highest priority
  if (proficiency.proficiencyScore < 40) {
    priority += 100 - proficiency.proficiencyScore;
  }
  // Moderate weakness
  else if (proficiency.proficiencyScore < 60) {
    priority += 60 - proficiency.proficiencyScore;
  }
  // Rusting topic (good but not practiced)
  else if (proficiency.daysSinceLastPractice > 7) {
    priority += proficiency.daysSinceLastPractice * 2;
  }

  // Factor in mastery rate
  const masteryRate = proficiency.itemsTotal > 0
    ? proficiency.itemsMastered / proficiency.itemsTotal
    : 0;
  priority += (1 - masteryRate) * 20;

  return priority;
}

/**
 * Get recommended topics for next session
 */
export function getRecommendedTopics(
  weaknessProfile: WeaknessProfile,
  maxTopics: number = 3
): TopicProficiency[] {
  const recommendations: TopicProficiency[] = [];

  // First, add critical weaknesses
  for (const topic of weaknessProfile.criticalWeaknesses) {
    if (recommendations.length >= maxTopics) break;
    recommendations.push(topic);
  }

  // Then moderate weaknesses
  for (const topic of weaknessProfile.moderateWeaknesses) {
    if (recommendations.length >= maxTopics) break;
    recommendations.push(topic);
  }

  // Then rusting topics
  for (const topic of weaknessProfile.rustingTopics) {
    if (recommendations.length >= maxTopics) break;
    recommendations.push(topic);
  }

  return recommendations;
}

/**
 * Calculate overall readiness score
 * Used to determine if user is ready for more challenging content
 */
export function calculateReadinessScore(proficiencies: TopicProficiency[]): {
  score: number;
  readyForAdvanced: boolean;
  message: string;
} {
  if (proficiencies.length === 0) {
    return {
      score: 0,
      readyForAdvanced: false,
      message: 'Start practicing to build your profile!',
    };
  }

  const avgProficiency =
    proficiencies.reduce((sum, p) => sum + p.proficiencyScore, 0) / proficiencies.length;

  const masteredCount = proficiencies.filter((p) => p.proficiencyScore >= 80).length;
  const masteryRate = masteredCount / proficiencies.length;

  // Score combines average proficiency and mastery rate
  const score = Math.round(avgProficiency * 0.6 + masteryRate * 100 * 0.4);

  let message: string;
  let readyForAdvanced = false;

  if (score >= 80) {
    message = "Outstanding! You're ready for advanced challenges.";
    readyForAdvanced = true;
  } else if (score >= 60) {
    message = "Great progress! Focus on weak areas to advance.";
    readyForAdvanced = avgProficiency >= 70;
  } else if (score >= 40) {
    message = "Good start! Keep practicing consistently.";
  } else {
    message = "Building foundations. Daily practice is key!";
  }

  return { score, readyForAdvanced, message };
}

/**
 * Get weakness summary for dashboard display
 */
export function getWeaknessSummary(profile: WeaknessProfile): {
  status: 'critical' | 'moderate' | 'healthy' | 'excellent';
  message: string;
  actionableTopics: string[];
} {
  if (profile.criticalWeaknesses.length >= 3) {
    return {
      status: 'critical',
      message: `${profile.criticalWeaknesses.length} areas need urgent attention`,
      actionableTopics: profile.criticalWeaknesses.slice(0, 3).map((t) => t.topicName),
    };
  }

  if (profile.criticalWeaknesses.length > 0 || profile.moderateWeaknesses.length >= 3) {
    const focusTopics = [
      ...profile.criticalWeaknesses.slice(0, 2),
      ...profile.moderateWeaknesses.slice(0, 2),
    ].slice(0, 3);

    return {
      status: 'moderate',
      message: 'Focus on these areas to improve',
      actionableTopics: focusTopics.map((t) => t.topicName),
    };
  }

  if (profile.rustingTopics.length > 0) {
    return {
      status: 'healthy',
      message: 'Great progress! Review these to stay sharp',
      actionableTopics: profile.rustingTopics.slice(0, 3).map((t) => t.topicName),
    };
  }

  return {
    status: 'excellent',
    message: "You're crushing it! Keep the momentum.",
    actionableTopics: [],
  };
}
