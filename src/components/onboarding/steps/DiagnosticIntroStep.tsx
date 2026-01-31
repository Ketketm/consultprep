'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Brain } from 'lucide-react';

const BENEFITS = [
  { icon: Target, text: 'Parcours personnalise base sur vos lacunes' },
  { icon: CheckCircle2, text: 'Focus sur ce qui compte vraiment' },
  { icon: Brain, text: 'Estimation de votre niveau actuel' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function DiagnosticIntroStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
      >
        <Target className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Quiz Diagnostic
      </h2>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        25 questions pour identifier vos points forts et faiblesses sur les 5 piliers.
      </p>

      {/* Time estimate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-8"
      >
        <Clock className="w-4 h-4" />
        <span>Environ 10 minutes</span>
      </motion.div>

      {/* Benefits */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 max-w-sm mx-auto mb-8"
      >
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.text}
              variants={itemVariants}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-sm text-gray-700 text-left">{benefit.text}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Skip note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-gray-500"
      >
        Vous pouvez passer cette etape et faire le diagnostic plus tard.
      </motion.p>
    </motion.div>
  );
}
