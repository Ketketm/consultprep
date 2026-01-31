'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOnboardingStore } from '@/lib/store/onboarding-store';

const COMPANY_LABELS: Record<string, string> = {
  mckinsey: 'McKinsey & Company',
  bcg: 'Boston Consulting Group',
  bain: 'Bain & Company',
  other: 'Autre cabinet',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  student: 'Etudiant',
  young_professional: 'Jeune professionnel',
  experienced: 'Experimente',
  career_changer: 'Reconversion',
};

export function ReadyToStartStep() {
  const { targetCompany, experienceLevel, dailyGoalMinutes, skipDiagnostic } = useOnboardingStore();

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      {/* Celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="relative w-24 h-24 mx-auto mb-6"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
        >
          <span className="text-lg">🎉</span>
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
      >
        Vous etes pret(e) !
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-6"
      >
        Votre parcours personnalise vous attend.
      </motion.p>

      {/* XP Reward */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full shadow-lg mb-8"
      >
        <Zap className="w-6 h-6" />
        <span className="text-xl font-bold">+50 XP</span>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 p-5 max-w-sm mx-auto text-left"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Votre configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cabinet cible</p>
              <p className="text-sm font-medium text-gray-900">
                {targetCompany ? COMPANY_LABELS[targetCompany] : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Profil</p>
              <p className="text-sm font-medium text-gray-900">
                {experienceLevel ? EXPERIENCE_LABELS[experienceLevel] : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Objectif quotidien</p>
              <p className="text-sm font-medium text-gray-900">
                {dailyGoalMinutes ? `${dailyGoalMinutes} minutes/jour` : '-'}
              </p>
            </div>
          </div>
          {skipDiagnostic && (
            <p className="text-xs text-gray-500 pt-2 border-t">
              Quiz diagnostic: a faire plus tard
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
