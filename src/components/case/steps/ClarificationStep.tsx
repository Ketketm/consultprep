'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseStep, CaseMode, ClarificationData } from '@/lib/types/case-types';
import { isClarificationData } from '@/lib/types/case-types';

interface ClarificationStepProps {
  step: CaseStep;
  mode: CaseMode;
}

export function ClarificationStep({ step, mode }: ClarificationStepProps) {
  const { correctionRevealed, revealCorrection, setCurrentAnswer, currentAnswer } =
    useCaseStore();

  const [userResponse, setUserResponse] = useState('');
  const [introExpanded, setIntroExpanded] = useState(true);
  const [contextExpanded, setContextExpanded] = useState(false);

  if (!isClarificationData(step.interaction_data)) {
    return <div>Données invalides pour ce type de step</div>;
  }

  const data = step.interaction_data as ClarificationData;

  const handleReveal = () => {
    setCurrentAnswer(userResponse);
    revealCorrection();
  };

  return (
    <div className="space-y-6">
      {/* Intro Context / Case Statement (Énoncé) */}
      {step.intro_context && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <button
            onClick={() => setIntroExpanded(!introExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Énoncé du cas</span>
            </div>
            {introExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-400" />
            )}
          </button>
          {introExpanded && (
            <CardContent className="pt-0">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{step.intro_context}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Instruction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
              Clarification
            </span>
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
            <span className="font-medium text-gray-700">Contexte</span>
            {contextExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {contextExpanded && (
            <CardContent className="pt-0">
              <p className="text-gray-600">{step.context}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Response area (ON SCREEN mode) */}
      {mode === 'on_screen' && !correctionRevealed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Votre réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              className="w-full p-4 border rounded-lg resize-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
          </CardContent>
        </Card>
      )}

      {/* Reveal button */}
      {!correctionRevealed && (
        <Button onClick={handleReveal} size="lg" className="w-full gap-2">
          <Eye className="w-5 h-5" />
          Révéler la correction
        </Button>
      )}

      {/* Correction */}
      {correctionRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* User response display (if ON SCREEN) */}
          {mode === 'on_screen' && currentAnswer !== null && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base text-gray-600">Votre réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{currentAnswer as string}</p>
              </CardContent>
            </Card>
          )}

          {/* Options with feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Options et correction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.options.map((option, index) => (
                <div
                  key={option.id || `option-${index}`}
                  className={cn(
                    'p-4 rounded-lg border-2',
                    option.is_correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-100'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {option.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={cn(
                          'font-medium',
                          option.is_correct ? 'text-green-700' : 'text-gray-700'
                        )}
                      >
                        {option.text}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{option.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Explanation */}
          {data.correct_explanation && (
            <Card className="bg-primary-50 border-primary-200">
              <CardHeader>
                <CardTitle className="text-base text-primary-700">Explication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-800">{data.correct_explanation}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
