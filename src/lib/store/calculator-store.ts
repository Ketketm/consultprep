import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface GameSession {
  id: string;
  date: string; // ISO string
  score: number; // correct answers
  duration: number; // in seconds (default 120)
  operations: OperationType[];
  questionsAttempted: number;
  accuracy: number; // percentage
}

export interface GameSettings {
  duration: number; // seconds
  operations: OperationType[];
  additionRange: [number, number];
  subtractionRange: [number, number];
  multiplicationRange: [number, number];
  divisionRange: [number, number];
}

interface CalculatorState {
  // Game history
  sessions: GameSession[];

  // Personal best
  personalBest: number;

  // Current settings
  settings: GameSettings;

  // Actions
  addSession: (session: Omit<GameSession, 'id' | 'date'>) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetStats: () => void;

  // Computed
  getRecentSessions: (count: number) => GameSession[];
  getAverageScore: () => number;
}

const defaultSettings: GameSettings = {
  duration: 120, // 2 minutes like Zetamac
  operations: ['addition', 'subtraction', 'multiplication', 'division'],
  additionRange: [2, 100],
  subtractionRange: [2, 100], // Same as addition (reverse)
  multiplicationRange: [2, 12], // First operand 2-12
  divisionRange: [2, 12], // Divisor 2-12 (reverse of multiplication)
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      sessions: [],
      personalBest: 0,
      settings: defaultSettings,

      addSession: (sessionData) => {
        const newSession: GameSession = {
          ...sessionData,
          id: `session_${Date.now()}`,
          date: new Date().toISOString(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          personalBest: Math.max(state.personalBest, sessionData.score),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetStats: () => {
        set({
          sessions: [],
          personalBest: 0,
        });
      },

      getRecentSessions: (count) => {
        const { sessions } = get();
        return sessions.slice(-count);
      },

      getAverageScore: () => {
        const { sessions } = get();
        if (sessions.length === 0) return 0;
        const total = sessions.reduce((sum, s) => sum + s.score, 0);
        return Math.round(total / sessions.length);
      },
    }),
    {
      name: 'consultprep-calculator',
    }
  )
);
