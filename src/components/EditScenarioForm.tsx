'use client';

import { useRouter } from 'next/navigation';
import { useScenario } from '@/hooks/use-scenario';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { EXPENSE_CATEGORIES, DEFAULT_MONTHLY_OUTFLOWS } from '@/lib/constants';

interface EditScenarioFormProps {
  id: string;
}

export function EditScenarioForm({ id }: EditScenarioFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { scenario, loading, error } = useScenario(id);
  const [expenses, setExpenses] = useState<Record<string, number>>(() => {
    if (!scenario) return {};
    return scenario.customExpenses || 
      (scenario.lifestyle === 'custom' ? {} : DEFAULT_MONTHLY_OUTFLOWS[scenario.lifestyle]);
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scenario) {
      setExpenses(scenario.customExpenses || 
        (scenario.lifestyle === 'custom' ? {} : DEFAULT_MONTHLY_OUTFLOWS[scenario.lifestyle]));
    }
  }, [scenario]);

  const totalMonthly = Object.values(expenses).reduce((sum, value) => sum + value, 0);

  if (loading) {
    return (
      <div className="container max-w-5xl py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="container max-w-5xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Unable to load scenario'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user || scenario.userId !== user.uid) {
    return (
      <div className="container max-w-5xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            You don&apos;t have permission to edit this scenario.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const scenarioRef = doc(db, 'users', user.uid, 'scenarios', id);
      await updateDoc(scenarioRef, {
        customExpenses: expenses,
        lifestyle: 'custom', // Always set to custom when editing expenses
        updatedAt: new Date(),
      });
      
      toast({
        title: "Changes saved",
        description: "Your expense adjustments have been saved successfully.",
      });
      
      router.push(`/scenarios/${id}`);
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast({
        title: "Failed to save changes",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Edit Expenses for {scenario.name}</h1>
        <Alert>
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Note about editing scenarios</AlertTitle>
          <AlertDescription>
            You can only adjust expense amounts here. If you want to change your location, family status, 
            or other fundamental aspects, please create a new scenario. This helps maintain accurate 
            comparisons and tracking over time.
          </AlertDescription>
        </Alert>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {EXPENSE_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="capitalize">{category.name}</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ${expenses[category.name]?.toLocaleString() || '0'}/month
                </span>
              </div>
              <Slider
                min={category.min}
                max={category.max}
                step={50}
                value={[expenses[category.name] || category.default]}
                onValueChange={(value) => {
                  setExpenses(prev => ({
                    ...prev,
                    [category.name]: value[0]
                  }));
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${category.min.toLocaleString()}</span>
                <span>${category.max.toLocaleString()}</span>
              </div>
              {category.name === 'savings' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended savings: ${(totalMonthly * 0.2).toLocaleString()}/month (20% of total expenses)
                </p>
              )}
            </div>
          ))}

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Monthly Expenses</span>
              <span className="text-lg font-bold">${totalMonthly.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => router.push(`/scenarios/${id}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 