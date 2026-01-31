'use client';

import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CaseStep, StepType } from '@/lib/types/case-types';
import { useCaseStore } from '@/lib/store/case-store';

interface StepSidebarProps {
  steps: CaseStep[];
  currentIndex: number;
  onStepClick: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const stepTypeLabels: Record<StepType, string> = {
  clarification: 'Clarification',
  structure: 'Structure',
  calculation: 'Calcul',
  brainstorming: 'Brainstorming',
  synthesis: 'Synthèse',
};

const stepTypeColors: Record<StepType, string> = {
  clarification: 'bg-blue-100 text-blue-700',
  structure: 'bg-purple-100 text-purple-700',
  calculation: 'bg-green-100 text-green-700',
  brainstorming: 'bg-orange-100 text-orange-700',
  synthesis: 'bg-pink-100 text-pink-700',
};

export function StepSidebar({
  steps,
  currentIndex,
  onStepClick,
  isOpen,
  onToggle,
}: StepSidebarProps) {
  const { getAttemptForStep } = useCaseStore();

  return (
    <>
      {/* Toggle button (always visible) */}
      <button
        onClick={onToggle}
        className={cn(
          'fixed left-0 top-1/2 -translate-y-1/2 z-30',
          'bg-white border border-l-0 rounded-r-lg p-2 shadow-md',
          'hover:bg-gray-50 transition-colors',
          isOpen && 'hidden sm:block'
        )}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300',
          'flex-shrink-0 overflow-hidden',
          isOpen ? 'w-64' : 'w-0'
        )}
      >
        <div className="w-64 h-full overflow-y-auto p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Étapes</h2>

          <div className="space-y-2">
            {steps.map((step, index) => {
              const attempt = getAttemptForStep(step.step_id);
              const isCompleted = attempt?.self_rating !== undefined;
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={step.step_id}
                  onClick={() => onStepClick(index)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    'flex items-start gap-3',
                    isCurrent
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'hover:bg-gray-50 border border-transparent',
                    isCompleted && !isCurrent && 'bg-green-50'
                  )}
                >
                  {/* Step indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isCurrent ? 'text-primary-700' : 'text-gray-700'
                      )}
                    >
                      Étape {index + 1}
                    </p>
                    <span
                      className={cn(
                        'inline-block px-2 py-0.5 rounded text-xs mt-1',
                        stepTypeColors[step.type]
                      )}
                    >
                      {stepTypeLabels[step.type]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
