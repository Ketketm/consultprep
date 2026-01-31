'use client';

import { motion } from 'framer-motion';
import { Check, Flame, Shield } from 'lucide-react';
import { useOnboardingStore, type DailyGoal } from '@/lib/store/onboarding-store';
import { cn } from '@/lib/utils';

const GOALS: Array<{
  minutes: DailyGoal;
  label: string;
  description: string;
  recommended?: boolean;
}> = [
  { minutes: 5, label: 'Debutant', description: 'Parfait pour commencer' },
  { minutes: 10, label: 'Regulier', description: 'Ideal pour progresser', recommended: true },
  { minutes: 15, label: 'Serieux', description: 'Resultats rapides' },
  { minutes: 20, label: 'Intensif', description: 'Maximum d\'efficacite' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export function DailyCommitmentStep() {
  const { dailyGoalMinutes, setDailyGoal } = useOnboardingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Votre objectif quotidien
        </h2>
        <p className="text-gray-600">
          Combien de temps pouvez-vous consacrer chaque jour ?
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8"
      >
        {GOALS.map((goal) => {
          const isSelected = dailyGoalMinutes === goal.minutes;
          return (
            <motion.button
              key={goal.minutes}
              variants={itemVariants}
              onClick={() => setDailyGoal(goal.minutes)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative p-4 rounded-xl border-2 text-center transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              {goal.recommended && !isSelected && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary-500 text-white text-[10px] font-medium rounded-full">
                  Recommande
                </span>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <p className="text-3xl font-bold text-gray-900 mb-1">{goal.minutes}</p>
              <p className="text-xs text-gray-500 mb-1">min/jour</p>
              <p className="text-xs font-medium text-gray-700">{goal.label}</p>
              <p className="text-[10px] text-gray-500">{goal.description}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Streak explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 max-w-md mx-auto"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Systeme de Streaks</h4>
            <p className="text-sm text-gray-600 mb-2">
              Completez votre objectif chaque jour pour maintenir votre serie et gagner des bonus XP.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Streak Freeze disponibles pour proteger votre serie</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
