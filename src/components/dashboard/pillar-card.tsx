'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLanguageStore } from '@/lib/store/language-store';

interface Subcategory {
  id: string;
  labelEn: string;
  labelFr: string;
  count: number;
  icon: string;
  color: string;
}

interface PillarCardProps {
  pillar: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    colorHex: string | null;
    iconUrl: string | null;
  };
  progress: {
    percentage: number;
    itemsCompleted: number;
    itemsTotal: number;
    isUnlocked: boolean;
  };
  index: number;
  subcategories?: Subcategory[];
}

const pillarIcons: Record<string, string> = {
  case_resolution: '📋',
  maths_tools: '🧮',
  business_sense: '💡',
  industry_insights: '📊',
  general_knowledge: '🌍',
};

export function PillarCard({ pillar, progress, index, subcategories }: PillarCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const icon = pillarIcons[pillar.slug] || '📚';

  if (!progress.isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative p-6 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{t.dashboard.completePreviousPillar}</p>
          </div>
        </div>
        <div className="opacity-30">
          <div className="text-3xl mb-2">{icon}</div>
          <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={pillar.slug === 'case_resolution' ? '/case/import' : `/learn/${pillar.slug}`}
        className="block group"
      >
        <div
          className={cn(
            'p-6 rounded-2xl border-2 transition-all',
            'hover:shadow-lg hover:scale-[1.02]',
            'bg-white border-gray-200 hover:border-primary-300'
          )}
          style={{
            borderLeftColor: pillar.colorHex || undefined,
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{icon}</div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{pillar.name}</h3>
          {pillar.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pillar.description}</p>
          )}

          {/* Subcategories - shown by default, max 2 rows */}
          {subcategories && subcategories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5 max-h-[52px] overflow-hidden">
              {subcategories.map((sub) => (
                <span
                  key={sub.id}
                  className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', sub.color)}
                >
                  <span>{sub.icon}</span>
                  <span>{language === 'fr' ? sub.labelFr : sub.labelEn}</span>
                  <span className="opacity-70">({sub.count})</span>
                </span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{progress.percentage}% {t.dashboard.complete}</span>
              <span>
                {progress.itemsCompleted}/{progress.itemsTotal} {t.dashboard.items}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
