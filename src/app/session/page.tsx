'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Drill } from '@/components/content/drill';
import { Quiz } from '@/components/content/quiz';
import { Flashcard } from '@/components/content/flashcard';
import { XPPopup } from '@/components/gamification/xp-bar';
import { LevelUpModal } from '@/components/gamification/level-badge';
import { useSessionStore } from '@/lib/store/session-store';
import { useLanguageStore } from '@/lib/store/language-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  getSessionItemsForPack,
  getSessionItemsForPillar,
  getContentPack,
} from '@/lib/data/content-data';
import type { SessionType, Drill as DrillType, QuizQuestion, Flashcard as FlashcardType } from '@/lib/types';

function SessionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const sessionType = (searchParams.get('type') as SessionType) || 'practice';
  const pillarSlug = searchParams.get('pillar');
  const topicId = searchParams.get('topic');

  const {
    isActive,
    items,
    currentIndex,
    itemsAttempted,
    itemsCorrect,
    xpEarned,
    startSession,
    recordAnswer,
    skipItem,
    nextItem,
    endSession,
    resetSession,
  } = useSessionStore();

  const [mounted, setMounted] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    itemsAttempted: number;
    itemsCorrect: number;
    accuracy: number;
    xpEarned: number;
    durationSeconds: number;
    perfectSession: boolean;
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionTitle, setSessionTitle] = useState('Session');
  const hasInitialized = useRef(false);

  // Hydration protection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load session items based on URL params
  const loadSessionItems = () => {
    let sessionItems;
    let title = t.session.title;

    if (topicId) {
      // Load specific topic content
      sessionItems = getSessionItemsForPack(topicId, 10, language);
      const pack = getContentPack(topicId);
      if (pack) {
        title = pack.title[language];
      }
    } else if (pillarSlug) {
      // Load mixed content from pillar
      sessionItems = getSessionItemsForPillar(pillarSlug, 10, language);
      title = pillarSlug.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    } else {
      // Default: load random content from all pillars
      const allPillars = ['maths_tools', 'business_sense', 'industry_insights'];
      const randomPillar = allPillars[Math.floor(Math.random() * allPillars.length)];
      sessionItems = getSessionItemsForPillar(randomPillar, 10, language);
      title = t.session.practiceSession;
    }

    return { sessionItems, title };
  };

  // Initialize session with content based on URL params (only once after mount)
  useEffect(() => {
    if (!mounted) return;
    if (hasInitialized.current) return;

    const { sessionItems, title } = loadSessionItems();

    if (sessionItems && sessionItems.length > 0) {
      hasInitialized.current = true;
      setSessionTitle(title);
      startSession(sessionType, sessionItems);
    }
  }, [mounted, sessionType, pillarSlug, topicId, startSession, language]);

  // Timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const currentItem = items[currentIndex];
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;
  const isLastItem = currentIndex === items.length - 1;

  const handleAnswer = (wasCorrect: boolean, qualityScore: number, responseTimeMs: number, hintsUsed = 0) => {
    recordAnswer({ wasCorrect, qualityScore, responseTimeMs, hintsUsed });

    // Show XP popup
    const xpGained = wasCorrect ? currentItem.contentItem.xpValue - (hintsUsed > 0 ? 5 : 0) : 0;
    if (xpGained > 0) {
      setLastXpEarned(xpGained);
      setShowXpPopup(true);
    }

    // Check if last item
    if (isLastItem) {
      handleEndSession();
    } else {
      nextItem();
    }
  };

  const handleSkip = () => {
    skipItem();
    if (isLastItem) {
      handleEndSession();
    } else {
      nextItem();
    }
  };

  const handleEndSession = () => {
    const summary = endSession();
    setSessionSummary(summary);
    setShowSummary(true);

    // Celebrate if perfect session
    if (summary.perfectSession) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleClose = () => {
    resetSession();
    router.push('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Session summary screen
  if (showSummary && sessionSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {sessionSummary.perfectSession ? (
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                ) : sessionSummary.accuracy >= 0.8 ? (
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <Zap className="w-16 h-16 mx-auto mb-4" />
                )}
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">
                {sessionSummary.perfectSession
                  ? t.session.perfectSession
                  : sessionSummary.accuracy >= 0.8
                  ? t.session.greatJob
                  : t.session.sessionComplete}
              </h2>
              <p className="text-primary-100">{t.session.keepItUp}</p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">
                    {sessionSummary.itemsCorrect}/{sessionSummary.itemsAttempted}
                  </p>
                  <p className="text-sm text-gray-500">{t.session.correct}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(sessionSummary.accuracy * 100)}%
                  </p>
                  <p className="text-sm text-gray-500">{t.session.accuracy}</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <p className="text-3xl font-bold text-primary-600">
                    +{sessionSummary.xpEarned}
                  </p>
                  <p className="text-sm text-primary-600">{t.session.xpEarned}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatTime(sessionSummary.durationSeconds)}
                  </p>
                  <p className="text-sm text-gray-500">{t.session.duration}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    resetSession();
                    hasInitialized.current = false;
                    const { sessionItems, title } = loadSessionItems();
                    if (sessionItems && sessionItems.length > 0) {
                      hasInitialized.current = true;
                      setSessionTitle(title);
                      startSession(sessionType, sessionItems);
                    }
                    setShowSummary(false);
                    setElapsedTime(0);
                  }}
                  className="w-full"
                  size="lg"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t.session.continueLearning}
                </Button>
                <Button onClick={handleClose} variant="outline" className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  {t.session.backToDashboard}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Loading state - wait for mount and content
  if (!mounted || !currentItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t.session.loadingSession}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* XP Popup */}
      <XPPopup
        amount={lastXpEarned}
        show={showXpPopup}
        onComplete={() => setShowXpPopup(false)}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        show={showLevelUp}
        newLevel={8}
        newTitle="Principal"
        onClose={() => setShowLevelUp(false)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {formatTime(elapsedTime)}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-success-600 font-medium">{itemsCorrect}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <XCircle className="w-4 h-4 text-danger-500" />
                <span className="text-danger-600 font-medium">
                  {itemsAttempted - itemsCorrect}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 rounded-full">
              <Zap className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">{xpEarned} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-gray-500">
              {currentIndex + 1}/{items.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.contentItem.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentItem.contentItem.contentType === 'drill' && (
              <Drill
                drill={currentItem.detail as DrillType}
                onAnswer={({ wasCorrect, responseTimeMs, hintsUsed }) => {
                  const qualityScore = wasCorrect ? (hintsUsed > 0 ? 3 : 5) : 2;
                  handleAnswer(wasCorrect, qualityScore, responseTimeMs, hintsUsed);
                }}
                onSkip={handleSkip}
              />
            )}

            {currentItem.contentItem.contentType === 'quiz' && (
              <Quiz
                quiz={currentItem.detail as QuizQuestion}
                onAnswer={({ wasCorrect, responseTimeMs }) => {
                  const qualityScore = wasCorrect ? 5 : 2;
                  handleAnswer(wasCorrect, qualityScore, responseTimeMs);
                }}
                onSkip={handleSkip}
              />
            )}

            {currentItem.contentItem.contentType === 'flashcard' && (
              <Flashcard
                flashcard={currentItem.detail as FlashcardType}
                contentItem={currentItem.contentItem}
                onRate={(quality, responseTimeMs) => {
                  const wasCorrect = quality >= 3;
                  handleAnswer(wasCorrect, quality, responseTimeMs);
                }}
                onSkip={handleSkip}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SessionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading session...</p>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<SessionLoading />}>
      <SessionPageContent />
    </Suspense>
  );
}
