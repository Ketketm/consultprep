'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/lib/store/onboarding-store';
import { OnboardingProgress } from './OnboardingProgress';
import { WelcomeStep } from './steps/WelcomeStep';
import { TargetCompanyStep } from './steps/TargetCompanyStep';
import { ExperienceLevelStep } from './steps/ExperienceLevelStep';
import { HowItWorksStep } from './steps/HowItWorksStep';
import { PillarsDeepDiveStep } from './steps/PillarsDeepDiveStep';
import { DailyCommitmentStep } from './steps/DailyCommitmentStep';
import { DiagnosticIntroStep } from './steps/DiagnosticIntroStep';
import { ReadyToStartStep } from './steps/ReadyToStartStep';

const TOTAL_STEPS = 8;

interface StepConfig {
  canGoBack: boolean;
  canSkip: boolean;
  nextLabel: string;
  skipLabel?: string;
}

const STEP_CONFIG: Record<number, StepConfig> = {
  1: { canGoBack: false, canSkip: false, nextLabel: 'Commencer' },
  2: { canGoBack: true, canSkip: false, nextLabel: 'Continuer' },
  3: { canGoBack: true, canSkip: false, nextLabel: 'Continuer' },
  4: { canGoBack: true, canSkip: false, nextLabel: 'Continuer' },
  5: { canGoBack: true, canSkip: false, nextLabel: 'Continuer' },
  6: { canGoBack: true, canSkip: false, nextLabel: 'Continuer' },
  7: { canGoBack: true, canSkip: true, nextLabel: 'Commencer le diagnostic', skipLabel: 'Passer' },
  8: { canGoBack: false, canSkip: false, nextLabel: 'Aller au Dashboard' },
};

function renderStep(step: number) {
  switch (step) {
    case 1:
      return <WelcomeStep />;
    case 2:
      return <TargetCompanyStep />;
    case 3:
      return <ExperienceLevelStep />;
    case 4:
      return <HowItWorksStep />;
    case 5:
      return <PillarsDeepDiveStep />;
    case 6:
      return <DailyCommitmentStep />;
    case 7:
      return <DiagnosticIntroStep />;
    case 8:
      return <ReadyToStartStep />;
    default:
      return null;
  }
}

export function OnboardingWizard() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    previousStep,
    canProceed,
    completeOnboarding,
    setSkipDiagnostic,
  } = useOnboardingStore();

  const config = STEP_CONFIG[currentStep];

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      completeOnboarding();
      router.push('/');
    } else if (currentStep === 7) {
      // Go to diagnostic or skip
      setSkipDiagnostic(false);
      nextStep();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (currentStep === 7) {
      setSkipDiagnostic(true);
      nextStep();
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with close button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Progress indicator */}
          <div className="flex-1">
            {currentStep < TOTAL_STEPS && (
              <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            )}
          </div>
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            title="Retour au dashboard"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep(currentStep)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back button */}
          <div className="w-24">
            {config.canGoBack && (
              <Button
                variant="ghost"
                onClick={previousStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            )}
          </div>

          {/* Center: Skip button (for step 7) */}
          <div className="flex-1 flex justify-center">
            {config.canSkip && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500 gap-2"
              >
                <SkipForward className="w-4 h-4" />
                {config.skipLabel}
              </Button>
            )}
          </div>

          {/* Next button */}
          <div className="w-auto">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 px-6"
              size="lg"
            >
              {config.nextLabel}
              {currentStep < TOTAL_STEPS && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
