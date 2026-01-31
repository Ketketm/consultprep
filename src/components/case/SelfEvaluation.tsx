'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCaseStore } from '@/lib/store/case-store';
import type { SelfRating } from '@/lib/types/case-types';
import { getSelfRatingLabel, getSelfRatingColor } from '@/lib/types/case-types';

const RATINGS: SelfRating[] = ['bad', 'moyen', 'bien', 'tres_bien'];

export function SelfEvaluation() {
  const { submitSelfRating, createFlashcardForCurrentStep } = useCaseStore();

  const [selectedRating, setSelectedRating] = useState<SelfRating | null>(null);
  const [showMemoInput, setShowMemoInput] = useState(false);
  const [memo, setMemo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (rating: SelfRating) => {
    setSelectedRating(rating);

    // If bad or moyen, show memo input for flashcard
    if (rating === 'bad' || rating === 'moyen') {
      setShowMemoInput(true);
    } else {
      // Submit directly for bien/tres_bien
      submitSelfRating(rating);
      setSubmitted(true);
    }
  };

  const handleSubmitWithMemo = () => {
    if (selectedRating) {
      submitSelfRating(selectedRating, memo);
      createFlashcardForCurrentStep(memo);
      setSubmitted(true);
    }
  };

  const handleSkipFlashcard = () => {
    if (selectedRating) {
      submitSelfRating(selectedRating);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-medium text-green-700">Évaluation enregistrée</p>
              {(selectedRating === 'bad' || selectedRating === 'moyen') && memo && (
                <p className="text-sm text-green-600 mt-1">
                  Flashcard créée pour la révision
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Auto-évaluation</CardTitle>
      </CardHeader>
      <CardContent>
        {!showMemoInput ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              À quel point connaissiez-vous cette réponse ?
            </p>

            <div className="grid grid-cols-4 gap-2">
              {RATINGS.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingClick(rating)}
                  className={cn(
                    'p-3 rounded-lg text-white font-medium transition-transform hover:scale-105',
                    getSelfRatingColor(rating),
                    selectedRating === rating && 'ring-2 ring-offset-2 ring-gray-900'
                  )}
                >
                  {getSelfRatingLabel(rating)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <p className="font-medium text-gray-900">
                Créer une flashcard pour réviser ?
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Ajoutez une note pour vous souvenir de ce qui a posé problème :
            </p>

            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Ex: J'ai oublié de considérer le facteur X..."
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleSkipFlashcard}
                className="flex-1"
              >
                Passer
              </Button>
              <Button
                onClick={handleSubmitWithMemo}
                className="flex-1 gap-2"
                disabled={!memo.trim()}
              >
                <Save className="w-4 h-4" />
                Créer la flashcard
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
