'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, ChevronDown, ChevronUp, Calculator, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseStep, CaseMode, CalculationData } from '@/lib/types/case-types';
import { isCalculationData } from '@/lib/types/case-types';

interface CalculationStepProps {
  step: CaseStep;
  mode: CaseMode;
}

export function CalculationStep({ step, mode }: CalculationStepProps) {
  const { correctionRevealed, revealCorrection, setCurrentAnswer, currentAnswer } =
    useCaseStore();

  const [userValue, setUserValue] = useState('');
  const [verified, setVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isCalculationData(step.interaction_data)) {
    return <div>Données invalides pour ce type de step</div>;
  }

  const data = step.interaction_data as CalculationData;

  // Support both expected_value and correct_value
  const expectedValue = data.expected_value ?? data.correct_value ?? 0;

  const handleVerify = () => {
    const numValue = parseFloat(userValue);
    if (isNaN(numValue)) {
      setIsCorrect(false);
      setVerified(true);
      return;
    }

    const tolerance = expectedValue * (data.tolerance_percent / 100);
    const correct = numValue >= expectedValue - tolerance && numValue <= expectedValue + tolerance;

    setIsCorrect(correct);
    setVerified(true);
    setCurrentAnswer({ value: numValue, unit: data.unit });

    // If incorrect, auto-reveal correction
    if (!correct) {
      revealCorrection();
    }
  };

  const handleReveal = () => {
    setCurrentAnswer({ value: parseFloat(userValue) || null, unit: data.unit });
    revealCorrection();
  };

  // Check if we have step-by-step data
  const hasSteps = data.steps && data.steps.length > 0;
  const hasStepByStepCorrection = !!data.step_by_step_correction;

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">Calcul</span>
            Étape {step.step_id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900 text-lg">{step.instruction}</p>
        </CardContent>
      </Card>

      {/* Context (collapsible) */}
      {step.context && (
        <Card>
          <button
            onClick={() => setContextExpanded(!contextExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <span className="font-medium text-gray-700">Contexte / Rappel</span>
            {contextExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {contextExpanded && (
            <CardContent className="pt-0">
              <p className="text-gray-600 whitespace-pre-wrap">{step.context}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Hint button (if available) */}
      {data.hint && !correctionRevealed && (
        <Card className="bg-yellow-50 border-yellow-200">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-100"
          >
            <span className="flex items-center gap-2 font-medium text-yellow-700">
              <Lightbulb className="w-5 h-5" />
              Indice
            </span>
            {showHint ? (
              <ChevronUp className="w-5 h-5 text-yellow-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-yellow-500" />
            )}
          </button>
          {showHint && (
            <CardContent className="pt-0">
              <p className="text-yellow-800">{data.hint}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Response area (ON SCREEN mode) */}
      {mode === 'on_screen' && !correctionRevealed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Votre réponse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={userValue}
                onChange={(e) => {
                  setUserValue(e.target.value);
                  setVerified(false);
                }}
                placeholder="Entrez votre valeur"
                className="flex-1 p-4 border rounded-lg text-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-lg font-medium text-gray-600">{data.unit}</span>
            </div>

            {verified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'p-4 rounded-lg flex items-center gap-3',
                  isCorrect ? 'bg-green-50' : 'bg-red-50'
                )}
              >
                {isCorrect ? (
                  <>
                    <Check className="w-6 h-6 text-green-500" />
                    <span className="text-green-700 font-medium">Correct !</span>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-500" />
                    <span className="text-red-700 font-medium">
                      Incorrect. La réponse attendue est {expectedValue} {data.unit}
                    </span>
                  </>
                )}
              </motion.div>
            )}

            {!verified && (
              <Button onClick={handleVerify} className="w-full" size="lg">
                Vérifier
              </Button>
            )}

            {verified && isCorrect && !correctionRevealed && (
              <Button onClick={handleReveal} variant="outline" className="w-full">
                Voir le détail du calcul
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reveal button (ON PAPER mode) */}
      {mode === 'on_paper' && !correctionRevealed && (
        <Button onClick={handleReveal} size="lg" className="w-full gap-2">
          <Eye className="w-5 h-5" />
          Révéler le calcul
        </Button>
      )}

      {/* Correction - Step by step */}
      {correctionRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Result */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-base text-green-700">Résultat attendu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-800">
                {expectedValue.toLocaleString()} {data.unit}
              </p>
              <p className="text-sm text-green-600 mt-1">Tolérance: ±{data.tolerance_percent}%</p>
            </CardContent>
          </Card>

          {/* Steps (array format) */}
          {hasSteps && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calcul pas à pas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.steps!.map((calcStep, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{calcStep.description}</p>
                        {calcStep.formula && (
                          <p className="font-mono text-sm text-gray-600 mt-1">{calcStep.formula}</p>
                        )}
                        <p className="text-primary-600 font-semibold mt-2">→ {calcStep.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step by step correction (text format) */}
          {hasStepByStepCorrection && !hasSteps && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calcul pas à pas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                    {data.step_by_step_correction}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
