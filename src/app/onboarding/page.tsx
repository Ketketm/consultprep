'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboarding-store';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const router = useRouter();
  const { isComplete } = useOnboardingStore();

  useEffect(() => {
    // If onboarding is already complete, redirect to dashboard
    if (isComplete) {
      router.push('/');
    }
  }, [isComplete, router]);

  return <OnboardingWizard />;
}
