import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEffectsEnabled: boolean;
  darkModeEnabled: boolean;
  dailyGoalMinutes: 5 | 10 | 15 | 20;

  // Actions
  setSoundEffects: (enabled: boolean) => void;
  toggleSoundEffects: () => void;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  setDailyGoal: (minutes: 5 | 10 | 15 | 20) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEffectsEnabled: true,
      darkModeEnabled: false,
      dailyGoalMinutes: 10,

      setSoundEffects: (enabled) => set({ soundEffectsEnabled: enabled }),

      toggleSoundEffects: () => {
        set({ soundEffectsEnabled: !get().soundEffectsEnabled });
      },

      setDarkMode: (enabled) => {
        set({ darkModeEnabled: enabled });
        // Apply dark mode to document
        if (typeof document !== 'undefined') {
          if (enabled) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleDarkMode: () => {
        const newValue = !get().darkModeEnabled;
        get().setDarkMode(newValue);
      },

      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
    }),
    {
      name: 'consultprep-settings',
      onRehydrateStorage: () => (state) => {
        // Apply dark mode on rehydration
        if (state?.darkModeEnabled && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
