'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Zap,
  Flame,
  Trophy,
  Calculator,
  Brain,
  Building2,
  Globe,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguageStore } from '@/lib/store/language-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageToggle } from '@/components/ui/language-toggle';

interface FAQ {
  id: string;
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
}

const FAQS: FAQ[] = [
  {
    id: 'what-is',
    questionEn: 'What is ConsultPrep?',
    questionFr: "Qu'est-ce que ConsultPrep ?",
    answerEn:
      'ConsultPrep is a gamified micro-learning platform designed to help you prepare for strategy consulting interviews (MBB: McKinsey, BCG, Bain). It combines flashcards, case practice, and mental math training in one place.',
    answerFr:
      "ConsultPrep est une plateforme d'apprentissage gamifiée conçue pour vous aider à préparer vos entretiens de conseil en stratégie (MBB : McKinsey, BCG, Bain). Elle combine flashcards, pratique de cas et entraînement au calcul mental en un seul endroit.",
  },
  {
    id: 'pillars',
    questionEn: 'What are the 5 pillars?',
    questionFr: 'Que sont les 5 piliers ?',
    answerEn:
      'The 5 pillars cover all aspects of consulting interview preparation: (1) Case Resolution - structured problem-solving, (2) Maths & Tools - formulas and mental math, (3) Business Sense - hypothesis reflex and business intuition, (4) Industry Insights - sector-specific knowledge, (5) General Knowledge - macro data for market sizing.',
    answerFr:
      "Les 5 piliers couvrent tous les aspects de la préparation aux entretiens consulting : (1) Résolution de Cas - résolution structurée de problèmes, (2) Maths & Outils - formules et calcul mental, (3) Sens des Affaires - réflexe d'hypothèse et intuition business, (4) Connaissances Sectorielles - connaissances par industrie, (5) Culture Générale - données macro pour le market sizing.",
  },
  {
    id: 'xp-levels',
    questionEn: 'How do XP and levels work?',
    questionFr: 'Comment fonctionnent les XP et les niveaux ?',
    answerEn:
      'You earn XP (experience points) by completing exercises. Each correct answer gives you XP based on difficulty. As you accumulate XP, you level up through consulting ranks: Analyst → Associate → Manager → Partner. Maintaining a daily streak also gives bonus XP!',
    answerFr:
      "Vous gagnez des XP (points d'expérience) en complétant des exercices. Chaque bonne réponse vous donne des XP basés sur la difficulté. En accumulant des XP, vous montez en niveau à travers les rangs consulting : Analyst → Associate → Manager → Partner. Maintenir une série quotidienne donne aussi des XP bonus !",
  },
  {
    id: 'streaks',
    questionEn: 'What are streaks?',
    questionFr: 'Que sont les séries ?',
    answerEn:
      "A streak tracks your consecutive days of practice. Practice at least once per day to maintain your streak. You have streak freezes that automatically protect your streak if you miss a day. Building long streaks unlocks special achievements!",
    answerFr:
      "Une série suit vos jours consécutifs de pratique. Pratiquez au moins une fois par jour pour maintenir votre série. Vous avez des 'gel de série' qui protègent automatiquement votre série si vous manquez un jour. Construire de longues séries débloque des succès spéciaux !",
  },
  {
    id: 'cases',
    questionEn: 'How do case studies work?',
    questionFr: 'Comment fonctionnent les études de cas ?',
    answerEn:
      'Cases are structured scenarios that guide you through consulting problem-solving. Each case has multiple steps: clarification, structure, calculation, brainstorming, and synthesis. You can practice "On Paper" (like a real interview) or "On Screen" (with typed responses).',
    answerFr:
      'Les cas sont des scénarios structurés qui vous guident dans la résolution de problèmes consulting. Chaque cas a plusieurs étapes : clarification, structure, calcul, brainstorming et synthèse. Vous pouvez pratiquer "Sur papier" (comme un vrai entretien) ou "À l\'écran" (avec des réponses tapées).',
  },
  {
    id: 'calculator',
    questionEn: 'What is the Human Calculator?',
    questionFr: "Qu'est-ce que le Calculateur Humain ?",
    answerEn:
      'The Human Calculator is a mental math trainer. You have 60 seconds to solve as many arithmetic problems as possible. Correct answers add time and points, wrong answers subtract time. Your personal best is tracked and compared to the leaderboard!',
    answerFr:
      "Le Calculateur Humain est un entraîneur de calcul mental. Vous avez 60 secondes pour résoudre autant de problèmes arithmétiques que possible. Les bonnes réponses ajoutent du temps et des points, les mauvaises réponses soustraient du temps. Votre meilleur score est suivi et comparé au classement !",
  },
  {
    id: 'flashcards',
    questionEn: 'How do flashcards work?',
    questionFr: 'Comment fonctionnent les flashcards ?',
    answerEn:
      "Flashcards use spaced repetition to help you memorize key facts. Cards you find difficult appear more often, while mastered cards appear less frequently. Rate each card honestly (1-5) to optimize your learning. Some cards require typing the answer, others just revealing.",
    answerFr:
      "Les flashcards utilisent la répétition espacée pour vous aider à mémoriser les faits clés. Les cartes difficiles apparaissent plus souvent, tandis que les cartes maîtrisées apparaissent moins fréquemment. Évaluez chaque carte honnêtement (1-5) pour optimiser votre apprentissage. Certaines cartes demandent de taper la réponse, d'autres juste de révéler.",
  },
  {
    id: 'language',
    questionEn: 'Can I switch between French and English?',
    questionFr: 'Puis-je passer du français à l\'anglais ?',
    answerEn:
      'Yes! ConsultPrep is fully bilingual. Click the language toggle in the top right corner to switch between French and English. All content, including flashcards and cases, is available in both languages.',
    answerFr:
      "Oui ! ConsultPrep est entièrement bilingue. Cliquez sur le bouton de langue en haut à droite pour passer du français à l'anglais. Tout le contenu, y compris les flashcards et les cas, est disponible dans les deux langues.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    titleEn: 'Case Practice',
    titleFr: 'Pratique de Cas',
    descriptionEn: 'Work through real consulting cases step by step',
    descriptionFr: 'Travaillez sur des cas consulting réels étape par étape',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Brain,
    titleEn: 'Flashcards',
    titleFr: 'Flashcards',
    descriptionEn: 'Memorize formulas, benchmarks, and key facts',
    descriptionFr: 'Mémorisez formules, benchmarks et faits clés',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    icon: Calculator,
    titleEn: 'Mental Math',
    titleFr: 'Calcul Mental',
    descriptionEn: 'Train speed and accuracy under pressure',
    descriptionFr: 'Entraînez vitesse et précision sous pression',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Building2,
    titleEn: 'Industry Knowledge',
    titleFr: 'Connaissances Sectorielles',
    descriptionEn: 'Learn margins, metrics, and sector specifics',
    descriptionFr: 'Apprenez marges, métriques et spécificités sectorielles',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Globe,
    titleEn: 'Bilingual',
    titleFr: 'Bilingue',
    descriptionEn: 'Full content in French and English',
    descriptionFr: 'Contenu complet en français et anglais',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
  {
    icon: Trophy,
    titleEn: 'Gamification',
    titleFr: 'Gamification',
    descriptionEn: 'XP, levels, streaks, and achievements',
    descriptionFr: 'XP, niveaux, séries et succès',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
  },
];

export default function HelpPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-bold text-xl text-gray-900">{t.help.title}</h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md">
                  <HelpCircle className="w-8 h-8 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {language === 'fr' ? 'Bienvenue sur ConsultPrep' : 'Welcome to ConsultPrep'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {language === 'fr'
                      ? 'Votre plateforme de préparation aux entretiens consulting'
                      : 'Your consulting interview preparation platform'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'fr' ? 'Fonctionnalités' : 'Features'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {language === 'fr' ? feature.titleFr : feature.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'fr' ? feature.descriptionFr : feature.descriptionEn}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                {t.help.faq}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {FAQS.map((faq) => (
                <div key={faq.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {language === 'fr' ? faq.questionFr : faq.questionEn}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-600 text-sm">{language === 'fr' ? faq.answerFr : faq.answerEn}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                {t.help.contact}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {language === 'fr'
                  ? "Des questions ou des suggestions ? N'hésitez pas à nous contacter."
                  : "Questions or suggestions? Don't hesitate to reach out."}
              </p>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                contact@consultprep.app
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Version Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>ConsultPrep v1.0.0</p>
          <p className="mt-1">{language === 'fr' ? 'Fait avec ❤️ pour les futurs consultants' : 'Made with ❤️ for future consultants'}</p>
        </div>
      </main>
    </div>
  );
}
