'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useScenario } from '@/hooks/use-scenario';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SankeyDiagram } from '@/components/SankeyDiagram';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Share2, Lock, Globe, ArrowLeft } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { ScenarioMenu } from '@/components/ScenarioMenu';
import { DetailedExpenseBreakdown } from '@/components/DetailedExpenseBreakdown';
import { UserProfileBackend } from '@/types';
import { calculateRequiredMonthlyIncome } from '@/lib/income-helper';

type ScenarioContentProps = {
  id: string;
  isSharePage?: boolean;
  creatorProfile?: UserProfileBackend | null;
}

export function ScenarioContent({ id, isSharePage = false, creatorProfile = null }: ScenarioContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { scenario: initialScenario, loading: scenarioLoading, error, deleteScenario } = useScenario(id);
  const { profile } = useProfile();
  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);
  const [scenario, setScenario] = useState(initialScenario);
  const modestLivingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScenario(initialScenario);
  }, [initialScenario]);

  useEffect(() => {
    if (!scenarioLoading && !error && modestLivingRef.current) {
      modestLivingRef.current.focus();
    }
  }, [scenarioLoading, error]);

  // Redirect unauthenticated users to share page for public scenarios
  useEffect(() => {
    if (!authLoading && !user && !isSharePage && scenario?.isPublic) {
      router.replace(`/share/${id}`);
    }
  }, [authLoading, user, isSharePage, scenario?.isPublic, id, router]);

  // Show loading state or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user && !isSharePage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please sign in to continue.</p>
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => router.push('/scenarios')}>
            Back to Scenarios
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${scenario.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share link copied!",
        description: "You can now share this scenario with others.",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const togglePublic = async () => {
    if (!user || !scenario) return;
    
    setIsTogglingPrivacy(true);
    try {
      const scenarioRef = doc(db, 'users', user.uid, 'scenarios', id);
      const newIsPublic = !scenario.isPublic;
      
      // Update local state immediately
      setScenario({
        ...scenario,
        isPublic: newIsPublic,
        updatedAt: new Date()
      });
      
      await updateDoc(scenarioRef, {
        isPublic: newIsPublic,
        updatedAt: new Date(),
      });
      
      toast({
        title: !newIsPublic ? "Scenario is now private" : "Scenario is now public",
        description: !newIsPublic 
          ? "Others can no longer view this scenario." 
          : "Others can now view this scenario with the share link.",
      });
      
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
      // Revert local state on error
      setScenario({
        ...scenario,
        isPublic: scenario.isPublic
      });
      
      toast({
        title: "Failed to update sharing settings",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingPrivacy(false);
    }
  };

  // Calculate income and expenses using the helper
  const incomeDetails = scenario ? calculateRequiredMonthlyIncome(scenario) : null;

  // Calculate income gap and related metrics
  const relevantProfile = isSharePage ? creatorProfile : profile;
  const incomeGap = relevantProfile && incomeDetails 
    ? incomeDetails.yearlyIncome - relevantProfile.currentIncome 
    : incomeDetails?.yearlyIncome || 0;
  const hasIncomeGap = relevantProfile && relevantProfile.currentIncome > 0;
  const meetsIncome = hasIncomeGap && incomeGap <= 0;
  const percentageIncrease = relevantProfile?.currentIncome ? ((incomeGap / relevantProfile.currentIncome) * 100) : 100;
  const isHighIncrease = percentageIncrease > 200;

  const handleDelete = async () => {
    const success = await deleteScenario();
    if (success) {
      router.push('/scenarios');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {!isSharePage && (
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => router.push('/scenarios')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scenarios
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={togglePublic}
              className={scenario.isPublic ? "text-green-600" : ""}
              disabled={isTogglingPrivacy}
            >
              {isTogglingPrivacy ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : scenario.isPublic ? (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Private
                </>
              )}
            </Button>
            {scenario.isPublic && (
              <Button 
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            )}
            <ScenarioMenu 
              scenario={scenario}
              currentIncome={relevantProfile?.currentIncome}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{scenario.name}</h1>
          <p className="text-muted-foreground">
            Created on {scenario.createdAt.toLocaleDateString()}
          </p>
        </div>

        {/* Scenario Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Scenario Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Family</h3>
                <p className="text-lg">
                  {scenario.family.relationship === 'partnered' ? (
                    <>
                      Partnered {scenario.family.partnerIncome > 0 
                        ? `(Partner Income: $${(scenario.family.partnerIncome / 12).toLocaleString()}/month)`
                        : '(You are the only income earner)'}
                    </>
                  ) : (
                    'Single'
                  )}
                  {scenario.family.numChildren > 0 && 
                    ` with ${scenario.family.numChildren} ${scenario.family.numChildren === 1 ? 'child' : 'children'}`}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Lifestyle</h3>
                <p className="text-lg capitalize">{scenario.lifestyle}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Location</h3>
                <p className="text-lg">{scenario.location.city}, {scenario.location.state}</p>
                <p className="text-sm text-muted-foreground">
                  Cost of Living: {((scenario.location.costMultiplier - 1) * 100).toFixed(0)}% more than US average
                </p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Created By</h3>
                <p className="text-lg">{scenario.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {scenario.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Income Requirements - only show if no current income is specified */}
        {!relevantProfile?.currentIncome && (
          <Card 
            ref={modestLivingRef}
            className="p-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-500/5 border-green-200/50"
            tabIndex={0}
            role="region"
            aria-label="Income Requirements"
          >
            <h2 className="text-lg font-semibold mb-4 text-green-500">Income Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Required Monthly</p>
                <p className="text-3xl font-bold text-green-500">
                  ${incomeDetails?.monthlyIncome.toLocaleString() || scenario?.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Required Yearly</p>
                <p className="text-3xl font-bold text-green-500">
                  ${incomeDetails?.yearlyIncome.toLocaleString() || scenario?.yearlyIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Income Analysis */}
        {(hasIncomeGap || isSharePage) && (
          <Card className={cn(
            "p-6",
            meetsIncome ? "bg-green-500/10 border-green-200" : 
            isHighIncrease ? "bg-red-500/20 border-red-400 animate-pulse" : 
            "bg-yellow-500/10 border-yellow-200"
          )}>
            <h2 className="text-lg font-semibold mb-4">Income Analysis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {!isSharePage ? "Your" : `${creatorProfile?.displayName || scenario?.userName}'s`} Current Income
                  </p>
                  <p className="text-2xl font-bold">
                    ${(relevantProfile?.currentIncome || 0).toLocaleString()}/year
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {meetsIncome ? (!isSharePage ? "You're" : `${creatorProfile?.displayName || scenario?.userName}'s`) + " Exceeding Target" : "Required Income"}
                  </p>
                  <p className="text-2xl font-bold">
                    ${incomeDetails?.yearlyIncome.toLocaleString() || scenario?.yearlyIncome.toLocaleString()}/year
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {meetsIncome
                  ? `${!isSharePage ? "Your" : `${creatorProfile?.displayName || scenario?.userName}'s`} current income exceeds what's needed for this lifestyle! Consider saving or investing the surplus.`
                  : isHighIncrease
                    ? `⚠️ This lifestyle requires more than tripling ${!isSharePage ? "your" : `${creatorProfile?.displayName || scenario?.userName}'s`} income. ${!isSharePage ? "You need" : `${creatorProfile?.displayName || scenario?.userName} needs`} to intensely lock in if ${!isSharePage ? "you want" : "they want"} to live this lifestyle one day.`
                    : relevantProfile?.currentIncome 
                      ? `To achieve this lifestyle, ${!isSharePage ? "you'll" : `${creatorProfile?.displayName || scenario?.userName} will`} need to increase ${!isSharePage ? "your" : "their"} income by ${percentageIncrease.toFixed(1)}%.`
                      : `This lifestyle requires an annual income of $${incomeDetails?.yearlyIncome.toLocaleString() || scenario?.yearlyIncome.toLocaleString()}.`
                }
              </p>
            </div>
          </Card>
        )}

        {/* Sankey Diagram */}
        <SankeyDiagram scenario={scenario} />

        {/* Monthly Expenses */}
        <DetailedExpenseBreakdown 
          scenario={scenario} 
          monthlyIncome={incomeDetails?.monthlyIncome || scenario.monthlyIncome}
        />
      </div>
    </div>
  );
} 