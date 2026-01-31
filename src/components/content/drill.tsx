'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Drill as DrillType, DrillOption } from '@/lib/types';

interface DrillProps {
  drill: DrillType;
  onAnswer: (params: {
    selectedOptionId: string;
    wasCorrect: boolean;
    responseTimeMs: number;
    hintsUsed: number;
  }) => void;
  onSkip: () => void;
}

export function Drill({ drill, onAnswer, onSkip }: DrillProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(drill.timeLimitSeconds || 0);

  // Timer countdown
  useEffect(() => {
    if (!drill.timeLimitSeconds || showResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [drill.timeLimitSeconds, showResult]);

  const handleSubmit = useCallback(() => {
    if (!selectedOption && !showResult) {
      // Time ran out without selection
      setShowResult(true);
      return;
    }

    if (selectedOption && !showResult) {
      setShowResult(true);
    }
  }, [selectedOption, showResult]);

  const handleContinue = () => {
    const correctOption = drill.options.find((o) => o.isCorrect);
    const wasCorrect = selectedOption === correctOption?.id;
    const responseTimeMs = Date.now() - startTime;

    onAnswer({
      selectedOptionId: selectedOption || '',
      wasCorrect,
      responseTimeMs,
      hintsUsed,
    });
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);
  };

  const correctOption = drill.options.find((o) => o.isCorrect);
  const isCorrect = selectedOption === correctOption?.id;

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      {/* Header with timer */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Business Sense
          </span>
          <span className="text-sm text-gray-500">Drill</span>
        </div>
        {drill.timeLimitSeconds && !showResult && (
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
              timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'
            )}
          >
            <Clock className="w-4 h-4" />
            {timeLeft}s
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Scenario */}
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{drill.scenarioText}</p>
          {drill.scenarioImageUrl && (
            <img
              src={drill.scenarioImageUrl}
              alt="Scenario illustration"
              className="rounded-lg max-h-48 object-contain"
            />
          )}
        </div>

        {/* Question */}
        <div className="pt-2">
          <h3 className="text-lg font-semibold text-gray-900">{drill.questionText}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {drill.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !showResult && setSelectedOption(option.id)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                'hover:border-primary-300 hover:bg-primary-50',
                selectedOption === option.id && !showResult && 'border-primary-500 bg-primary-50',
                showResult &&
                  option.isCorrect &&
                  'border-success-500 bg-success-50',
                showResult &&
                  selectedOption === option.id &&
                  !option.isCorrect &&
                  'border-danger-500 bg-danger-50',
                showResult && selectedOption !== option.id && !option.isCorrect && 'opacity-50'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium',
                    selectedOption === option.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option.text}</span>
                {showResult && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                )}
                {showResult && selectedOption === option.id && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        {drill.frameworkHint && !showResult && (
          <div className="pt-2">
            {!showHint ? (
              <Button variant="ghost" size="sm" onClick={handleHint} className="text-gray-500">
                <Lightbulb className="w-4 h-4 mr-2" />
                Show hint (-5 XP)
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800"
              >
                <strong>Hint:</strong> {drill.frameworkHint}
              </motion.div>
            )}
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'p-4 rounded-xl',
                isCorrect ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success-600" />
                    <span className="font-semibold text-success-700">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-danger-600" />
                    <span className="font-semibold text-danger-700">Not quite</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{drill.explanation}</p>
              {!isCorrect && selectedOption && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Your choice:</strong>{' '}
                  {drill.options.find((o) => o.id === selectedOption)?.feedback}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={onSkip} disabled={showResult}>
            Skip (-5 XP)
          </Button>
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={!selectedOption} size="lg">
              Confirm Answer
            </Button>
          ) : (
            <Button onClick={handleContinue} size="lg" variant={isCorrect ? 'success' : 'default'}>
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
