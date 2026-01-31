'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PILLARS = [
  {
    icon: '📋',
    name: 'Case Resolution',
    color: '#3b82f6',
    description: 'Maitrisez l\'art de la resolution structuree de problemes business.',
    example: 'Structurez un cas de reduction des couts pour un retailer en 5 minutes.',
    topics: ['Market Entry', 'Profitability', 'M&A', 'Growth Strategy', 'Pricing'],
  },
  {
    icon: '🧮',
    name: 'Maths & Tools',
    color: '#22c55e',
    description: 'CAGR, NPV, WACC et calculs mentaux sous pression.',
    example: 'Calculez le CAGR sur 5 ans d\'un CA passant de 100M EUR a 150M EUR.',
    topics: ['Mental Math', 'Financial Formulas', 'Unit Economics', 'Estimation'],
  },
  {
    icon: '💡',
    name: 'Business Sense',
    color: '#f59e0b',
    description: 'Developpez votre reflexe hypothese avec des scenarios reels.',
    example: 'Un retailer voit ses marges baisser. Quelles hypotheses testez-vous ?',
    topics: ['Profitability Analysis', 'Revenue Decomposition', 'Competitive Dynamics'],
  },
  {
    icon: '📊',
    name: 'Industry Insights',
    color: '#8b5cf6',
    description: 'Marges, tendances et benchmarks par secteur.',
    example: 'Quelle est la marge EBITDA typique dans le luxe vs la grande distribution ?',
    topics: ['Tech & SaaS', 'Retail', 'Healthcare', 'Financial Services', 'Energy'],
  },
  {
    icon: '🌍',
    name: 'General Knowledge',
    color: '#ec4899',
    description: 'PIB, population, donnees macro pour le market sizing.',
    example: 'Combien de voitures sont vendues en France chaque annee ?',
    topics: ['Global Economics', 'Demographics', 'Market Sizes', 'Company Facts'],
  },
];

export function PillarsDeepDiveStep() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPillar = PILLARS[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? PILLARS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === PILLARS.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Les 5 Piliers
        </h2>
        <p className="text-gray-600">
          Decouvrez chaque domaine d'entrainement.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-lg mx-auto">
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden sm:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden sm:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg"
            style={{ borderTopColor: currentPillar.color, borderTopWidth: '4px' }}
          >
            {/* Icon & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${currentPillar.color}15` }}
              >
                {currentPillar.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentPillar.name}</h3>
                <p className="text-sm text-gray-500">{currentPillar.topics.length} topics</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{currentPillar.description}</p>

            {/* Example */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Exemple de question</p>
              <p className="text-sm text-gray-800 italic">"{currentPillar.example}"</p>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {currentPillar.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${currentPillar.color}15`,
                    color: currentPillar.color,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile navigation */}
        <div className="flex items-center justify-center gap-4 mt-4 sm:hidden">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {PILLARS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                idx === currentIndex
                  ? 'bg-primary-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
