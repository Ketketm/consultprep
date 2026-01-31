import { create } from 'zustand';
import type { SessionType, SessionItem } from '@/lib/types';

interface SessionState {
  isActive: boolean;
  sessionType: SessionType | null;
  items: SessionItem[];
  currentIndex: number;
  startTime: Date | null;
  itemsAttempted: number;
  itemsCorrect: number;
  xpEarned: number;
  itemResults: Array<{
    contentItemId: string;
    wasCorrect: boolean;
    qualityScore: number;
    responseTimeMs: number;
    hintsUsed: number;
  }>;

  startSession: (type: SessionType, items: SessionItem[]) => void;
  recordAnswer: (params: {
    wasCorrect: boolean;
    qualityScore: number;
    responseTimeMs: number;
    hintsUsed?: number;
  }) => void;
  skipItem: () => void;
  nextItem: () => void;
  endSession: () => {
    itemsAttempted: number;
    itemsCorrect: number;
    accuracy: number;
    xpEarned: number;
    durationSeconds: number;
    perfectSession: boolean;
  };
  resetSession: () => void;
}

const initialState = {
  isActive: false,
  sessionType: null as SessionType | null,
  items: [] as SessionItem[],
  currentIndex: 0,
  startTime: null as Date | null,
  itemsAttempted: 0,
  itemsCorrect: 0,
  xpEarned: 0,
  itemResults: [] as SessionState['itemResults'],
};

export const useSessionStore = create<SessionState>((set, get) => ({
  ...initialState,

  startSession: (type, items) => {
    set({
      isActive: true,
      sessionType: type,
      items,
      currentIndex: 0,
      startTime: new Date(),
      itemsAttempted: 0,
      itemsCorrect: 0,
      xpEarned: 0,
      itemResults: [],
    });
  },

  recordAnswer: ({ wasCorrect, qualityScore, responseTimeMs, hintsUsed = 0 }) => {
    const state = get();
    const currentItem = state.items[state.currentIndex];
    if (!currentItem) return;

    const xpGained = wasCorrect
      ? Math.max(0, currentItem.contentItem.xpValue - (hintsUsed > 0 ? 5 : 0))
      : 0;

    set({
      itemsAttempted: state.itemsAttempted + 1,
      itemsCorrect: state.itemsCorrect + (wasCorrect ? 1 : 0),
      xpEarned: state.xpEarned + xpGained,
      itemResults: [
        ...state.itemResults,
        {
          contentItemId: currentItem.contentItem.id,
          wasCorrect,
          qualityScore,
          responseTimeMs,
          hintsUsed,
        },
      ],
    });
  },

  skipItem: () => {
    const state = get();
    const currentItem = state.items[state.currentIndex];
    if (!currentItem) return;

    set({
      itemsAttempted: state.itemsAttempted + 1,
      xpEarned: Math.max(0, state.xpEarned - 5),
      itemResults: [
        ...state.itemResults,
        {
          contentItemId: currentItem.contentItem.id,
          wasCorrect: false,
          qualityScore: 0,
          responseTimeMs: 0,
          hintsUsed: 0,
        },
      ],
    });
  },

  nextItem: () => {
    const state = get();
    if (state.currentIndex < state.items.length - 1) {
      set({ currentIndex: state.currentIndex + 1 });
    }
  },

  endSession: () => {
    const state = get();
    const endTime = new Date();
    const durationSeconds = state.startTime
      ? Math.round((endTime.getTime() - state.startTime.getTime()) / 1000)
      : 0;

    const accuracy = state.itemsAttempted > 0 ? state.itemsCorrect / state.itemsAttempted : 0;
    const perfectSession = state.itemsAttempted >= 5 && accuracy === 1;
    const finalXp = perfectSession ? state.xpEarned + 25 : state.xpEarned;

    set({ isActive: false, xpEarned: finalXp });

    return {
      itemsAttempted: state.itemsAttempted,
      itemsCorrect: state.itemsCorrect,
      accuracy,
      xpEarned: finalXp,
      durationSeconds,
      perfectSession,
    };
  },

  resetSession: () => {
    set(initialState);
  },
}));
