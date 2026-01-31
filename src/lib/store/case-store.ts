import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CaseJson,
  CaseMode,
  CaseFlashcard,
  UserAttempt,
  SelfRating,
  CaseStep,
  createFlashcardFromStep,
} from '@/lib/types/case-types';
import { createFlashcardFromStep as createFlashcard } from '@/lib/types/case-types';
import { validateCaseJson } from '@/lib/schemas/case-schema';

interface CaseState {
  // Current case
  currentCase: CaseJson | null;
  currentStepIndex: number;
  mode: CaseMode;
  currentDemoCaseId: string | null; // Tracks the canonical demo case ID for language switching

  // Step state
  currentAnswer: unknown;
  correctionRevealed: boolean;

  // Attempts
  attempts: UserAttempt[];

  // Flashcards
  caseFlashcards: CaseFlashcard[];

  // Imported cases
  importedCases: CaseJson[];

  // Actions - Case Management
  loadCase: (caseJson: CaseJson, demoCaseId?: string) => void;
  setCurrentDemoCaseId: (id: string | null) => void;
  setMode: (mode: CaseMode) => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCase: () => void;

  // Actions - Answer Recording
  setCurrentAnswer: (answer: unknown) => void;
  revealCorrection: () => void;
  submitSelfRating: (rating: SelfRating, memo?: string) => void;

  // Actions - Flashcard Management
  createFlashcardForCurrentStep: (memo: string) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcardsForCase: (caseId: string) => CaseFlashcard[];

  // Actions - Import
  importCase: (json: unknown) => { success: boolean; error?: string; caseId?: string };
  deleteImportedCase: (caseId: string) => void;
  getCaseById: (caseId: string) => CaseJson | undefined;

  // Getters
  getCurrentStep: () => CaseStep | null;
  getAttemptForStep: (stepId: number) => UserAttempt | undefined;
  getProgress: () => { current: number; total: number; percentage: number };
}

