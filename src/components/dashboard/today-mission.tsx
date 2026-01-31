'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Target, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface TodayMissionProps {
  reviewDueCount: number;
  weakestTopic: string | null;
  suggestedSessionType: 'quick_drill' | 'review' | 'practice';
  estimatedMinutes: number;
  className?: string;
}

export function TodayMission({
  reviewDueCount,
  weakestTopic,
  suggestedSessionType,
  className,
}: TodayMissionProps) {
  const { t } = useTranslation();

  const missions = [
    {
      id: 'quick_drill',
      icon: Zap,
      title: t.dashboard.quickDrill,
      description: t.dashboard.quickDrillDesc,
      time: '5 min',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
      href: '/session?type=quick_drill',
      priority: suggestedSessionType === 'quick_drill' ? 1 : 3,
    },
    {
      id: 'review',
      icon: BookOpen,
      title: t.dashboard.reviewDue,
      description: `${reviewDueCount} ${t.dashboard.itemsReadyForReview}`,
      time: `${Math.ceil(reviewDueCount * 0.5)} min`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
      href: '/session?type=review',
      badge: reviewDueCount > 0 ? reviewDueCount : undefined,
      priority: reviewDueCount > 5 ? 1 : 2,
    },
    {
      id: 'weakness',
      icon: Target,
      title: t.dashboard.weaknessFocus,
      description: weakestTopic ? `${t.dashboard.focusOn} ${weakestTopic}` : t.dashboard.allAreasBalanced,
      time: '10 min',
      color: 'text-red-500',
      bgColor: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50',
      href: `/session?type=practice&focus=${weakestTopic}`,
      priority: weakestTopic ? 2 : 4,
      disabled: !weakestTopic,
    },
  ];

  // Sort by priority
  const sortedMissions = [...missions].sort((a, b) => a.priority - b.priority);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          {t.dashboard.todaysMission}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedMissions.map((mission, index) => {
          const Icon = mission.icon;
          const isPrimary = index === 0;

          if (mission.disabled) {
            return null;
          }

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={mission.href}>
                <div
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer',
                    mission.bgColor,
                    isPrimary && 'ring-2 ring-primary-200'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm',
                      mission.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{mission.title}</h4>
                      {mission.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                          {mission.badge}
                        </span>
                      )}
                      {isPrimary && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 rounded-full">
                          {t.dashboard.recommended}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{mission.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <span>{mission.time}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        <div className="pt-2">
          <Link href="/session?type=practice">
            <Button className="w-full" size="lg">
              {t.dashboard.startSession}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
