'use client';

import { motion } from 'framer-motion';
import { Clock, Brain, Zap, Flame } from 'lucide-react';

const FEATURES = [
  {
    icon: Clock,
    title: 'Sessions de 5 minutes',
    description: 'Micro-learning efficace. Apprenez pendant vos trajets ou pauses cafe.',
    color: '#3b82f6',
  },
  {
    icon: Brain,
    title: 'Repetition espacee',
    description: 'L\'algorithme SM-2 optimise votre memorisation a long terme.',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'XP & Niveaux',
    description: 'Gagnez de l\'XP et progressez de Analyst Intern a Partner.',
    color: '#f59e0b',
  },
  {
    icon: Flame,
    title: 'Streaks quotidiennes',
    description: 'Maintenez votre serie pour des bonus XP et debloquer du contenu.',
    color: '#ef4444',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorksStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Comment ca marche ?
        </h2>
        <p className="text-gray-600">
          Une methode prouvee pour une preparation efficace.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-primary-50 rounded-xl max-w-md mx-auto"
      >
        <p className="text-sm text-primary-800 text-center">
          <strong>Fun fact:</strong> 15 minutes par jour pendant 30 jours = 7.5 heures de preparation ciblee
        </p>
      </motion.div>
    </motion.div>
  );
}