const initialState = {
  currentCase: null as CaseJson | null,
  currentStepIndex: 0,
  mode: 'on_screen' as CaseMode,
  currentDemoCaseId: null as string | null,
  currentAnswer: null as unknown,
  correctionRevealed: false,
  attempts: [] as UserAttempt[],
  caseFlashcards: [] as CaseFlashcard[],
  importedCases: [] as CaseJson[],
};

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Load a case and start from first step
      loadCase: (caseJson, demoCaseId) => {
        set({
          currentCase: caseJson,
          currentStepIndex: 0,
          currentAnswer: null,
          correctionRevealed: false,
          currentDemoCaseId: demoCaseId || null,
        });
      },

      // Set the demo case ID
      setCurrentDemoCaseId: (id) => set({ currentDemoCaseId: id }),

      // Set the working mode
      setMode: (mode) => set({ mode }),

      // Navigate to a specific step
      goToStep: (index) => {
        const { currentCase } = get();
        if (currentCase && index >= 0 && index < currentCase.steps.length) {
          set({
            currentStepIndex: index,
            currentAnswer: null,
            correctionRevealed: false,
          });
        }
      },

      // Go to next step
      nextStep: () => {
        const { currentCase, currentStepIndex } = get();
        if (currentCase && currentStepIndex < currentCase.steps.length - 1) {
          set({
            currentStepIndex: currentStepIndex + 1,
            currentAnswer: null,
            correctionRevealed: false,
          });
        }
      },

      // Go to previous step
      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({
            currentStepIndex: currentStepIndex - 1,
            currentAnswer: null,
            correctionRevealed: false,
          });
        }
      },

      // Reset current case
      resetCase: () => {
        set({
          currentCase: null,
          currentStepIndex: 0,
          currentAnswer: null,
          correctionRevealed: false,
        });
      },

      // Set user answer for current step
      setCurrentAnswer: (answer) => set({ currentAnswer: answer }),

      // Reveal correction for current step
      revealCorrection: () => set({ correctionRevealed: true }),

      // Submit self rating and optionally create flashcard
      submitSelfRating: (rating, memo) => {
        const { currentCase, currentStepIndex, mode, currentAnswer, attempts } = get();
        if (!currentCase) return;

        const step = currentCase.steps[currentStepIndex];
        const attempt: UserAttempt = {
          id: `attempt_${currentCase.meta.case_id}_${step.step_id}_${Date.now()}`,
          case_id: currentCase.meta.case_id,
          step_id: step.step_id,
          timestamp: new Date(),
          mode,
          user_answer: currentAnswer,
          revealed_correction: true,
          self_rating: rating,
          memo,
        };

        // Add attempt to history
        set({
          attempts: [...attempts, attempt],
        });

        // If bad or moyen, prompt for flashcard creation
        // (This is handled in the UI component)
      },

      // Create flashcard for current step
      createFlashcardForCurrentStep: (memo) => {
        const { currentCase, currentStepIndex, mode, currentAnswer, caseFlashcards, attempts } = get();
        if (!currentCase) return;

        const step = currentCase.steps[currentStepIndex];

        // Get or create attempt
        let attempt = attempts.find(
          (a) => a.case_id === currentCase.meta.case_id && a.step_id === step.step_id
        );

        if (!attempt) {
          attempt = {
            id: `attempt_${currentCase.meta.case_id}_${step.step_id}_${Date.now()}`,
            case_id: currentCase.meta.case_id,
            step_id: step.step_id,
            timestamp: new Date(),
            mode,
            user_answer: currentAnswer,
            revealed_correction: true,
            self_rating: null,
            memo,
          };
        } else {
          attempt = { ...attempt, memo };
        }

        const flashcard = createFlashcard(currentCase, step, attempt);

        set({
          caseFlashcards: [...caseFlashcards, flashcard],
        });
      },

      // Delete a flashcard
      deleteFlashcard: (id) => {
        const { caseFlashcards } = get();
        set({
          caseFlashcards: caseFlashcards.filter((f) => f.id !== id),
        });
      },

      // Get flashcards for a specific case
      getFlashcardsForCase: (caseId) => {
        const { caseFlashcards } = get();
        return caseFlashcards.filter((f) => f.case_id === caseId);
      },

      // Import a case from JSON
      importCase: (json) => {
        const validation = validateCaseJson(json);

        if (!validation.success || !validation.data) {
          return {
            success: false,
            error: validation.error || 'Validation failed',
          };
        }

        const { importedCases } = get();
        const caseData = validation.data as CaseJson;

        // Check if case already exists
        if (importedCases.some((c) => c.meta.case_id === caseData.meta.case_id)) {
          return {
            success: false,
            error: `Un cas avec l'ID "${caseData.meta.case_id}" existe déjà`,
          };
        }

        set({
          importedCases: [...importedCases, caseData],
        });

        return {
          success: true,
          caseId: caseData.meta.case_id,
        };
      },

      // Delete an imported case
      deleteImportedCase: (caseId) => {
        const { importedCases, currentCase, caseFlashcards, attempts } = get();

        set({
          importedCases: importedCases.filter((c) => c.meta.case_id !== caseId),
          currentCase: currentCase?.meta.case_id === caseId ? null : currentCase,
          caseFlashcards: caseFlashcards.filter((f) => f.case_id !== caseId),
          attempts: attempts.filter((a) => a.case_id !== caseId),
        });
      },

      // Get a case by ID
      getCaseById: (caseId) => {
        const { importedCases } = get();
        return importedCases.find((c) => c.meta.case_id === caseId);
      },

      // Get current step
      getCurrentStep: () => {
        const { currentCase, currentStepIndex } = get();
        if (!currentCase || currentStepIndex >= currentCase.steps.length) return null;
        return currentCase.steps[currentStepIndex];
      },

      // Get attempt for a specific step
      getAttemptForStep: (stepId) => {
        const { attempts, currentCase } = get();
        if (!currentCase) return undefined;
        return attempts.find(
          (a) => a.case_id === currentCase.meta.case_id && a.step_id === stepId
        );
      },

      // Get progress
      getProgress: () => {
        const { currentCase, currentStepIndex } = get();
        if (!currentCase) return { current: 0, total: 0, percentage: 0 };

        const total = currentCase.steps.length;
        const current = currentStepIndex + 1;
        const percentage = Math.round((current / total) * 100);

        return { current, total, percentage };
      },
    }),
    {
      name: 'consultprep-cases',
      partialize: (state) => ({
        mode: state.mode,
        attempts: state.attempts,
        caseFlashcards: state.caseFlashcards,
        importedCases: state.importedCases,
      }),
    }
  )
);
