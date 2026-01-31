'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Plus, X, Check, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/lib/store/case-store';
import type { CaseStep, CaseMode, BrainstormingData } from '@/lib/types/case-types';
import { isBrainstormingData } from '@/lib/types/case-types';

interface BrainstormingStepProps {
  step: CaseStep;
  mode: CaseMode;
}

export function BrainstormingStep({ step, mode }: BrainstormingStepProps) {
  const { correctionRevealed, revealCorrection, setCurrentAnswer, currentAnswer } =
    useCaseStore();

  const [userItems, setUserItems] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState('');
  const [freeText, setFreeText] = useState('');
  const [contextExpanded, setContextExpanded] = useState(false);

  if (!isBrainstormingData(step.interaction_data)) {
    return <div>Données invalides pour ce type de step</div>;
  }

  const data = step.interaction_data as BrainstormingData;

  const handleAddItem = () => {
    if (itemInput.trim() && !userItems.includes(itemInput.trim())) {
      setUserItems([...userItems, itemInput.trim()]);
      setItemInput('');
    }
  };

  const handleRemoveItem = (item: string) => {
    setUserItems(userItems.filter((i) => i !== item));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleReveal = () => {
    setCurrentAnswer({ items: userItems, freeText });
    revealCorrection();
  };

  // Compare user items with correct items
  const matchedItems = data.checklist_correct_items.filter((correctItem) =>
    userItems.some(
      (userItem) =>
        userItem.toLowerCase().includes(correctItem.toLowerCase()) ||
        correctItem.toLowerCase().includes(userItem.toLowerCase())
    )
  );

  const missedItems = data.checklist_correct_items.filter(
    (item) => !matchedItems.includes(item)
  );

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-sm">
              Brainstorming
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
              <Lightbulb className="w-5 h-5" />
              Vos idées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Free text area */}
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Notez vos idées en vrac..."
              className="w-full p-4 border rounded-lg resize-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />

            {/* Checklist builder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liste structurée
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter un élément..."
                  className="flex-1 p-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={handleAddItem} variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>

              {/* User items list */}
              {userItems.length > 0 && (
                <div className="space-y-2">
                  {userItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-gray-700">{item}</span>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {userItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Aucun élément ajouté
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reveal button */}
      {!correctionRevealed && (
        <Button onClick={handleReveal} size="lg" className="w-full gap-2">
          <Eye className="w-5 h-5" />
          Révéler la checklist
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
                {(currentAnswer as { items: string[]; freeText: string })?.freeText && (
                  <p className="text-gray-700 mb-3">
                    {(currentAnswer as { items: string[]; freeText: string }).freeText}
                  </p>
                )}
                <div className="space-y-1">
                  {userItems.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded',
                        matchedItems.some(
                          (mi) =>
                            mi.toLowerCase().includes(item.toLowerCase()) ||
                            item.toLowerCase().includes(mi.toLowerCase())
                        )
                          ? 'bg-green-100'
                          : 'bg-white'
                      )}
                    >
                      {matchedItems.some(
                        (mi) =>
                          mi.toLowerCase().includes(item.toLowerCase()) ||
                          item.toLowerCase().includes(mi.toLowerCase())
                      ) ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4" />
                      )}
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Correct checklist */}
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="text-base text-primary-700">
                Checklist attendue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.checklist_correct_items.map((item, index) => {
                  const isMatched = matchedItems.includes(item);
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg',
                        mode === 'on_screen'
                          ? isMatched
                            ? 'bg-green-100'
                            : 'bg-orange-100'
                          : 'bg-white'
                      )}
                    >
                      {mode === 'on_screen' && (
                        isMatched ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-orange-500" />
                        )
                      )}
                      <span
                        className={cn(
                          mode === 'on_screen'
                            ? isMatched
                              ? 'text-green-700'
                              : 'text-orange-700'
                            : 'text-primary-700'
                        )}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Score summary (ON SCREEN) */}
          {mode === 'on_screen' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{matchedItems.length}</p>
                    <p className="text-sm text-gray-500">Trouvés</p>
                  </div>
                  <div className="text-4xl text-gray-300">/</div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-700">
                      {data.checklist_correct_items.length}
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Explication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{data.explanation}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
