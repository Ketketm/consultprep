'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronDown, ChevronUp, Tag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseStep, CaseMode, StructureData } from '@/lib/types/case-types';
import { isStructureData } from '@/lib/types/case-types';

interface StructureStepProps {
  step: CaseStep;
  mode: CaseMode;
}

export function StructureStep({ step, mode }: StructureStepProps) {
  const { correctionRevealed, revealCorrection, setCurrentAnswer, currentAnswer } =
    useCaseStore();

  const [userResponse, setUserResponse] = useState('');
  const [userKeywords, setUserKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [contextExpanded, setContextExpanded] = useState(false);

  if (!isStructureData(step.interaction_data)) {
    return <div>Données invalides pour ce type de step</div>;
  }

  const data = step.interaction_data as StructureData;

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !userKeywords.includes(keywordInput.trim().toLowerCase())) {
      setUserKeywords([...userKeywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setUserKeywords(userKeywords.filter((k) => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleReveal = () => {
    setCurrentAnswer({ text: userResponse, keywords: userKeywords });
    revealCorrection();
  };

  // Support both keywords and expected_keywords
  const allKeywords = data.keywords || data.expected_keywords || [];

  // Check which keywords match
  const matchedKeywords = allKeywords.filter((kw) =>
    userKeywords.some(
      (uk) => uk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(uk.toLowerCase())
    )
  );

  const missedKeywords = allKeywords.filter((kw) => !matchedKeywords.includes(kw));

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-sm">
              Structure
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
            <CardTitle className="text-base">Votre structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Structurez votre réponse ici..."
              className="w-full p-4 border rounded-lg resize-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={6}
            />

            {/* Keywords input */}
            {allKeywords.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Mots-clés de votre réponse
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ajouter un mot-clé..."
                    className="flex-1 p-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button onClick={handleAddKeyword} variant="outline">
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reveal button */}
      {!correctionRevealed && (
        <Button onClick={handleReveal} size="lg" className="w-full gap-2">
          <Eye className="w-5 h-5" />
          Révéler le gold standard
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
                  {(currentAnswer as { text: string; keywords: string[] }).text}
                </p>
                {userKeywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {userKeywords.map((kw) => (
                      <span
                        key={kw}
                        className={cn(
                          'px-2 py-1 rounded text-sm',
                          matchedKeywords.some(
                            (mk) =>
                              mk.toLowerCase().includes(kw.toLowerCase()) ||
                              kw.toLowerCase().includes(mk.toLowerCase())
                          )
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gold standard */}
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="text-base text-primary-700">Gold Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-800 whitespace-pre-wrap">
                {data.gold_standard_text}
              </p>

              {data.gold_standard_image_desc && (
                <p className="mt-3 text-sm text-primary-600 italic">
                  📊 {data.gold_standard_image_desc}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Keywords comparison */}
          {allKeywords.length > 0 && mode === 'on_screen' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analyse des mots-clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">
                      <Check className="w-4 h-4 inline mr-1" />
                      Trouvés ({matchedKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                        >
                          {kw}
                        </span>
                      ))}
                      {matchedKeywords.length === 0 && (
                        <span className="text-sm text-gray-400">Aucun</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-2">
                      Manqués ({missedKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {missedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm"
                        >
                          {kw}
                        </span>
                      ))}
                      {missedKeywords.length === 0 && (
                        <span className="text-sm text-gray-400">Aucun</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
