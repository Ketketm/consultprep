'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  BookOpen,
  Clock,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useCaseStore } from '@/lib/store/case-store';
import { useLanguageStore } from '@/lib/store/language-store';
import { parseJsonFile } from '@/lib/schemas/case-schema';
import { getAllDemoCases, getDemoCaseByLanguage, type CaseSubcategory, type DemoCase } from '@/lib/data/demo-cases';
import type { CaseJson } from '@/lib/types/case-types';
import Link from 'next/link';

// Subcategory configuration
const SUBCATEGORY_CONFIG: Record<CaseSubcategory, {
  labelEn: string;
  labelFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}> = {
  profit: {
    labelEn: 'Profitability Cases',
    labelFr: 'Cas de Profitabilité',
    descriptionEn: 'Classic consulting cases focused on revenue growth and cost optimization',
    descriptionFr: 'Cas consulting classiques sur la croissance du CA et l\'optimisation des coûts',
    icon: '💰',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
  },
  brainteaser: {
    labelEn: 'Brainteasers',
    labelFr: 'Casse-têtes',
    descriptionEn: 'Quantitative puzzles that test your mental math and logic',
    descriptionFr: 'Problèmes quantitatifs qui testent votre calcul mental et logique',
    icon: '🧩',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
  out_of_the_box: {
    labelEn: 'Out of the Box',
    labelFr: 'Hors des Sentiers Battus',
    descriptionEn: 'Creative cases that require unconventional thinking and innovative approaches',
    descriptionFr: 'Cas créatifs qui demandent une pensée non conventionnelle',
    icon: '💡',
    bgColor: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
  },
};

export default function ImportCasePage() {
  const router = useRouter();
  const { importCase, importedCases, deleteImportedCase, loadCase } = useCaseStore();
  const { language } = useLanguageStore();

  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewCase, setPreviewCase] = useState<CaseJson | null>(null);

  const demoCases = getAllDemoCases();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setUploadStatus('idle');
    setErrorMessage('');
    setPreviewCase(null);

    if (!file.name.endsWith('.json')) {
      setUploadStatus('error');
      setErrorMessage(
        language === 'fr'
          ? 'Le fichier doit être un fichier JSON (.json)'
          : 'File must be a JSON file (.json)'
      );
      return;
    }

    try {
      const content = await file.text();
      const parseResult = parseJsonFile(content);

      if (!parseResult.success) {
        setUploadStatus('error');
        setErrorMessage(parseResult.error || (language === 'fr' ? 'Erreur de parsing JSON' : 'JSON parsing error'));
        return;
      }

      const importResult = importCase(parseResult.data);

      if (!importResult.success) {
        setUploadStatus('error');
        setErrorMessage(importResult.error || (language === 'fr' ? 'Erreur de validation' : 'Validation error'));
        return;
      }

      // Get the imported case for preview
      const cases = useCaseStore.getState().importedCases;
      const importedCase = cases.find((c) => c.meta.case_id === importResult.caseId);

      if (importedCase) {
        setPreviewCase(importedCase);
        setUploadStatus('success');
      }
    } catch (e) {
      setUploadStatus('error');
      setErrorMessage(e instanceof Error ? e.message : (language === 'fr' ? 'Erreur inconnue' : 'Unknown error'));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [language]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleStartCase = () => {
    if (previewCase) {
      loadCase(previewCase);
      router.push(`/case?id=${previewCase.meta.case_id}`);
    }
  };

  const handleLoadExistingCase = (caseData: CaseJson) => {
    loadCase(caseData);
    router.push(`/case?id=${caseData.meta.case_id}`);
  };

  const handleLoadDemoCase = (caseId: string) => {
    const demoCase = getDemoCaseByLanguage(caseId, language);
    if (demoCase) {
      // Import the case first
      importCase(demoCase);
      // Then load it
      loadCase(demoCase);
      router.push(`/case?id=${demoCase.meta.case_id}`);
    }
  };

  const getDifficultyLabel = (difficulty: number | string) => {
    if (typeof difficulty === 'string') {
      const labels: Record<string, { fr: string; en: string }> = {
        Beginner: { fr: 'Débutant', en: 'Beginner' },
        Intermediate: { fr: 'Intermédiaire', en: 'Intermediate' },
        Advanced: { fr: 'Avancé', en: 'Advanced' },
      };
      return labels[difficulty]?.[language] || difficulty;
    }
    switch (difficulty) {
      case 1:
        return language === 'fr' ? 'Facile' : 'Easy';
      case 2:
        return language === 'fr' ? 'Moyen' : 'Medium';
      case 3:
        return language === 'fr' ? 'Difficile' : 'Hard';
      default:
        return language === 'fr' ? 'Inconnu' : 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty: number | string) => {
    if (typeof difficulty === 'string') {
      switch (difficulty) {
        case 'Beginner':
          return 'bg-green-100 text-green-700';
        case 'Intermediate':
          return 'bg-yellow-100 text-yellow-700';
        case 'Advanced':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
    switch (difficulty) {
      case 1:
        return 'bg-green-100 text-green-700';
      case 2:
        return 'bg-yellow-100 text-yellow-700';
      case 3:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstimatedTime = (caseData: CaseJson): number => {
    return caseData.meta.estimated_minutes || caseData.meta.estimated_time_min || 0;
  };

  const getCompanyInfo = (caseData: CaseJson): string => {
    return caseData.meta.company || caseData.meta.firm_style || '';
  };

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
              <h1 className="font-bold text-xl text-gray-900">
                {language === 'fr' ? 'Importer un Cas' : 'Import a Case'}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Cases Section - Grouped by Subcategory */}
        {demoCases.length > 0 && (
          <div className="mb-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'fr' ? 'Cas de démonstration' : 'Demo Cases'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                {demoCases.length}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {language === 'fr'
                ? 'Commencez avec ces cas pré-chargés pour vous entraîner.'
                : 'Start with these pre-loaded cases to practice.'}
            </p>

            {/* Subcategory Blocks */}
            {(['profit', 'brainteaser', 'out_of_the_box'] as CaseSubcategory[]).map((subcategory) => {
              const config = SUBCATEGORY_CONFIG[subcategory];
              const casesInCategory = demoCases.filter((c) => c.subcategory === subcategory);

              if (casesInCategory.length === 0) return null;

              return (
                <Card key={subcategory} className={`overflow-hidden border-2 ${config.borderColor}`}>
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${config.bgColor} px-6 py-4 border-b ${config.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center text-xl`}>
                          {config.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {language === 'fr' ? config.labelFr : config.labelEn}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {language === 'fr' ? config.descriptionFr : config.descriptionEn}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/80 text-gray-700 text-sm font-medium shadow-sm">
                          {casesInCategory.length} {casesInCategory.length === 1 ? 'case' : 'cases'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cases List */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {casesInCategory.map((demo) => (
                        <div
                          key={demo.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {language === 'fr' ? demo.titleFr : demo.titleEn}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {language === 'fr' ? demo.descriptionFr : demo.descriptionEn}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(demo.difficulty)}`}>
                                {getDifficultyLabel(demo.difficulty)}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {demo.estimatedMinutes} min
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Building2 className="w-3 h-3" />
                                {demo.caseEn.meta.firm_style}
                              </span>
                            </div>
                          </div>
                          <Button onClick={() => handleLoadDemoCase(demo.id)} className="ml-4">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Démarrer' : 'Start'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Upload Zone */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {language === 'fr' ? 'Importer un fichier JSON' : 'Import a JSON file'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-colors
                ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
                ${uploadStatus === 'error' ? 'border-red-300 bg-red-50' : ''}
                ${uploadStatus === 'success' ? 'border-green-300 bg-green-50' : ''}
              `}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {uploadStatus === 'idle' && (
                <div>
                  <FileJson className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    {language === 'fr'
                      ? 'Glissez-déposez un fichier JSON ici'
                      : 'Drag and drop a JSON file here'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'fr' ? 'ou cliquez pour sélectionner' : 'or click to select'}
                  </p>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div>
                  <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                  <p className="text-red-600 font-medium mb-2">
                    {language === 'fr' ? "Erreur d'import" : 'Import error'}
                  </p>
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )}

              {uploadStatus === 'success' && previewCase && (
                <div>
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-green-600 font-medium mb-2">
                    {language === 'fr' ? 'Cas importé avec succès !' : 'Case imported successfully!'}
                  </p>
                  <p className="text-sm text-gray-600">{previewCase.meta.title}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {previewCase && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8 border-primary-200">
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Aperçu du cas' : 'Case Preview'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{previewCase.meta.title}</h3>
                    <p className="text-gray-500">{getCompanyInfo(previewCase)}</p>
                    {previewCase.meta.industry && (
                      <p className="text-sm text-gray-400">{previewCase.meta.industry}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                        previewCase.meta.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(previewCase.meta.difficulty)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {getEstimatedTime(previewCase)} min
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                      {previewCase.steps.length} {language === 'fr' ? 'étapes' : 'steps'}
                    </span>
                  </div>

                  {previewCase.meta.tags && previewCase.meta.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {previewCase.meta.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button onClick={handleStartCase} className="w-full" size="lg">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Démarrer ce cas' : 'Start this case'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Existing Cases */}
        {importedCases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? `Cas importés (${importedCases.length})` : `Imported Cases (${importedCases.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {importedCases.map((caseData) => (
                <div
                  key={caseData.meta.case_id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{caseData.meta.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{getCompanyInfo(caseData)}</span>
                      <span>•</span>
                      <span>
                        {caseData.steps.length} {language === 'fr' ? 'étapes' : 'steps'}
                      </span>
                      <span>•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(caseData.meta.difficulty)}`}
                      >
                        {getDifficultyLabel(caseData.meta.difficulty)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadExistingCase(caseData)}>
                      {language === 'fr' ? 'Ouvrir' : 'Open'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteImportedCase(caseData.meta.case_id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
