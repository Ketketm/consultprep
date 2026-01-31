'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCaseStore } from '@/lib/store/case-store';
import { useLanguageStore } from '@/lib/store/language-store';
import { getDemoCaseByLanguage } from '@/lib/data/demo-cases';
import { CasePlayer } from '@/components/case/CasePlayer';

function CasePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get('id');
  const stepParam = searchParams.get('step');
  const demoCaseIdParam = searchParams.get('demo');

  const { language } = useLanguageStore();
  const { currentCase, currentDemoCaseId, loadCase, getCaseById, goToStep, importCase } = useCaseStore();
  const prevLanguageRef = useRef(language);

  // Handle language changes for demo cases
  useEffect(() => {
    const demoCaseId = demoCaseIdParam || currentDemoCaseId;

    // If language changed and we have a demo case, reload it in the new language
    if (prevLanguageRef.current !== language && demoCaseId) {
      const newCaseData = getDemoCaseByLanguage(demoCaseId, language);
      if (newCaseData) {
        importCase(newCaseData);
        loadCase(newCaseData, demoCaseId);
        // Update URL with new case ID
        const newUrl = `/case?id=${newCaseData.meta.case_id}&demo=${demoCaseId}`;
        router.replace(newUrl);
      }
    }
    prevLanguageRef.current = language;
  }, [language, demoCaseIdParam, currentDemoCaseId, loadCase, importCase, router]);

  // Initial case load
  useEffect(() => {
    if (caseId) {
      // If no current case or different case, load it
      if (!currentCase || currentCase.meta.case_id !== caseId) {
        // Try to load from demo cases first if we have a demo param
        const demoCaseId = demoCaseIdParam || currentDemoCaseId;
        if (demoCaseId) {
          const demoCase = getDemoCaseByLanguage(demoCaseId, language);
          if (demoCase) {
            importCase(demoCase);
            loadCase(demoCase, demoCaseId);
            return;
          }
        }

        // Otherwise try imported cases
        const caseData = getCaseById(caseId);
        if (caseData) {
          loadCase(caseData);
        } else {
          // Case not found, redirect to import
          router.push('/case/import');
          return;
        }
      }

      // Navigate to specific step if provided
      if (stepParam) {
        const stepIndex = parseInt(stepParam, 10) - 1;
        if (!isNaN(stepIndex) && stepIndex >= 0) {
          goToStep(stepIndex);
        }
      }
    } else if (!currentCase) {
      // No case ID and no current case, redirect to import
      router.push('/case/import');
    }
  }, [caseId, stepParam, demoCaseIdParam, currentCase, currentDemoCaseId, language, loadCase, getCaseById, goToStep, router, importCase]);

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading case...</p>
        </div>
      </div>
    );
  }

  return <CasePlayer />;
}

function CaseLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function CasePage() {
  return (
    <Suspense fallback={<CaseLoading />}>
      <CasePageContent />
    </Suspense>
  );
}
