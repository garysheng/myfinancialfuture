'use client';

import { useWizard } from '@/context/wizard-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { Lifestyle, OutflowCategory } from '@/types';
import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import { categoryIcons } from '@/lib/icons';
import { 
  Home,
  Building,
  Castle,
  Settings2,
  ChevronRight,
  DollarSign,
  BarChart3,
  Sparkles,
  PiggyBank,
  TrendingUp
} from 'lucide-react';

function CustomLifestyleDefiner() {
  const { state, dispatch } = useWizard();
  const [expenses, setExpenses] = useState<Record<string, number>>(() => {
    // Initialize with all categories from expenseCategories
    const defaultExpenses = Object.fromEntries(
      EXPENSE_CATEGORIES.map(cat => [cat.name, state.customExpenses?.[cat.name] ?? cat.default])
    );
    
    return state.customExpenses || defaultExpenses;
  });

  const totalMonthly = Object.values(expenses).reduce((sum, value) => sum + value, 0);

  // Update wizard context when expenses change, but only if they're different
  useEffect(() => {
    const currentExpensesStr = JSON.stringify(expenses);
    const stateExpensesStr = JSON.stringify(state.customExpenses);
    
    if (currentExpensesStr !== stateExpensesStr) {
      dispatch({ 
        type: 'SET_CUSTOM_EXPENSES', 
        payload: expenses 
      });
    }
  }, [expenses, dispatch, state.customExpenses]);

  // Only update from state when lifestyle changes to custom
  useEffect(() => {
    if (state.lifestyle === 'custom' && state.customExpenses) {
      const stateExpensesStr = JSON.stringify(state.customExpenses);
      const currentExpensesStr = JSON.stringify(expenses);
      
      if (stateExpensesStr !== currentExpensesStr) {
        setExpenses(state.customExpenses);
      }
    }
  }, [state.lifestyle, state.customExpenses, expenses]);

  return (
    <div className="space-y-6 mt-4">
      {EXPENSE_CATEGORIES.map((category) => {
        const Icon = categoryIcons[category.name as OutflowCategory];
        return (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <Label className="capitalize">{category.name}</Label>
                </div>
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <PiggyBank className="h-3 w-3" />
                <p>Recommended savings: ${(totalMonthly * 0.2).toLocaleString()}/month (20% of total expenses)</p>
              </div>
            )}
            {category.name === 'investments' && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <p>For long-term wealth building</p>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="font-semibold">Total Monthly Expenses</span>
          </div>
          <span className="text-lg font-bold">${totalMonthly.toLocaleString()}</span>
        </div>
        <div className="mt-4 space-y-2">
          {EXPENSE_CATEGORIES.map(category => {
            const Icon = categoryIcons[category.name as OutflowCategory];
            const amount = expenses[category.name] || 0;
            const percentage = ((amount / totalMonthly) * 100).toFixed(1);
            return (
              <div key={`${category.name}-percent`} className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span className="capitalize">{category.name}</span>
                </div>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const lifestyleOptions: { 
  value: Lifestyle; 
  label: string; 
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: 'modest',
    label: 'Modest Living',
    description: 'Comfortable but economical lifestyle with focus on essentials',
    icon: Home,
  },
  {
    value: 'comfortable',
    label: 'Comfortable Living',
    description: 'Balance between comfort and luxury with room for regular indulgences',
    icon: Building,
  },
  {
    value: 'luxury',
    label: 'Luxury Living',
    description: 'Premium lifestyle with high-end amenities and experiences',
    icon: Castle,
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Define your own unique lifestyle preferences',
    icon: Settings2,
  },
];

export function LifestyleStep() {
  const { state, dispatch, nextStep } = useWizard();

  const handleLifestyleChange = (value: Lifestyle) => {
    dispatch({ type: 'SET_LIFESTYLE', payload: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentValue: Lifestyle) => {
    const currentIndex = lifestyleOptions.findIndex(option => option.value === currentValue);
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLifestyleChange(currentValue);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % lifestyleOptions.length;
      const nextOption = lifestyleOptions[nextIndex];
      handleLifestyleChange(nextOption.value);
      const nextElement = document.querySelector(`[data-value="${nextOption.value}"]`) as HTMLElement;
      nextElement?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Choose Your Lifestyle</h2>
        </div>
        <p className="text-muted-foreground">
          Select the lifestyle that best matches your aspirations. This will help us
          calculate appropriate costs for various expenses.
        </p>
      </div>

      <RadioGroup
        value={state.lifestyle}
        onValueChange={handleLifestyleChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {lifestyleOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div 
              key={option.value}
              role="radio"
              aria-checked={state.lifestyle === option.value}
              tabIndex={0}
              data-value={option.value}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              onClick={() => handleLifestyleChange(option.value)}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <Card
                className={`relative flex flex-col p-6 cursor-pointer transition-all hover:shadow-md min-h-[140px] ${
                  state.lifestyle === option.value
                    ? 'border-primary shadow-sm'
                    : 'hover:border-primary/50'
                }`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="absolute top-4 right-4"
                  tabIndex={-1}
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-base font-semibold">{option.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Card>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={nextStep} className="flex items-center gap-2" tabIndex={-1}>
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5" />
          <h3 className="text-base font-semibold">Selected Lifestyle Details</h3>
        </div>
        <div className="space-y-4">
          {state.lifestyle === 'modest' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4" />
                <h4 className="font-medium">Modest Living</h4>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Comfortable apartment in a safe neighborhood or modest home ($1,500-2,500/month)</li>
                <li>Reliable used car or good public transportation ($300-400/month)</li>
                <li>Regular groceries with occasional dining out ($500-600/month)</li>
                <li>Basic healthcare and insurance coverage ($400-500/month)</li>
                <li>Limited entertainment and travel budget ($200-300/month)</li>
                <li>Focus on essential needs with some room for small luxuries</li>
              </ul>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground italic">
                <DollarSign className="h-4 w-4" />
                <p>These are base costs before location adjustments</p>
              </div>
            </div>
          )}

          {state.lifestyle === 'comfortable' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4" />
                <h4 className="font-medium">Comfortable Living</h4>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Spacious home in a desirable neighborhood ($3,000-4,000/month)</li>
                <li>Newer vehicle with regular upgrades ($600-800/month)</li>
                <li>Quality groceries and regular restaurant dining ($800-1,000/month)</li>
                <li>Comprehensive healthcare with good coverage ($600-800/month)</li>
                <li>Regular entertainment and annual vacations ($500-700/month)</li>
                <li>Ability to save for future goals and retirement ($1,000-1,500/month)</li>
              </ul>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground italic">
                <DollarSign className="h-4 w-4" />
                <p>These are base costs before location adjustments</p>
              </div>
            </div>
          )}

          {state.lifestyle === 'luxury' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Castle className="h-4 w-4" />
                <h4 className="font-medium">Luxury Living</h4>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>High-end home in premium location ($6,000-8,000/month)</li>
                <li>Luxury vehicles and premium transportation ($1,200-1,500/month)</li>
                <li>High-quality groceries and fine dining ($1,500-2,000/month)</li>
                <li>Premium healthcare with extensive coverage ($1,000-1,200/month)</li>
                <li>Frequent entertainment and luxury travel ($2,000-3,000/month)</li>
                <li>Significant investment and savings capacity ($3,000-4,000/month)</li>
              </ul>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground italic">
                <DollarSign className="h-4 w-4" />
                <p>These are base costs before location adjustments</p>
              </div>
            </div>
          )}

          {state.lifestyle === 'custom' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="h-4 w-4" />
                <h4 className="font-medium">Custom</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Define your own lifestyle by customizing expense categories. This option allows you to mix and match different levels of spending across categories to match your unique preferences and priorities.
              </p>
              <CustomLifestyleDefiner />
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground italic">
                <DollarSign className="h-4 w-4" />
                <p>These are base costs before location adjustments</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 