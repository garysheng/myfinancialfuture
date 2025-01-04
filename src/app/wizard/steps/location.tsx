'use client';

import React, { useState } from 'react';
import { useWizard } from '@/context/wizard-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CITY_PRESETS } from '@/lib/constants';
import type { Location } from '@/types';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  Building2, 
  Map,
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Globe2
} from 'lucide-react';

// All US states in alphabetical order
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC' // Including DC
];

export function LocationStep() {
  const { state, dispatch, nextStep, prevStep } = useWizard();
  const [showCustom, setShowCustom] = useState(state.location.isCustom);
  const [customLocation, setCustomLocation] = useState<Partial<Location>>({
    city: state.location.isCustom ? state.location.city : '',
    state: state.location.isCustom ? state.location.state : '',
    country: 'United States', // Always US
    costMultiplier: state.location.isCustom ? state.location.costMultiplier : 1.0,
  });

  const handlePresetSelect = (preset: typeof CITY_PRESETS[0]) => {
    dispatch({
      type: 'SET_LOCATION',
      payload: {
        city: preset.name,
        state: preset.state,
        country: 'United States',
        costMultiplier: preset.costMultiplier,
        isCustom: false,
      },
    });
    setShowCustom(false);
  };

  const handleCustomToggle = () => {
    setShowCustom(true);
    dispatch({
      type: 'SET_LOCATION',
      payload: {
        city: customLocation.city || '',
        state: customLocation.state || '',
        country: 'United States',
        costMultiplier: customLocation.costMultiplier || 1.0,
        isCustom: true,
      },
    });
  };

  const handleCustomChange = (field: keyof Location, value: string | number) => {
    const updated = { ...customLocation, [field]: value };
    setCustomLocation(updated);
    if (showCustom) {
      dispatch({
        type: 'SET_LOCATION',
        payload: {
          ...updated,
          isCustom: true,
          city: updated.city || '',
          state: updated.state || '',
          country: 'United States',
          costMultiplier: updated.costMultiplier || 1.0,
        },
      });
    }
  };

  const isCustomValid = customLocation.city && customLocation.state;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Choose Your Location</h2>
        </div>
        <p className="text-muted-foreground">
          Select where you plan to live. This helps us adjust costs based on local prices.
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground italic">
          <Globe2 className="h-4 w-4" />
          <p>Currently supporting US locations only. International support coming in a future version.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CITY_PRESETS.map((city) => (
          <Card
            key={city.id}
            className={cn(
              "relative p-6 cursor-pointer transition-all border-2 hover:border-primary",
              state.location.city === city.name && "border-primary"
            )}
            onClick={() => handlePresetSelect(city)}
          >
            <div className="flex items-center gap-2">
              {React.createElement(city.icon, { className: "h-5 w-5" })}
              <h3 className="text-lg font-semibold">{city.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <DollarSign className="h-4 w-4" />
              <p>Cost of Living: {((city.costMultiplier - 1) * 100).toFixed(0)}% more than US average</p>
            </div>
          </Card>
        ))}

        <Card
          className={cn(
            "relative p-6 cursor-pointer transition-all hover:border-primary",
            showCustom && "border-2 border-primary"
          )}
          onClick={handleCustomToggle}
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Custom Location</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Map className="h-4 w-4" />
            <p>Define your own US location and cost of living adjustment</p>
          </div>
        </Card>
      </div>

      {showCustom && (
        <Card className="p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                City
              </Label>
              <Input
                id="city"
                value={customLocation.city || ''}
                onChange={(e) => handleCustomChange('city', e.target.value)}
                placeholder="Enter city name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                State
              </Label>
              <Select
                value={customLocation.state || ''}
                onValueChange={(value) => handleCustomChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="costMultiplier" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost of Living Multiplier (1.0 = US average)
              </Label>
              <Input
                id="costMultiplier"
                type="number"
                step="0.1"
                min="0.1"
                value={customLocation.costMultiplier || ''}
                onChange={(e) =>
                  handleCustomChange('costMultiplier', parseFloat(e.target.value))
                }
                placeholder="1.0"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={showCustom && !isCustomValid}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 