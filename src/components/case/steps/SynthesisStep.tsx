'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseStep, CaseMode, SynthesisData } from '@/lib/types/case-types';
import { isSynthesisData } from '@/lib/types/case-types';

interface SynthesisStepProps {
  step: CaseStep;
  mode: CaseMode;
}

export function SynthesisStep({ step, mode }: SynthesisStepProps) {
  const { correctionRevealed, revealCorrection, setCurrentAnswer, currentAnswer } =
    useCaseStore();

  const [userResponse, setUserResponse] = useState('');
  const [contextExpanded, setContextExpanded] = useState(false);

  if (!isSynthesisData(step.interaction_data)) {
    return <div>Données invalides pour ce type de step</div>;
  }

  const data = step.interaction_data as SynthesisData;

  const handleReveal = () => {
    setCurrentAnswer(userResponse);
    revealCorrection();
  };

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 text-sm">
              Synthèse
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
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Votre synthèse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Rédigez votre synthèse / recommandation ici..."
              className="w-full p-4 border rounded-lg resize-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={8}
            />
            <p className="text-sm text-gray-400 mt-2">
              Conseil: Structurez votre réponse avec une recommandation claire, les
              arguments clés, et les prochaines étapes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reveal button */}
      {!correctionRevealed && (
        <Button onClick={handleReveal} size="lg" className="w-full gap-2">
          <Eye className="w-5 h-5" />
          Révéler le modèle
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
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentAnswer as string}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Model answer */}
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="text-base text-primary-700">
                Réponse modèle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-800 whitespace-pre-wrap">
                {data.model_answer_text}
              </p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <p className="font-medium text-yellow-800 mb-1">
                    Points clés à retenir
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Structure claire: Recommandation → Arguments → Next steps</li>
                    <li>• Quantifiez vos recommandations quand possible</li>
                    <li>• Anticipez les questions de suivi</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
