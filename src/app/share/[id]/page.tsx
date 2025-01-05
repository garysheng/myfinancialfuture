'use client';

import { useRouter, useParams } from 'next/navigation';
import { useScenario } from '@/hooks/use-scenario';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScenarioContent } from '@/components/ScenarioContent';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { UserProfileBackend } from '@/types';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { scenario, loading: scenarioLoading, error } = useScenario(id);
  const [creatorProfile, setCreatorProfile] = useState<UserProfileBackend | null>(null);

  useEffect(() => {
    async function fetchCreatorProfile() {
      if (scenario?.userId) {
        try {
          const userRef = doc(db, 'users', scenario.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setCreatorProfile(userSnap.data() as UserProfileBackend);
          }
        } catch (error) {
          console.error('Failed to fetch creator profile:', error);
        }
      }
    }
    fetchCreatorProfile();
  }, [scenario?.userId]);

  if (scenarioLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading scenario...</p>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertDescription>
            {error || 'Unable to load scenario'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!scenario.isPublic) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertDescription>
            This scenario is private and cannot be viewed.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 space-y-4 pb-8 border-b">
        <h1 className="text-2xl font-bold italic" tabIndex={-1}>Welcome to MyFinancialFuture</h1>
        <p className="text-muted-foreground" tabIndex={-1}>
          {scenario.userName || 'Someone'} shared this financial scenario with you that shows the income needed for a specific lifestyle.
          Sign up to create your own scenarios and plan your financial future.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => router.push('/wizard')}>Create Your Scenario</Button>
          <Button variant="outline" onClick={() => router.push('/about')}>Learn More About MyFinancialFuture</Button>
        </div>
      </div>
      <ScenarioContent 
        id={id}
        isSharePage={true} 
        creatorProfile={creatorProfile} 
      />
    </div>
  );
} 