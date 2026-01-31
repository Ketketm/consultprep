'use client';

import { motion } from 'framer-motion';
import { Check, GraduationCap, Briefcase, Award, Repeat } from 'lucide-react';
import { useOnboardingStore, type ExperienceLevel } from '@/lib/store/onboarding-store';
import { cn } from '@/lib/utils';

const LEVELS: Array<{
  id: ExperienceLevel;
  name: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    id: 'student',
    name: 'Etudiant',
    description: 'En ecole de commerce ou universite',
    icon: GraduationCap,
  },
  {
    id: 'young_professional',
    name: 'Jeune professionnel',
    description: '1-3 ans d\'experience',
    icon: Briefcase,
  },
  {
    id: 'experienced',
    name: 'Experimente',
    description: '4+ ans d\'experience professionnelle',
    icon: Award,
  },
  {
    id: 'career_changer',
    name: 'Reconversion',
    description: 'Je change de secteur ou de carriere',
    icon: Repeat,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function ExperienceLevelStep() {
  const { experienceLevel, setExperienceLevel } = useOnboardingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Quel est votre profil ?
        </h2>
        <p className="text-gray-600">
          Cette information nous aide a calibrer la difficulte et le vocabulaire.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 max-w-md mx-auto"
      >
        {LEVELS.map((level) => {
          const isSelected = experienceLevel === level.id;
          const Icon = level.icon;

          return (
            <motion.button
              key={level.id}
              variants={itemVariants}
              onClick={() => setExperienceLevel(level.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{level.name}</h3>
                <p className="text-sm text-gray-500">{level.description}</p>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
