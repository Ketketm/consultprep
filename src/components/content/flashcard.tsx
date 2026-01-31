'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, BookOpen, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Flashcard as FlashcardType, ContentItem } from '@/lib/types';
import { isTypingFlashcard } from '@/lib/data/content-data';

interface FlashcardProps {
  flashcard: FlashcardType;
  contentItem?: ContentItem;
  onRate: (quality: number, responseTimeMs: number) => void;
  onSkip: () => void;
}

export function Flashcard({ flashcard, contentItem, onRate, onSkip }: FlashcardProps) {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime] = useState(Date.now());
  const [userAnswer, setUserAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if this is a typing-based flashcard
  const isTyping = contentItem ? isTypingFlashcard(contentItem) : false;

  const handleFlip = useCallback(() => {
    if (!isTyping) {
      setIsFlipped(true);
    }
  }, [isTyping]);

  const handleRate = useCallback((quality: number) => {
    const responseTimeMs = Date.now() - startTime;
    onRate(quality, responseTimeMs);
  }, [startTime, onRate]);

  const handleSubmitAnswer = useCallback(() => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === flashcard.backContent.trim().toLowerCase();
    setIsCorrect(correct);
    setAnswerSubmitted(true);
    setIsFlipped(true);
  }, [userAnswer, flashcard.backContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // For typing mode, handle Enter to submit
        if (isTyping && e.key === 'Enter' && !answerSubmitted) {
          e.preventDefault();
          handleSubmitAnswer();
        }
        return;
      }

      // Space to reveal (only for reveal mode, not typing mode)
      if (e.key === ' ' && !isFlipped && !isTyping) {
        e.preventDefault();
        handleFlip();
      }

      // Number keys 1-5 for rating (only after flipped)
      if (isFlipped && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const qualityMap: Record<string, number> = {
          '1': 0, // Forgot
          '2': 2, // Hard
          '3': 3, // Medium
          '4': 4, // Good
          '5': 5, // Perfect
        };
        handleRate(qualityMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isTyping, answerSubmitted, handleFlip, handleRate, handleSubmitAnswer]);

  // Auto-focus input for typing mode
  useEffect(() => {
    if (isTyping && inputRef.current && !isFlipped) {
      inputRef.current.focus();
    }
  }, [isTyping, isFlipped]);

  const qualityButtons = [
    { quality: 0, label: t.flashcard.forgotten, key: '1', color: 'bg-red-500 hover:bg-red-600' },
    { quality: 2, label: t.flashcard.hard, key: '2', color: 'bg-orange-500 hover:bg-orange-600' },
    { quality: 3, label: t.flashcard.medium, key: '3', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { quality: 4, label: t.flashcard.good, key: '4', color: 'bg-green-500 hover:bg-green-600' },
    { quality: 5, label: t.flashcard.perfect, key: '5', color: 'bg-emerald-500 hover:bg-emerald-600' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Maths & Tools
          </span>
          <span className="text-sm text-gray-500">Flashcard</span>
        </div>
        <BookOpen className="w-5 h-5 text-gray-400" />
      </div>

      <CardContent className="p-0">
        {!isFlipped ? (
          /* Front - Question */
          <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4 w-full">
              <h3 className="text-xl font-semibold text-gray-900">{flashcard.frontContent}</h3>
              {flashcard.frontImageUrl && (
                <img
                  src={flashcard.frontImageUrl}
                  alt="Flashcard front"
                  className="max-h-40 mx-auto rounded-lg"
                />
              )}
            </div>

            {isTyping ? (
              /* Typing mode */
              <div className="mt-8 w-full max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={t.flashcard.typeYourAnswer}
                  className="w-full p-4 text-center text-2xl font-mono border-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                />
                <Button onClick={handleSubmitAnswer} size="lg" className="w-full mt-4" disabled={!userAnswer.trim()}>
                  {t.flashcard.checkAnswer}
                </Button>
              </div>
            ) : (
              /* Reveal mode */
              <div className="mt-8 space-y-2 text-center">
                <Button onClick={handleFlip} size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t.flashcard.showAnswer}
                </Button>
                <p className="text-xs text-gray-400">{t.flashcard.pressSpace}</p>
              </div>
            )}
          </div>
        ) : (
          /* Back - Answer */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 min-h-[300px] flex flex-col"
          >
            <div className="flex-1 space-y-4">
              {/* Typing result feedback */}
              {isTyping && answerSubmitted && (
                <div className={cn(
                  'p-4 rounded-xl border-2 flex items-center gap-3',
                  isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                )}>
                  {isCorrect ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <p className={cn('font-semibold', isCorrect ? 'text-green-700' : 'text-red-700')}>
                      {isCorrect ? t.flashcard.correctAnswer : t.flashcard.incorrect}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-600">
                        {t.flashcard.yourAnswer}: <span className="font-mono">{userAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Answer */}
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                <p className="font-semibold text-primary-800 text-xl text-center">{flashcard.backContent}</p>
              </div>

              {/* Formula */}
              {flashcard.formula && (
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <p className="text-sm text-gray-500 mb-1">Formula</p>
                  <p className="font-mono text-lg">{flashcard.formula}</p>
                </div>
              )}

              {/* Explanation */}
              {flashcard.explanation && (
                <div className="text-sm text-gray-600">
                  <p className="text-gray-500 mb-1">Explanation</p>
                  <p>{flashcard.explanation}</p>
                </div>
              )}

              {/* Mnemonic */}
              {flashcard.mnemonic && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">{flashcard.mnemonic}</p>
                </div>
              )}
            </div>

            {/* Rating buttons */}
            <div className="pt-6 border-t mt-6">
              <p className="text-sm text-center text-gray-500 mb-2">{t.flashcard.rateYourAnswer}</p>
              <p className="text-xs text-center text-gray-400 mb-4">{t.flashcard.pressKeys}</p>
              <div className="grid grid-cols-5 gap-2">
                {qualityButtons.map((btn) => (
                  <button
                    key={btn.quality}
                    onClick={() => handleRate(btn.quality)}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg text-white transition-transform hover:scale-105',
                      btn.color
                    )}
                  >
                    <span className="text-xs opacity-75 mb-1">{btn.key}</span>
                    <span className="font-semibold text-sm">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Skip button */}
        {!isFlipped && (
          <div className="p-4 border-t">
            <Button variant="ghost" onClick={onSkip} className="w-full">
              {t.session.skipPenalty}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
