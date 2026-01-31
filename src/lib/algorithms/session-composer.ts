/**
 * Session Composer Algorithm
 * Composes optimal learning sessions based on user's state
 */

import type { ContentItem, SessionType, TopicProficiency, WeaknessProfile } from '@/lib/types';
import { isDueForReview, calculateReviewPriority } from './spaced-repetition';
import { categorizeWeaknesses, getTopicPriority } from './weakness-detection';

export interface SessionConfig {
  targetDurationMinutes: number;
  sessionType: SessionType;
  focusPillarId?: string;
  focusTopicId?: string;
}

export interface ContentItemWithContext {
  contentItem: ContentItem;
  selectionReason: 'review_due' | 'weakness' | 'new' | 'reinforcement';
  priority: number;
  topicId?: string;
  pillarId?: string;
}

export interface SessionComposition {
  items: ContentItemWithContext[];
  estimatedDurationMinutes: number;
  breakdown: {
    reviewDue: number;
    weaknessItems: number;
    newItems: number;
    reinforcement: number;
  };
}

export interface SessionRatios {
  review: number;
  weakness: number;
  new: number;
}

/**
 * Get allocation ratios based on session type
 */
export function getSessionRatios(sessionType: SessionType): SessionRatios {
  switch (sessionType) {
    case 'review':
      return { review: 0.7, weakness: 0.2, new: 0.1 };
    case 'quick_drill':
      return { review: 0.3, weakness: 0.4, new: 0.3 };
    case 'full_case':
      return { review: 0.2, weakness: 0.3, new: 0.5 };
    case 'practice':
    default:
      return { review: 0.4, weakness: 0.3, new: 0.3 };
  }
}

/**
 * Estimate number of items for target duration
 * Average time per item varies by content type
 */
export function estimateItemCount(targetMinutes: number): number {
  // Average 30 seconds per item (mix of flashcards, drills, quizzes)
  const itemsPerMinute = 2;
  return Math.max(5, Math.round(targetMinutes * itemsPerMinute));
}

/**
 * Calculate estimated duration from items
 */
export function calculateEstimatedDuration(items: ContentItemWithContext[]): number {
  const totalSeconds = items.reduce((sum, item) => {
    return sum + (item.contentItem.estimatedSeconds || 30);
  }, 0);
  return Math.ceil(totalSeconds / 60);
}

/**
 * Interleave items to avoid topic clustering
 * Uses round-robin across topics for better retention
 */
export function interleaveItems(items: ContentItemWithContext[]): ContentItemWithContext[] {
  if (items.length <= 1) return items;

  // Group by topic
  const byTopic = new Map<string, ContentItemWithContext[]>();

  items.forEach((item) => {
    const topicId = item.topicId || 'unknown';
    if (!byTopic.has(topicId)) {
      byTopic.set(topicId, []);
    }
    byTopic.get(topicId)!.push(item);
  });

  // If only one topic, return as-is sorted by priority
  if (byTopic.size === 1) {
    return items.sort((a, b) => b.priority - a.priority);
  }

  // Round-robin interleave
  const interleaved: ContentItemWithContext[] = [];
  const topicArrays = Array.from(byTopic.values());
  const maxLength = Math.max(...topicArrays.map((arr) => arr.length));

  for (let i = 0; i < maxLength; i++) {
    for (const topicItems of topicArrays) {
      if (i < topicItems.length) {
        interleaved.push(topicItems[i]);
      }
    }
  }

  return interleaved;
}

/**
 * Select review due items (spaced repetition)
 */
export function selectReviewDueItems(
  allProgress: Array<{
    contentItemId: string;
    nextReviewAt: Date | null;
    easeFactor: number;
    status: string;
    contentItem: ContentItem;
    topicId?: string;
    pillarId?: string;
  }>,
  limit: number,
  options?: { pillarId?: string; topicId?: string }
): ContentItemWithContext[] {
  let filtered = allProgress.filter((p) => {
    // Must be due for review
    if (!isDueForReview(p.nextReviewAt)) return false;

    // Must be learning or review status
    if (p.status !== 'learning' && p.status !== 'review') return false;

    // Apply filters if specified
    if (options?.pillarId && p.pillarId !== options.pillarId) return false;
    if (options?.topicId && p.topicId !== options.topicId) return false;

    return true;
  });

  // Sort by priority
  filtered.sort((a, b) => {
    const priorityA = calculateReviewPriority({
      nextReviewAt: a.nextReviewAt,
      easeFactor: a.easeFactor,
      status: a.status,
    });
    const priorityB = calculateReviewPriority({
      nextReviewAt: b.nextReviewAt,
      easeFactor: b.easeFactor,
      status: b.status,
    });
    return priorityB - priorityA;
  });

  return filtered.slice(0, limit).map((p) => ({
    contentItem: p.contentItem,
    selectionReason: 'review_due' as const,
    priority: calculateReviewPriority({
      nextReviewAt: p.nextReviewAt,
      easeFactor: p.easeFactor,
      status: p.status,
    }),
    topicId: p.topicId,
    pillarId: p.pillarId,
  }));
}

