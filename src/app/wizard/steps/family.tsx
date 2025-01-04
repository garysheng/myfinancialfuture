'use client';

import { useWizard } from '@/context/wizard-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FamilyStatus } from '@/types';
import { FamilyExpensesInfo } from '@/components/FamilyExpensesInfo';

export function FamilyStep() {
  const { state, dispatch, nextStep, prevStep } = useWizard();

  const handleFamilyChange = (field: keyof FamilyStatus, value: string | number) => {
    const updated = { ...state.family };

    if (field === 'relationship') {
      updated.relationship = value as 'single' | 'partnered';
      // Reset partner income if switching to single
      if (value === 'single') {
        updated.partnerIncome = 0;
      }
    } else if (field === 'numChildren') {
      updated.numChildren = Math.max(0, Number(value));
    } else if (field === 'partnerIncome') {
      // Remove commas and convert to number
      const numericValue = Number(String(value).replace(/,/g, ''));
      updated.partnerIncome = Math.max(0, numericValue);
    }

    dispatch({ type: 'SET_FAMILY', payload: updated });
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Handle partner income input change
  const handlePartnerIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters except commas
    const value = e.target.value.replace(/[^\d,]/g, '');
    // Remove existing commas
    const numericValue = value.replace(/,/g, '');
    
    if (numericValue === '') {
      handleFamilyChange('partnerIncome', 0);
    } else {
      handleFamilyChange('partnerIncome', numericValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Family Situation</h2>
        <p className="text-muted-foreground">
          Tell us about your family plans to help calculate appropriate expenses.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <FamilyExpensesInfo 
            lifestyle={state.lifestyle}
            location={state.location}
          />

          <div className="space-y-4">
            <Label>Relationship Status</Label>
            <RadioGroup
              value={state.family.relationship}
              onValueChange={(value) =>
                handleFamilyChange('relationship', value)
              }
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="single"
                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  state.family.relationship === 'single'
                    ? 'border-primary shadow-sm'
                    : 'hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="single" id="single" className="sr-only" />
                <span className="text-xl mb-2">👤</span>
                <span className="font-semibold">Single</span>
              </Label>
              <Label
                htmlFor="partnered"
                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  state.family.relationship === 'partnered'
                    ? 'border-primary shadow-sm'
                    : 'hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="partnered" id="partnered" className="sr-only" />
                <span className="text-xl mb-2">👥</span>
                <span className="font-semibold">Partnered</span>
              </Label>
            </RadioGroup>
          </div>

          {state.family.relationship === 'partnered' && (
            <div className="space-y-2">
              <Label htmlFor="partnerIncome">What&apos;s your partner&apos;s annual income?</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="partnerIncome"
                  value={formatNumber(state.family.partnerIncome)}
                  onChange={handlePartnerIncomeChange}
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your partner&apos;s expected annual income before taxes
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="numChildren">Number of Children (Current or Planned)</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFamilyChange(
                    'numChildren',
                    Math.max(0, state.family.numChildren - 1)
                  )
                }
                disabled={state.family.numChildren === 0}
              >
                -
              </Button>
              <span className="text-xl font-semibold min-w-[2ch] text-center">
                {state.family.numChildren}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFamilyChange('numChildren', state.family.numChildren + 1)
                }
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This helps us calculate child-related expenses like education and care
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Continue</Button>
      </div>
    </div>
  );
} 