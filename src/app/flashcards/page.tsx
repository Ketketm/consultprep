'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  List,
  Play,
  Filter,
  Trash2,
  ExternalLink,
  BookOpen,
  FileText,
  Calculator,
  Lightbulb,
  ClipboardList,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useCaseStore } from '@/lib/store/case-store';
import type { StepType, CaseFlashcard } from '@/lib/types/case-types';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'review';
type FilterCase = 'all' | string;
type FilterType = 'all' | StepType;

const STEP_TYPE_LABELS: Record<StepType, string> = {
  clarification: 'Clarification',
  structure: 'Structure',
  calculation: 'Calcul',
  brainstorming: 'Brainstorming',
  synthesis: 'Synthèse',
};

const STEP_TYPE_ICONS: Record<StepType, typeof FileText> = {
  clarification: MessageSquare,
  structure: FileText,
  calculation: Calculator,
  brainstorming: Lightbulb,
  synthesis: ClipboardList,
};

export default function FlashcardsPage() {
  const { caseFlashcards, importedCases, deleteFlashcard } = useCaseStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch with persisted Zustand stores
  useEffect(() => {
    setMounted(true);
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterCase, setFilterCase] = useState<FilterCase>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Filter flashcards
  const filteredFlashcards = useMemo(() => {
    return caseFlashcards.filter((fc) => {
      if (filterCase !== 'all' && fc.case_id !== filterCase) return false;
      if (filterType !== 'all' && fc.step_type !== filterType) return false;
      return true;
    });
  }, [caseFlashcards, filterCase, filterType]);

  // Get unique case IDs for filter dropdown
  const uniqueCaseIds = useMemo(() => {
    const ids = new Set(caseFlashcards.map((fc) => fc.case_id));
    return Array.from(ids);
  }, [caseFlashcards]);

  // Get case title by ID
  const getCaseTitle = (caseId: string) => {
    const caseData = importedCases.find((c) => c.meta.case_id === caseId);
    return caseData?.meta.title || caseId;
  };

  // Toggle card expansion
  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Review mode handlers
  const currentReviewCard = filteredFlashcards[currentReviewIndex];

  const handleNextReviewCard = () => {
    setIsFlipped(false);
    if (currentReviewIndex < filteredFlashcards.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      // End of review - go back to list
      setViewMode('list');
      setCurrentReviewIndex(0);
    }
  };

  const handlePreviousReviewCard = () => {
    setIsFlipped(false);
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };

  const startReview = () => {
    if (filteredFlashcards.length > 0) {
      setCurrentReviewIndex(0);
      setIsFlipped(false);
      setViewMode('review');
    }
  };

  const handleDeleteFlashcard = (id: string) => {
    if (confirm('Supprimer cette flashcard ?')) {
      deleteFlashcard(id);
    }
  };

  // Render step type badge
  const StepTypeBadge = ({ type }: { type: StepType }) => {
    const Icon = STEP_TYPE_ICONS[type];
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <Icon className="w-3 h-3" />
        {STEP_TYPE_LABELS[type]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Révision Cas</h1>
                <p className="text-sm text-gray-500">
                  {caseFlashcards.length} flashcard{caseFlashcards.length > 1 ? 's' : ''} au total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  Liste
                </Button>
                <Button
                  variant={viewMode === 'review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={startReview}
                  disabled={filteredFlashcards.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!mounted ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : (
          <>
        {/* Filters */}
        {viewMode === 'list' && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filtrer:</span>
                </div>

                <select
                  value={filterCase}
                  onChange={(e) => setFilterCase(e.target.value)}
                  className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Tous les cas</option>
                  {uniqueCaseIds.map((id) => (
                    <option key={id} value={id}>
                      {getCaseTitle(id)}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Tous les types</option>
                  {Object.entries(STEP_TYPE_LABELS).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>

                {(filterCase !== 'all' || filterType !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterCase('all');
                      setFilterType('all');
                    }}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>

              {filteredFlashcards.length !== caseFlashcards.length && (
                <p className="text-sm text-gray-500 mt-2">
                  {filteredFlashcards.length} flashcard{filteredFlashcards.length > 1 ? 's' : ''}{' '}
                  filtrée{filteredFlashcards.length > 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {caseFlashcards.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune flashcard
              </h3>
              <p className="text-gray-500 mb-4">
                Les flashcards sont créées automatiquement lorsque vous vous auto-évaluez
                &quot;Pas du tout&quot; ou &quot;Moyen&quot; sur une étape de cas.
              </p>
              <Link href="/case/import">
                <Button>Importer un cas</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* List view */}
        {viewMode === 'list' && filteredFlashcards.length > 0 && (
          <div className="space-y-4">
            {filteredFlashcards.map((flashcard) => (
              <FlashcardListItem
                key={flashcard.id}
                flashcard={flashcard}
                caseTitle={getCaseTitle(flashcard.case_id)}
                isExpanded={expandedCards.has(flashcard.id)}
                onToggle={() => toggleCardExpansion(flashcard.id)}
                onDelete={() => handleDeleteFlashcard(flashcard.id)}
                StepTypeBadge={StepTypeBadge}
              />
            ))}
          </div>
        )}

        {/* Review mode */}
        {viewMode === 'review' && currentReviewCard && (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-4 text-center">
              <span className="text-sm text-gray-500">
                Carte {currentReviewIndex + 1} / {filteredFlashcards.length}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentReviewIndex + 1) / filteredFlashcards.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Review card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StepTypeBadge type={currentReviewCard.step_type} />
                    <span className="text-sm text-gray-500">
                      {getCaseTitle(currentReviewCard.case_id)}
                    </span>
                  </div>
                  <Link
                    href={currentReviewCard.return_to_case_ref.route}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 min-h-[250px] flex flex-col items-center justify-center"
                    >
                      <p className="text-lg font-medium text-gray-900 text-center">
                        {currentReviewCard.front}
                      </p>

                      <Button onClick={() => setIsFlipped(true)} size="lg" className="mt-8">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Voir la réponse
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 min-h-[250px]"
                    >
                      {/* Answer */}
                      <div className="p-4 bg-primary-50 rounded-xl border border-primary-200 mb-4">
                        <p className="text-primary-800 whitespace-pre-wrap">
                          {currentReviewCard.back}
                        </p>
                      </div>

                      {/* Info note */}
                      {currentReviewCard.info_note && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-sm mb-4">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-yellow-800 mb-1">Votre note:</p>
                            <p className="text-yellow-700">{currentReviewCard.info_note}</p>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={handlePreviousReviewCard}
                          disabled={currentReviewIndex === 0}
                        >
                          Précédent
                        </Button>

                        <Link href={currentReviewCard.return_to_case_ref.route}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Retour au cas
                          </Button>
                        </Link>

                        <Button onClick={handleNextReviewCard}>
                          {currentReviewIndex === filteredFlashcards.length - 1
                            ? 'Terminer'
                            : 'Suivant'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Exit review */}
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => setViewMode('list')}>
                Quitter la révision
              </Button>
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}

// Flashcard list item component
interface FlashcardListItemProps {
  flashcard: CaseFlashcard;
  caseTitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  StepTypeBadge: React.ComponentType<{ type: StepType }>;
}

function FlashcardListItem({
  flashcard,
  caseTitle,
  isExpanded,
  onToggle,
  onDelete,
  StepTypeBadge,
}: FlashcardListItemProps) {
  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StepTypeBadge type={flashcard.step_type} />
              <span className="text-sm text-gray-500">{caseTitle}</span>
            </div>
            <CardTitle className="text-base font-medium text-gray-900">
              {flashcard.front}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={flashcard.return_to_case_ref.route}
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Retour au cas"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 border-t">
              {/* Back content */}
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-200 mb-4">
                <p className="text-sm text-primary-600 mb-1">Réponse:</p>
                <p className="text-primary-800 whitespace-pre-wrap">{flashcard.back}</p>
              </div>

              {/* Info note */}
              {flashcard.info_note && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 mb-1">Note personnelle:</p>
                    <p className="text-yellow-700">{flashcard.info_note}</p>
                  </div>
                </div>
              )}

              {/* Meta info */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Étape {flashcard.step_id}</span>
                <span>
                  Créée le{' '}
                  {new Date(flashcard.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
