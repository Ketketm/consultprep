'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCaseStore } from '@/lib/store/case-store';
import { CaseHeader } from './CaseHeader';
import { StepSidebar } from './StepSidebar';
import { SelfEvaluation } from './SelfEvaluation';
import { ClarificationStep } from './steps/ClarificationStep';
import { StructureStep } from './steps/StructureStep';
import { CalculationStep } from './steps/CalculationStep';
import { BrainstormingStep } from './steps/BrainstormingStep';
import { SynthesisStep } from './steps/SynthesisStep';

export function CasePlayer() {
  const router = useRouter();
  const {
    currentCase,
    currentStepIndex,
    mode,
    correctionRevealed,
    nextStep,
    previousStep,
    goToStep,
    getProgress,
    getCurrentStep,
    resetCase,
  } = useCaseStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentStep = getCurrentStep();
  const progress = getProgress();

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show evaluation when correction is revealed
  useEffect(() => {
    if (correctionRevealed) {
      setShowEvaluation(true);
    } else {
      setShowEvaluation(false);
    }
  }, [correctionRevealed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    resetCase();
    router.push('/');
  };

  const handleNextStep = () => {
    setShowEvaluation(false);
    nextStep();
  };

  const handlePreviousStep = () => {
    setShowEvaluation(false);
    previousStep();
  };

  const handleStepClick = (index: number) => {
    setShowEvaluation(false);
    goToStep(index);
  };

  const renderStep = () => {
    if (!currentStep) return null;

    const stepProps = {
      step: currentStep,
      mode,
    };

    switch (currentStep.type) {
      case 'clarification':
        return <ClarificationStep {...stepProps} />;
      case 'structure':
        return <StructureStep {...stepProps} />;
      case 'calculation':
        return <CalculationStep {...stepProps} />;
      case 'brainstorming':
        return <BrainstormingStep {...stepProps} />;
      case 'synthesis':
        return <SynthesisStep {...stepProps} />;
      default:
        return <div>Type de step non supporté</div>;
    }
  };

  if (!currentCase || !currentStep) {
    return null;
  }

  const isLastStep = currentStepIndex === currentCase.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <CaseHeader
        title={currentCase.meta.title}
        elapsedTime={formatTime(elapsedTime)}
        onClose={handleClose}
      />

      {/* Progress bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Étape {progress.current} / {progress.total}
            </span>
            <Progress value={progress.percentage} className="flex-1 h-2" />
            <span className="text-sm font-medium text-gray-700">
              {progress.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <StepSidebar
          steps={currentCase.steps}
          currentIndex={currentStepIndex}
          onStepClick={handleStepClick}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step content */}
                {renderStep()}

                {/* Self evaluation */}
                {showEvaluation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <SelfEvaluation />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>

              {correctionRevealed && (
                <Button
                  onClick={handleNextStep}
                  disabled={isLastStep}
                  className="gap-2"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
