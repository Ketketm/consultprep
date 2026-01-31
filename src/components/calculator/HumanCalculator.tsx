'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore, OperationType } from '@/lib/store/calculator-store';
import { cn } from '@/lib/utils';

interface Problem {
  a: number;
  b: number;
  operation: OperationType;
  answer: number;
  display: string;
}

type GameState = 'idle' | 'countdown' | 'playing' | 'finished';

function generateProblem(settings: {
  operations: OperationType[];
  additionRange: [number, number];
  subtractionRange: [number, number];
  multiplicationRange: [number, number];
  divisionRange: [number, number];
}): Problem {
  const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];
  let a: number, b: number, answer: number, display: string;

  switch (operation) {
    case 'addition': {
      // (2 to 100) + (2 to 100)
      const [min, max] = settings.additionRange;
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = a + b;
      display = `${a} + ${b}`;
      break;
    }
    case 'subtraction': {
      // Addition in reverse: same ranges, ensure positive result
      const [min, max] = settings.subtractionRange;
      a = Math.floor(Math.random() * (max - min + 1)) + min;
      b = Math.floor(Math.random() * (max - min + 1)) + min;
      // Ensure a >= b for positive result
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      display = `${a} - ${b}`;
      break;
    }
    case 'multiplication': {
      // (2 to 12) × (2 to 100)
      const [min, max] = settings.multiplicationRange;
      a = Math.floor(Math.random() * (max - min + 1)) + min; // 2-12
      b = Math.floor(Math.random() * 99) + 2; // 2-100
      answer = a * b;
      display = `${a} × ${b}`;
      break;
    }
    case 'division': {
      // Multiplication in reverse: result is 2-100, divisor is 2-12
      const [min, max] = settings.divisionRange;
      b = Math.floor(Math.random() * (max - min + 1)) + min; // divisor 2-12
      answer = Math.floor(Math.random() * 99) + 2; // result 2-100
      a = b * answer; // Ensure clean division
      display = `${a} ÷ ${b}`;
      break;
    }
  }

  return { a, b, operation, answer, display };
}

