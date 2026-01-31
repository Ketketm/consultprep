'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle2, Clock, BookOpen, Briefcase, Building2, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { cn } from '@/lib/utils';
import { getContentPacksForPillar } from '@/lib/data/content-data';
import { getAllDemoCases, getDemoCaseByLanguage } from '@/lib/data/demo-cases';
import { useLanguageStore } from '@/lib/store/language-store';
import { useCaseStore } from '@/lib/store/case-store';

// Pillar metadata
const PILLAR_META: Record<string, {
  name: string;
  description: string;
  colorHex: string;
  icon: string;
}> = {
  case_resolution: {
    name: 'Case Resolution',
    description: 'Maitrisez l\'art de la resolution structuree de problemes business',
    colorHex: '#3b82f6',
    icon: '📋',
  },
  maths_tools: {
    name: 'Maths & Business Tools',
    description: 'CAGR, WACC, NPV et frameworks essentiels a portee de main',
    colorHex: '#22c55e',
    icon: '🧮',
  },
  business_sense: {
    name: 'Business Sense',
    description: 'Developpez votre reflexe hypothese avec des scenarios reels',
    colorHex: '#f59e0b',
    icon: '💡',
  },
  industry_insights: {
    name: 'Industry Insights',
    description: 'Marges, tendances et benchmarks par secteur',
    colorHex: '#8b5cf6',
    icon: '📊',
  },
  general_knowledge: {
    name: 'General Knowledge',
    description: 'Donnees macro pour le market sizing: PIB, population, stats cles',
    colorHex: '#ec4899',
    icon: '🌍',
  },
};

export default function PillarPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguageStore();
  const { importCase, loadCase } = useCaseStore();
  const pillarSlug = params.pillarSlug as string;
  const pillarMeta = PILLAR_META[pillarSlug];
  const contentPacks = getContentPacksForPillar(pillarSlug);

  // Get demo cases for Case Resolution pillar
  const demoCases = pillarSlug === 'case_resolution' ? getAllDemoCases() : [];

  const handleStartCase = (demoCaseId: string) => {
    const demoCase = getDemoCaseByLanguage(demoCaseId, language);
    if (demoCase) {
      importCase(demoCase);
      loadCase(demoCase, demoCaseId);
      router.push(`/case?id=${demoCase.meta.case_id}&demo=${demoCaseId}`);
    }
  };

  if (!pillarMeta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Pilier non trouve</p>
            <Link href="/learn">
              <Button>Retour</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total items - demo mode: all at 100%
  const totalItems = contentPacks.reduce((sum, pack) => sum + pack.items.length, 0);
  const completedItems = totalItems; // Demo mode: all completed
  const progressPercentage = 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" title="Dashboard">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="ghost" size="icon" title="Back to Learn">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${pillarMeta.colorHex}20` }}
                >
                  {pillarMeta.icon}
                </div>
                <span className="font-bold text-xl text-gray-900">{pillarMeta.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Link href={`/session?pillar=${pillarSlug}&type=practice`}>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  {language === 'fr' ? 'Commencer' : 'Start'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pillar overview */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card
            className="border-l-4"
            style={{ borderLeftColor: pillarMeta.colorHex }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{pillarMeta.name}</h1>
                  <p className="text-gray-500">{pillarMeta.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold" style={{ color: pillarMeta.colorHex }}>
                      {progressPercentage}%
                    </p>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                    <p className="text-sm text-gray-500">items</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Cases Section (Case Resolution only) */}
        {demoCases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  {language === 'fr' ? 'Cas pratiques' : 'Practice Cases'} ({demoCases.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoCases.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all',
                        'bg-gradient-to-r from-blue-50 to-white border-blue-200',
                        'hover:shadow-md hover:border-blue-300'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {language === 'fr' ? demo.titleFr : demo.titleEn}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {language === 'fr' ? demo.descriptionFr : demo.descriptionEn}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Building2 className="w-3 h-3" />
                                {demo.caseEn.meta.firm_style}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {demo.estimatedMinutes} min
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                {demo.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => handleStartCase(demo.id)} className="gap-2">
                          <Play className="w-4 h-4" />
                          {language === 'fr' ? 'Démarrer' : 'Start'}
                        </Button>
                      </div>
                      {demo.tags && demo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 ml-13">
                          {demo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content packs / Topics */}
        {contentPacks.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                Topics ({contentPacks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentPacks.map((pack, index) => {
                // Demo mode: all packs at 100%
                const packProgress = 100;
                const packCompleted = pack.items.length;
                const isComplete = true;

                return (
                  <motion.div
                    key={pack.packId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/session?pillar=${pillarSlug}&topic=${pack.packId}&type=practice`}>
                      <div
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          'hover:shadow-md hover:border-primary-300',
                          isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                                isComplete
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              )}
                            >
                              {isComplete ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{pack.title[language]}</h3>
                              <p className="text-sm text-gray-500">
                                {pack.items.length} questions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {Math.ceil(pack.items.length * 0.5)} min
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={packProgress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-24 text-right">
                            {packCompleted}/{pack.items.length} items
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Contenu a venir</h3>
              <p className="text-gray-500">
                Le contenu pour ce pilier sera bientot disponible.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
