import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TargetCompany = 'mckinsey' | 'bcg' | 'bain' | 'other';
export type ExperienceLevel = 'student' | 'young_professional' | 'experienced' | 'career_changer';
export type DailyGoal = 5 | 10 | 15 | 20;

interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  targetCompany: TargetCompany | null;
  experienceLevel: ExperienceLevel | null;
  dailyGoalMinutes: DailyGoal | null;
  skipDiagnostic: boolean;
  isComplete: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  onboardingXpEarned: number;

  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTargetCompany: (company: TargetCompany) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setDailyGoal: (minutes: DailyGoal) => void;
  setSkipDiagnostic: (skip: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  canProceed: () => boolean;
  getProgress: () => number;
}

const TOTAL_STEPS = 8;
const ONBOARDING_XP_REWARD = 50;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      completedSteps: [],
      targetCompany: null,
      experienceLevel: null,
      dailyGoalMinutes: null,
      skipDiagnostic: false,
      isComplete: false,
      startedAt: null,
      completedAt: null,
      onboardingXpEarned: 0,

      setStep: (step) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
          set({
            currentStep: step,
            startedAt: get().startedAt || new Date(),
          });
        }
      },

      nextStep: () => {
        const { currentStep, completedSteps } = get();
        if (currentStep < TOTAL_STEPS) {
          set({
            currentStep: currentStep + 1,
            completedSteps: completedSteps.includes(currentStep)
              ? completedSteps
              : [...completedSteps, currentStep],
          });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      setTargetCompany: (company) => set({ targetCompany: company }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      setSkipDiagnostic: (skip) => set({ skipDiagnostic: skip }),

      completeOnboarding: () => {
        set({
          isComplete: true,
          completedAt: new Date(),
          onboardingXpEarned: ONBOARDING_XP_REWARD,
          completedSteps: [...get().completedSteps, TOTAL_STEPS],
        });
      },

      resetOnboarding: () => {
        set({
          currentStep: 1,
          completedSteps: [],
          targetCompany: null,
          experienceLevel: null,
          dailyGoalMinutes: null,
          skipDiagnostic: false,
          isComplete: false,
          startedAt: null,
          completedAt: null,
          onboardingXpEarned: 0,
        });
      },

      canProceed: () => {
        const { currentStep, targetCompany, experienceLevel, dailyGoalMinutes } = get();
        switch (currentStep) {
          case 1:
            return true;
          case 2:
            return targetCompany !== null;
          case 3:
            return experienceLevel !== null;
          case 4:
            return true;
          case 5:
            return true;
          case 6:
            return dailyGoalMinutes !== null;
          case 7:
            return true;
          case 8:
            return true;
          default:
            return false;
        }
      },

      getProgress: () => {
        const { currentStep } = get();
        return Math.round((currentStep / TOTAL_STEPS) * 100);
      },
    }),
    {
      name: 'consultprep-onboarding',
      partialize: (state) => ({
        targetCompany: state.targetCompany,
        experienceLevel: state.experienceLevel,
        dailyGoalMinutes: state.dailyGoalMinutes,
        isComplete: state.isComplete,
        completedAt: state.completedAt,
      }),
    }
  )
);