export function HumanCalculator() {
  const { settings, personalBest, addSession } = useCalculatorStore();

  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(settings.duration);
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setQuestionsAttempted(0);
    setTimeRemaining(settings.duration);
    setUserInput('');
    setLastResult(null);
    setIsNewBest(false);
    setIsShaking(false);
    setWrongAttempts(0);
  }, [settings.duration]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setCurrentProblem(generateProblem(settings));
    inputRef.current?.focus();
  }, [settings]);

  // Check if current settings are classic mode (2 min, all 4 operations)
  const isClassicMode =
    settings.duration === 120 &&
    settings.operations.length === 4 &&
    settings.operations.includes('addition') &&
    settings.operations.includes('subtraction') &&
    settings.operations.includes('multiplication') &&
    settings.operations.includes('division');

  const endGame = useCallback(() => {
    setGameState('finished');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const accuracy = questionsAttempted > 0 ? Math.round((score / questionsAttempted) * 100) : 0;

    // Only save stats and check for personal best in classic mode
    if (isClassicMode) {
      // Check for new personal best
      if (score > personalBest) {
        setIsNewBest(true);
      }

      // Save session
      addSession({
        score,
        duration: settings.duration,
        operations: settings.operations,
        questionsAttempted,
        accuracy,
      });
    }
  }, [score, questionsAttempted, settings, personalBest, addSession, isClassicMode]);

  const checkAnswer = useCallback((input: string) => {
    if (!currentProblem) return;

    const numInput = parseInt(input, 10);
    if (isNaN(numInput)) return;

    if (numInput === currentProblem.answer) {
      // Correct answer - advance to next problem
      setScore((prev) => prev + 1);
      setQuestionsAttempted((prev) => prev + 1);
      setLastResult('correct');
      setWrongAttempts(0);

      // Generate next problem
      setCurrentProblem(generateProblem(settings));
      setUserInput('');

      // Clear result indicator after brief delay
      setTimeout(() => setLastResult(null), 150);
    } else {
      // Wrong answer - shake and stay on same problem
      setLastResult('incorrect');
      setIsShaking(true);
      setWrongAttempts((prev) => prev + 1);
      setUserInput('');

      // Stop shaking after animation
      setTimeout(() => {
        setIsShaking(false);
        setLastResult(null);
        inputRef.current?.focus();
      }, 500);
    }
  }, [currentProblem, settings]);

  // Countdown effect
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      startGame();
    }
  }, [gameState, countdown, startGame]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      checkAnswer(userInput);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and negative sign
    if (/^-?\d*$/.test(value)) {
      setUserInput(value);

      // Auto-check when input matches answer length
      if (value && currentProblem) {
        const answerStr = currentProblem.answer.toString();
        if (value.length >= answerStr.length) {
          checkAnswer(value);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Best: {personalBest}</span>
          </div>
        </div>
        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              <span className="font-bold text-xl text-gray-900">{score}</span>
            </div>
            <div className={cn(
              "font-mono text-xl font-bold px-3 py-1 rounded",
              timeRemaining <= 10 ? "text-red-600 bg-red-50" : "text-gray-900 bg-gray-100"
            )}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
      </div>

      {/* Main game area */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className={cn(
            "min-h-[300px] flex flex-col items-center justify-center p-8 transition-colors",
            lastResult === 'correct' && "bg-green-50",
            lastResult === 'incorrect' && "bg-red-50",
            !lastResult && "bg-white"
          )}>
            <AnimatePresence mode="wait">
              {gameState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Human Calculator</h2>
                  <p className="text-gray-500 mb-4">
                    Answer as many problems as you can in {settings.duration / 60} minutes
                  </p>
                  {!isClassicMode && (
                    <p className="text-yellow-600 text-sm mb-4 px-4 py-2 bg-yellow-50 rounded-lg inline-block">
                      Custom mode - stats will not be recorded
                    </p>
                  )}
                  <div>
                    <Button size="lg" onClick={startCountdown} className="gap-2">
                      <Play className="w-5 h-5" />
                      Start Game
                    </Button>
                  </div>
                </motion.div>
              )}

              {gameState === 'countdown' && (
                <motion.div
                  key="countdown"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-8xl font-bold text-primary-500"
                  >
                    {countdown || 'GO!'}
                  </motion.div>
                </motion.div>
              )}

              {gameState === 'playing' && currentProblem && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center w-full max-w-md"
                >
                  <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 font-mono">
                    {currentProblem.display} = ?
                  </div>
                  <motion.input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    animate={isShaking ? {
                      x: [0, -10, 10, -10, 10, -5, 5, 0],
                      transition: { duration: 0.4 }
                    } : {}}
                    className={cn(
                      "w-full max-w-xs mx-auto text-4xl font-mono text-center p-4 border-2 rounded-xl outline-none bg-white text-gray-900 transition-colors",
                      isShaking || lastResult === 'incorrect'
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    )}
                    autoFocus
                    placeholder="?"
                  />
                  {wrongAttempts > 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      Try again! ({wrongAttempts} wrong)
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mt-2">
                    Find the correct answer to continue
                  </p>
                </motion.div>
              )}

              {gameState === 'finished' && (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  {isNewBest && isClassicMode && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium inline-flex items-center gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      New Personal Best!
                    </motion.div>
                  )}
                  <div className="text-6xl font-bold text-gray-900 mb-2">{score}</div>
                  <p className="text-gray-500 mb-2">correct answers</p>
                  <div className="text-sm text-gray-400 mb-4">
                    {questionsAttempted} attempted • {questionsAttempted > 0 ? Math.round((score / questionsAttempted) * 100) : 0}% accuracy
                  </div>
                  {!isClassicMode && (
                    <p className="text-yellow-600 text-sm mb-4 px-4 py-2 bg-yellow-50 rounded-lg inline-block">
                      Custom mode - not saved to stats
                    </p>
                  )}
                  <div className="flex gap-3 justify-center">
                    <Button onClick={startCountdown} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Play Again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Game settings preview */}
      {gameState === 'idle' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {settings.operations.map((op) => (
                <span
                  key={op}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {op === 'addition' && '+ Addition'}
                  {op === 'subtraction' && '- Subtraction'}
                  {op === 'multiplication' && '× Multiplication'}
                  {op === 'division' && '÷ Division'}
                </span>
              ))}
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {settings.duration / 60} min
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
