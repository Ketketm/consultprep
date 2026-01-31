'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useOnboardingStore, type TargetCompany } from '@/lib/store/onboarding-store';
import { cn } from '@/lib/utils';

const COMPANIES: Array<{
  id: TargetCompany;
  name: string;
  tagline: string;
  color: string;
}> = [
  { id: 'mckinsey', name: 'McKinsey & Company', tagline: 'The Firm', color: '#0077b5' },
  { id: 'bcg', name: 'Boston Consulting Group', tagline: 'Unlocking potential', color: '#00965e' },
  { id: 'bain', name: 'Bain & Company', tagline: 'Results, not reports', color: '#cc0000' },
  { id: 'other', name: 'Autre cabinet', tagline: 'Tier 2 ou boutique', color: '#6b7280' },
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

export function TargetCompanyStep() {
  const { targetCompany, setTargetCompany } = useOnboardingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Quel cabinet visez-vous ?
        </h2>
        <p className="text-gray-600">
          Nous adapterons le contenu selon les specificites de chaque cabinet.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto"
      >
        {COMPANIES.map((company) => {
          const isSelected = targetCompany === company.id;
          return (
            <motion.button
              key={company.id}
              variants={itemVariants}
              onClick={() => setTargetCompany(company.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative p-5 rounded-xl border-2 text-left transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Company color bar */}
              <div
                className="w-10 h-1 rounded-full mb-3"
                style={{ backgroundColor: company.color }}
              />

              <h3 className="font-semibold text-gray-900 mb-1">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.tagline}</p>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-gray-500 mt-6"
      >
        Vous pourrez modifier ce choix plus tard dans les parametres.
      </motion.p>
    </motion.div>
  );
}
