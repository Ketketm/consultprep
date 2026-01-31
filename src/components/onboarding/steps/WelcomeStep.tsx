'use client';

import { motion } from 'framer-motion';

const PILLAR_PREVIEWS = [
  { icon: '📋', name: 'Case Resolution', color: '#3b82f6' },
  { icon: '🧮', name: 'Maths & Tools', color: '#22c55e' },
  { icon: '💡', name: 'Business Sense', color: '#f59e0b' },
  { icon: '📊', name: 'Industry Insights', color: '#8b5cf6' },
  { icon: '🌍', name: 'General Knowledge', color: '#ec4899' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function WelcomeStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg"
      >
        <span className="text-white font-bold text-3xl">C</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
      >
        Bienvenue sur ConsultPrep
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
      >
        Le Duolingo du Consulting. Preparez vos entretiens MBB en seulement 5 minutes par jour.
      </motion.p>

      {/* 5 Pillars Preview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-5 gap-2 sm:gap-4 max-w-lg mx-auto mb-8"
      >
        {PILLAR_PREVIEWS.map((pillar) => (
          <motion.div
            key={pillar.name}
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl mb-2"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              {pillar.icon}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 text-center leading-tight">
              {pillar.name.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Features list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-500 space-y-2"
      >
        <p>5 piliers pour maitriser le case interview</p>
        <p>Algorithme adaptatif pour cibler vos faiblesses</p>
        <p>Gamification pour rester motive</p>
      </motion.div>
    </motion.div>
  );
}