/**
 * Select items from weak areas
 */
export function selectWeaknessItems(
  allItems: Array<{
    contentItem: ContentItem;
    topicId: string;
    pillarId: string;
    userProgress?: { easeFactor: number; status: string };
  }>,
  weaknessProfile: WeaknessProfile,
  limit: number,
  excludeIds: Set<string>
): ContentItemWithContext[] {
  // Get weak topic IDs in priority order
  const weakTopicIds = [
    ...weaknessProfile.criticalWeaknesses.map((w) => w.topicId),
    ...weaknessProfile.moderateWeaknesses.map((w) => w.topicId),
  ];

  if (weakTopicIds.length === 0) return [];

  // Create topic priority map
  const topicPriorityMap = new Map<string, number>();
  weaknessProfile.criticalWeaknesses.forEach((t, i) => {
    topicPriorityMap.set(t.topicId, 100 - i);
  });
  weaknessProfile.moderateWeaknesses.forEach((t, i) => {
    topicPriorityMap.set(t.topicId, 50 - i);
  });

  // Filter items from weak topics
  const weakItems = allItems.filter((item) => {
    if (excludeIds.has(item.contentItem.id)) return false;
    if (!weakTopicIds.includes(item.topicId)) return false;

    // Prefer items user struggled with (low ease factor)
    return true;
  });

  // Sort by topic priority and then by difficulty (lower ease = higher priority)
  weakItems.sort((a, b) => {
    const topicPriorityA = topicPriorityMap.get(a.topicId) || 0;
    const topicPriorityB = topicPriorityMap.get(b.topicId) || 0;

    if (topicPriorityA !== topicPriorityB) {
      return topicPriorityB - topicPriorityA;
    }

    // Secondary sort by ease factor (harder items first)
    const easeA = a.userProgress?.easeFactor ?? 2.5;
    const easeB = b.userProgress?.easeFactor ?? 2.5;
    return easeA - easeB;
  });

  return weakItems.slice(0, limit).map((item) => ({
    contentItem: item.contentItem,
    selectionReason: 'weakness' as const,
    priority: topicPriorityMap.get(item.topicId) || 0,
    topicId: item.topicId,
    pillarId: item.pillarId,
  }));
}

/**
 * Select new (unseen) items
 */
export function selectNewItems(
  allItems: Array<{
    contentItem: ContentItem;
    topicId: string;
    pillarId: string;
    seen: boolean;
  }>,
  limit: number,
  excludeIds: Set<string>,
  options?: {
    pillarId?: string;
    topicId?: string;
    difficultyRange?: { min: number; max: number };
  }
): ContentItemWithContext[] {
  let filtered = allItems.filter((item) => {
    if (excludeIds.has(item.contentItem.id)) return false;
    if (item.seen) return false;

    // Apply filters
    if (options?.pillarId && item.pillarId !== options.pillarId) return false;
    if (options?.topicId && item.topicId !== options.topicId) return false;

    // Apply difficulty range
    if (options?.difficultyRange) {
      const { min, max } = options.difficultyRange;
      const difficulty = item.contentItem.difficulty;
      if (difficulty < min || difficulty > max) return false;
    }

    return true;
  });

  // Sort by display order and difficulty
  filtered.sort((a, b) => {
    // Lower difficulty first for new items
    if (a.contentItem.difficulty !== b.contentItem.difficulty) {
      return a.contentItem.difficulty - b.contentItem.difficulty;
    }
    return a.contentItem.displayOrder - b.contentItem.displayOrder;
  });

  return filtered.slice(0, limit).map((item) => ({
    contentItem: item.contentItem,
    selectionReason: 'new' as const,
    priority: 10 - item.contentItem.difficulty, // Lower difficulty = higher priority for new items
    topicId: item.topicId,
    pillarId: item.pillarId,
  }));
}

/**
 * Select reinforcement items (recently mastered, for confidence)
 */
