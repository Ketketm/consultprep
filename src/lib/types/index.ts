// ============================================================
// Type Definitions for ConsultPrep
// ============================================================

// Session Types
export type SessionType = 'practice' | 'review' | 'quick_drill' | 'full_case';

// Content Types
export type ContentType = 'flashcard' | 'drill' | 'case_step' | 'quiz' | 'fact';

// ============================================================
// Content Item Types
// ============================================================

export interface ContentItem {
  id: string;
  lessonId: string;
  contentType: ContentType;
  difficulty: number;
  tags: string[];
  estimatedSeconds: number;
  xpValue: number;
  displayOrder: number;
  isActive?: boolean;
}

export interface DrillOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface Drill {
  contentItemId: string;
  scenarioText: string;
  scenarioImageUrl: string | null;
  questionText: string;
  options: DrillOption[];
  timeLimitSeconds: number | null;
  explanation: string;
  frameworkHint: string | null;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'table' | 'bar_grouped';
  title?: string;
  data?: Array<{ label: string; value: number | null }>;
  headers?: string[];
  rows?: string[][];
  categories?: string[];
  series?: Array<{ name: string; data: number[] }>;
}

export interface QuizQuestion {
  contentItemId: string;
  questionType: 'chart_reading' | 'data_interpretation' | 'industry_knowledge';
  questionText: string;
  chartData: ChartData | null;
  chartImageUrl: string | null;
  options: DrillOption[];
  explanation: string;
  dataSource: string | null;
}

export interface Flashcard {
  contentItemId: string;
  frontContent: string;
  frontImageUrl: string | null;
  backContent: string;
  backImageUrl: string | null;
  explanation: string | null;
  formula: string | null;
  mnemonic: string | null;
  relatedFlashcardIds: string[];
}

export interface Fact {
  contentItemId: string;
  factText: string;
  category: 'economics' | 'industry' | 'company' | 'geography' | null;
  verificationQuestion: string | null;
  answer: {
    correct: string;
    alternatives?: string[];
    explanation?: string;
  };
  source: string | null;
}

// ============================================================
// User Progress Types
// ============================================================

export interface TopicProficiency {
  topicId: string;
  topicName: string;
  pillarId: string;
  proficiencyScore: number;
  itemsTotal: number;
  itemsSeen: number;
  itemsMastered: number;
  recentAccuracy: number;
  averageQuality: number;
  daysSinceLastPractice: number;
  isUnlocked: boolean;
}

export interface WeaknessProfile {
  criticalWeaknesses: TopicProficiency[];
  moderateWeaknesses: TopicProficiency[];
  rustingTopics: TopicProficiency[];
  strengthAreas: TopicProficiency[];
}

// ============================================================
// Gamification Types
// ============================================================

export interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
  perks: {
    heartsMax?: number;
    streakFreezeEarned?: number;
  };
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: 'Analyst Intern', perks: { heartsMax: 5 } },
  { level: 2, xpRequired: 60, title: 'Junior Analyst', perks: { heartsMax: 5 } },
  { level: 3, xpRequired: 150, title: 'Analyst', perks: { heartsMax: 5, streakFreezeEarned: 1 } },
  { level: 4, xpRequired: 300, title: 'Senior Analyst', perks: { heartsMax: 6 } },
  { level: 5, xpRequired: 500, title: 'Associate', perks: { heartsMax: 6, streakFreezeEarned: 1 } },
  { level: 6, xpRequired: 800, title: 'Senior Associate', perks: { heartsMax: 7 } },
  { level: 7, xpRequired: 1200, title: 'Engagement Manager', perks: { heartsMax: 7, streakFreezeEarned: 1 } },
  { level: 8, xpRequired: 1800, title: 'Principal', perks: { heartsMax: 8 } },
  { level: 9, xpRequired: 2600, title: 'Associate Partner', perks: { heartsMax: 8, streakFreezeEarned: 2 } },
  { level: 10, xpRequired: 3600, title: 'Partner', perks: { heartsMax: 10, streakFreezeEarned: 2 } },
  { level: 11, xpRequired: 5000, title: 'Senior Partner', perks: { heartsMax: 10 } },
  { level: 12, xpRequired: 7000, title: 'Managing Director', perks: { heartsMax: 12 } },
  { level: 13, xpRequired: 10000, title: 'Global Managing Partner', perks: { heartsMax: 15 } },
];

export function getLevelForXp(xp: number): LevelThreshold {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return LEVEL_THRESHOLDS[0];
}

export function getXpProgressToNextLevel(xp: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const currentLevel = getLevelForXp(xp);
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex((l) => l.level === currentLevel.level) + 1;

  if (nextLevelIndex >= LEVEL_THRESHOLDS.length) {
    return { current: xp, required: xp, percentage: 100 };
  }

  const nextLevel = LEVEL_THRESHOLDS[nextLevelIndex];
  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpRequiredForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;

  return {
    current: xpInCurrentLevel,
    required: xpRequiredForNextLevel,
    percentage: Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100)),
  };
}

// ============================================================
// Session Types
// ============================================================

export interface SessionItem {
  contentItem: ContentItem;
  detail: Drill | QuizQuestion | Flashcard | Fact;
}
