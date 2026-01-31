/**
 * SM-2 Spaced Repetition Algorithm Implementation
 * Based on SuperMemo 2 by Piotr Wozniak
 *
 * Quality scores:
 * 5 - perfect response, instant recall
 * 4 - correct after hesitation
 * 3 - correct with difficulty
 * 2 - incorrect, but correct answer seemed easy to recall
 * 1 - incorrect, correct answer remembered upon seeing it
 * 0 - complete blackout, no recognition
 */

export interface SM2Input {
  quality: number;
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
}

export interface SM2Output {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: Date;
  status: 'learning' | 'review' | 'mastered';
}

/**
 * Calculate new SM-2 values based on response quality
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { quality, repetitions, easeFactor, intervalDays } = input;

  let newRepetitions: number;
  let newIntervalDays: number;
  let newEaseFactor: number;

  // Calculate new ease factor (applies regardless of quality)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor minimum is 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  // Maximum ease factor to prevent intervals growing too fast
  if (newEaseFactor > 2.8) {
    newEaseFactor = 2.8;
  }

  // If quality < 3, reset repetitions (failed recall)
  if (quality < 3) {
    newRepetitions = 0;
    newIntervalDays = 1; // Review again tomorrow
  } else {
    // Successful recall
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newIntervalDays = 1;
    } else if (newRepetitions === 2) {
      newIntervalDays = 6;
    } else {
      newIntervalDays = Math.round(intervalDays * newEaseFactor);
    }
  }

  // Cap maximum interval at 365 days
  if (newIntervalDays > 365) {
    newIntervalDays = 365;
  }

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newIntervalDays);
  nextReviewAt.setHours(0, 0, 0, 0); // Start of day

  // Determine status based on repetitions and interval
  let status: 'learning' | 'review' | 'mastered';
  if (newRepetitions < 2) {
    status = 'learning';
  } else if (newIntervalDays >= 21) {
    status = 'mastered';
  } else {
    status = 'review';
  }

  return {
    repetitions: newRepetitions,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    intervalDays: newIntervalDays,
    nextReviewAt,
    status,
  };
}

/**
 * Convert user response to SM-2 quality score
 */
export function responseToQuality(params: {
  wasCorrect: boolean;
  responseTimeMs: number;
  expectedTimeMs: number;
  hintsUsed: number;
}): number {
  const { wasCorrect, responseTimeMs, expectedTimeMs, hintsUsed } = params;

  if (!wasCorrect) {
    // Incorrect responses: 0-2
    if (hintsUsed > 1) {
      return 0; // Complete blackout
    } else if (hintsUsed === 1) {
      return 1; // Remembered after hint
    }
    return 2; // Incorrect but recognized answer
  }

  // Correct responses: 3-5
  const timeRatio = responseTimeMs / expectedTimeMs;

  if (hintsUsed > 0) {
    return 3; // Correct but needed help
  } else if (timeRatio > 2) {
    return 3; // Correct but very slow (struggled)
  } else if (timeRatio > 1.5) {
    return 4; // Correct with some hesitation
  } else {
    return 5; // Perfect - fast and correct
  }
}

/**
 * Get items due for review
 */
export function isDueForReview(nextReviewAt: Date | null): boolean {
  if (!nextReviewAt) return true;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const reviewDate = new Date(nextReviewAt);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= now;
}

/**
 * Calculate priority score for sorting review queue
 * Higher score = more urgent
 */
export function calculateReviewPriority(params: {
  nextReviewAt: Date | null;
  easeFactor: number;
  status: string;
}): number {
  const { nextReviewAt, easeFactor, status } = params;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let priority = 0;

  // Base priority on overdue days
  if (nextReviewAt) {
    const reviewDate = new Date(nextReviewAt);
    reviewDate.setHours(0, 0, 0, 0);
    const overdueDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));

    if (overdueDays > 0) {
      priority += overdueDays * 10;
    }
  } else {
    // New items have moderate priority
    priority = 5;
  }

  // Lower ease factor = harder = higher priority
  priority += (3 - easeFactor) * 5;

  // Learning items get priority over review items
  if (status === 'learning') {
    priority += 20;
  }

  return priority;
}

/**
 * Estimate time to mastery based on current progress
 */
export function estimateTimeToMastery(params: {
  repetitions: number;
  easeFactor: number;
  averageSessionsPerDay: number;
}): number {
  const { repetitions, easeFactor, averageSessionsPerDay } = params;

  // Mastery typically requires 4-6 successful reviews
  const reviewsNeeded = Math.max(0, 6 - repetitions);

  // Calculate average interval progression
  let totalDays = 0;
  let currentInterval = 1;
  let currentReps = repetitions;

  for (let i = 0; i < reviewsNeeded; i++) {
    if (currentReps === 0) {
      currentInterval = 1;
    } else if (currentReps === 1) {
      currentInterval = 6;
    } else {
      currentInterval = Math.round(currentInterval * easeFactor);
    }
    totalDays += currentInterval;
    currentReps++;
  }

  // Factor in sessions per day
  return Math.ceil(totalDays / averageSessionsPerDay);
}
