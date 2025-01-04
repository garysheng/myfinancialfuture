'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useWizard } from '@/context/wizard-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DetailedExpenseBreakdown } from '@/components/DetailedExpenseBreakdown';
import type { ScenarioBackend, OutflowCategory } from '@/types';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { calculateTaxes, formatTaxRate } from '@/lib/tax-helper';
import { calculateRequiredMonthlyIncome } from '@/lib/income-helper';

export function SummaryStep() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, prevStep } = useWizard();
  const [scenarioName, setScenarioName] = useState(() => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Build location part
    const locationPart = state.location.isCustom 
      ? `${state.location.city}, ${state.location.state}`
      : state.location.city;
    
    // Build family part
    let familyPart = '';
    if (state.family.relationship === 'partnered') {
      familyPart = state.family.numChildren > 0 
        ? ` - Family of ${2 + state.family.numChildren}`
        : ' - Couple';
    } else if (state.family.numChildren > 0) {
      familyPart = ` - Single Parent (${state.family.numChildren} ${state.family.numChildren === 1 ? 'child' : 'children'})`;
    }
    
    return `${locationPart}${familyPart} (${dateStr})`;
  });
  const [saving, setSaving] = useState(false);

  // Calculate all income and expense details using the helper
  const {
    monthlyIncome: requiredMonthlyIncome,
    yearlyIncome: requiredAnnualIncome,
    childrenExpenses,
    adjustedMonthlyOutflows,
  } = calculateRequiredMonthlyIncome({
    ...state,
    id: '',
    name: scenarioName,
    createdAt: new Date(),
    updatedAt: new Date(),
    outflows: [],
    monthlyIncome: 0,
    yearlyIncome: 0,
    userId: user?.uid || '',
    userName: user?.displayName || 'Anonymous',
    isPublic: false,
    customExpenses: undefined,
  });

  const combinedAnnualIncome = Math.round(requiredAnnualIncome + (state.family.partnerIncome || 0));
  const combinedMonthlyIncome = Math.round(combinedAnnualIncome / 12);

  // Calculate detailed tax breakdown
  const taxBreakdown = calculateTaxes({
    annualIncome: requiredAnnualIncome,
    state: state.location.state,
    isMarried: state.family.relationship === 'partnered',
    partnerIncome: state.family.partnerIncome || 0
  });

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const outflows = Object.entries(adjustedMonthlyOutflows)
        .filter(([category]) => category in adjustedMonthlyOutflows)
        .map(([category, amount]) => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          amount: Number(amount),
          category: category as OutflowCategory,
          isRequired: true,
          description: '',
        }));

      // Add child costs to outflows if there are children
      const allOutflows = [...outflows];
      if (childrenExpenses > 0) {
        allOutflows.push({
          id: 'children',
          name: 'Child Costs',
          category: 'children',
          amount: childrenExpenses,
          isRequired: true,
          description: `Monthly costs for ${state.family.numChildren} ${state.family.numChildren === 1 ? 'child' : 'children'}`,
        });
      }

      const scenario: ScenarioBackend = {
        id: uuidv4(),
        name: scenarioName,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        lifestyle: state.lifestyle,
        location: state.location,
        family: state.family,
        outflows: allOutflows,
        monthlyIncome: requiredMonthlyIncome,
        yearlyIncome: requiredAnnualIncome,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        isPublic: false,
      };

      const docRef = doc(db, 'users', user.uid, 'scenarios', scenario.id);
      await setDoc(docRef, scenario);

      // Navigate to the scenario detail page
      router.push(`/scenarios/${scenario.id}`);
    } catch (error) {
      console.error('Error saving scenario:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Summary & Results</h2>
        <p className="text-muted-foreground">
          Review your scenario and see how much you&apos;ll need to earn.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scenarioName">Scenario Name</Label>
            <Input
              id="scenarioName"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="My Financial Scenario"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Required Monthly Income</h3>
              <div className="text-3xl font-bold text-primary">
                ${requiredMonthlyIncome.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Before taxes, to maintain your desired lifestyle
              </p>
              <p className="text-sm text-muted-foreground">
                This means you need to earn <span className="font-medium">${requiredAnnualIncome.toLocaleString()}</span> per year 
                before taxes to cover your expenses and maintain this lifestyle. Your effective tax rate would be {formatTaxRate(taxBreakdown.effectiveTaxRate)}.
              </p>

              {state.family.relationship === 'partnered' && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-1">Combined Household Income</h3>
                  <div className="text-2xl font-semibold">
                    ${combinedMonthlyIncome.toLocaleString()}/month
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Including partner&apos;s income of ${(state.family.partnerIncome / 12).toLocaleString()}/month
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h3 className="font-semibold mb-1">How Family Affects Your Expenses</h3>
                {state.family.relationship === 'partnered' && (
                  <p className="text-sm text-muted-foreground">
                    Having a partner increases certain expenses: food costs increase by 80%, transportation by 50%, 
                    healthcare and personal expenses double, entertainment increases by 70%, and utilities increase by 20%. 
                    Housing costs remain largely the same as they would be split.
                  </p>
                )}
                {state.family.numChildren > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Each child adds ${Math.round(childrenExpenses / state.family.numChildren).toLocaleString()}/month in expenses 
                    (adjusted for your location). This covers food, clothing, healthcare, activities, education savings, and childcare 
                    at a {state.lifestyle} lifestyle level.
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <DetailedExpenseBreakdown 
            scenario={{
              id: '',
              name: scenarioName,
              lifestyle: state.lifestyle,
              location: state.location,
              family: state.family,
              outflows: Object.entries(adjustedMonthlyOutflows)
                .map(([category, amount]) => ({
                  id: category,
                  name: category.charAt(0).toUpperCase() + category.slice(1),
                  amount: Number(amount),
                  category: category as OutflowCategory,
                  isRequired: true,
                  description: '',
                })),
              monthlyIncome: requiredMonthlyIncome,
              yearlyIncome: requiredAnnualIncome,
              userId: user?.uid || '',
              userName: user?.displayName || 'Anonymous',
              isPublic: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            monthlyIncome={requiredMonthlyIncome}
          />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Scenario'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 