export function selectReinforcementItems(
  allProgress: Array<{
    contentItemId: string;
    masteredAt: Date | null;
    contentItem: ContentItem;
    topicId?: string;
    pillarId?: string;
  }>,
  limit: number,
  excludeIds: Set<string>
): ContentItemWithContext[] {
  // Get recently mastered items (within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const mastered = allProgress.filter((p) => {
    if (excludeIds.has(p.contentItemId)) return false;
    if (!p.masteredAt) return false;

    const masteredDate = new Date(p.masteredAt);
    return masteredDate >= thirtyDaysAgo;
  });

  // Sort by most recently mastered
  mastered.sort((a, b) => {
    const dateA = new Date(a.masteredAt!);
    const dateB = new Date(b.masteredAt!);
    return dateB.getTime() - dateA.getTime();
  });

  return mastered.slice(0, limit).map((p) => ({
    contentItem: p.contentItem,
    selectionReason: 'reinforcement' as const,
    priority: 1,
    topicId: p.topicId,
    pillarId: p.pillarId,
  }));
}

/**
 * Determine appropriate difficulty range based on recent performance
 */
export function getAppropriateDifficultyRange(
  recentReviews: Array<{ qualityScore: number; difficulty: number }>
): { min: number; max: number } {
  if (recentReviews.length < 5) {
    return { min: 1, max: 2 }; // Start easy for new users
  }

  const avgQuality =
    recentReviews.reduce((sum, r) => sum + r.qualityScore, 0) / recentReviews.length;
  const currentMaxDifficulty = Math.max(...recentReviews.map((r) => r.difficulty));

  // If performing well, allow harder content
  if (avgQuality >= 4) {
    return {
      min: Math.max(currentMaxDifficulty - 1, 1),
      max: Math.min(currentMaxDifficulty + 1, 5),
    };
  } else if (avgQuality >= 3) {
    return {
      min: Math.max(currentMaxDifficulty - 1, 1),
      max: currentMaxDifficulty,
    };
  } else {
    // Struggling - step back
    return {
      min: 1,
      max: Math.max(currentMaxDifficulty - 1, 1),
    };
  }
}

/**
 * Main session composition function
 * This is a simplified version - actual implementation would query the database
 */
export function composeSession(
  config: SessionConfig,
  data: {
    reviewDueItems: ContentItemWithContext[];
    weaknessItems: ContentItemWithContext[];
    newItems: ContentItemWithContext[];
    reinforcementItems: ContentItemWithContext[];
  }
): SessionComposition {
  const targetItemCount = estimateItemCount(config.targetDurationMinutes);
  const ratios = getSessionRatios(config.sessionType);

  const items: ContentItemWithContext[] = [];
  const excludeIds = new Set<string>();

  // 1. Add review due items
  const reviewCount = Math.ceil(targetItemCount * ratios.review);
  for (const item of data.reviewDueItems) {
    if (items.length >= reviewCount) break;
    if (!excludeIds.has(item.contentItem.id)) {
      items.push(item);
      excludeIds.add(item.contentItem.id);
    }
  }

  // 2. Add weakness items
  const weaknessCount = Math.ceil(targetItemCount * ratios.weakness);
  for (const item of data.weaknessItems) {
    if (items.length >= reviewCount + weaknessCount) break;
    if (!excludeIds.has(item.contentItem.id)) {
      items.push(item);
      excludeIds.add(item.contentItem.id);
    }
  }

  // 3. Add new items
  const newCount = Math.ceil(targetItemCount * ratios.new);
  for (const item of data.newItems) {
    if (items.length >= targetItemCount) break;
    if (!excludeIds.has(item.contentItem.id)) {
      items.push(item);
      excludeIds.add(item.contentItem.id);
    }
  }

  // 4. Fill remaining with reinforcement
  for (const item of data.reinforcementItems) {
    if (items.length >= targetItemCount) break;
    if (!excludeIds.has(item.contentItem.id)) {
      items.push(item);
      excludeIds.add(item.contentItem.id);
    }
  }

  // Interleave for optimal learning
  const interleavedItems = interleaveItems(items);

  return {
    items: interleavedItems,
    estimatedDurationMinutes: calculateEstimatedDuration(interleavedItems),
    breakdown: {
      reviewDue: items.filter((i) => i.selectionReason === 'review_due').length,
      weaknessItems: items.filter((i) => i.selectionReason === 'weakness').length,
      newItems: items.filter((i) => i.selectionReason === 'new').length,
      reinforcement: items.filter((i) => i.selectionReason === 'reinforcement').length,
    },
  };
}
