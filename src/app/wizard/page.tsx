'use client';

import { useAuth } from '@/context/auth-context';
import { useWizard, WizardProvider } from '@/context/wizard-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LifestyleStep } from './steps/lifestyle';
import { LocationStep } from '@/app/wizard/steps/location';
import { FamilyStep } from '@/app/wizard/steps/family';
import { SummaryStep } from '@/app/wizard/steps/summary';
import { cn } from '@/lib/utils';

export default function WizardPage() {
  const { user, loading } = useAuth();

  // Show loading state or redirect if not authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please sign in to continue.</p>
      </div>
    );
  }

  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}

function WizardContent() {
  const steps = [
    { value: '1', label: 'Lifestyle' },
    { value: '2', label: 'Location' },
    { value: '3', label: 'Family' },
    { value: '4', label: 'Summary' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create Your Financial Scenario</h1>
        <p className="text-muted-foreground">
          Let&apos;s figure out how much you&apos;ll need to earn for your desired lifestyle.
        </p>
      </div>

      <div className="space-y-8">
        <StepNavigation steps={steps} />
        <StepContent />
      </div>
    </div>
  );
}

function StepNavigation({ steps }: { steps: { value: string; label: string }[] }) {
  const { state } = useWizard();
  const progress = ((state.step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="space-y-4">
      <Tabs value={state.step.toString()} className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-card">
          {steps.map((step) => (
            <TabsTrigger
              key={step.value}
              value={step.value}
              disabled
              className={cn(
                "font-medium transition-colors",
                parseInt(step.value) === state.step && "text-foreground",
                parseInt(step.value) < state.step && "text-foreground",
                parseInt(step.value) > state.step && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    parseInt(step.value) === state.step && "border-accent-success bg-accent-success text-white",
                    parseInt(step.value) < state.step && "border-accent-info bg-accent-info text-white",
                    parseInt(step.value) > state.step && "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {step.value}
                </div>
                {step.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Progress value={progress} className="w-full" />
    </div>
  );
}

function StepContent() {
  const { state } = useWizard();

  switch (state.step) {
    case 1:
      return <LifestyleStep />;
    case 2:
      return <LocationStep />;
    case 3:
      return <FamilyStep />;
    case 4:
      return <SummaryStep />;
    default:
      return null;
  }
} 