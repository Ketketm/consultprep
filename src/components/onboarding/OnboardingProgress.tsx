'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div>
      {/* Mobile: Progress bar only */}
      <div className="sm:hidden">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Etape {currentStep} sur {totalSteps}
        </p>
      </div>

      {/* Desktop: Step dots */}
      <div className="hidden sm:flex items-center justify-center gap-3">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={i} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted
                    ? '#7c3aed'
                    : isActive
                    ? '#8b5cf6'
                    : '#e5e7eb',
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  isActive && 'ring-4 ring-primary-200'
                )}
              />
              {i < totalSteps - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 ml-3',
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
