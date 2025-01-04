import type { Scenario, OutflowCategory, Lifestyle } from '@/types';
import { DEFAULT_MONTHLY_OUTFLOWS, BASE_CHILD_COSTS, PARTNER_COST_MULTIPLIERS } from './constants';
import { calculateRequiredIncome } from './tax-helper';

// Helper to ensure type safety for outflow categories
const isValidCategory = (category: string): category is OutflowCategory => {
  return Object.keys(DEFAULT_MONTHLY_OUTFLOWS.modest).includes(category);
};

function getBaseExpensesForLifestyle(lifestyle: Lifestyle): Record<OutflowCategory, number> {
  const base = lifestyle === 'custom' ? DEFAULT_MONTHLY_OUTFLOWS.modest : DEFAULT_MONTHLY_OUTFLOWS[lifestyle];
  return {
    ...base,
    children: 0
  };
}

export function calculateRequiredMonthlyIncome(scenario: Scenario): {
  monthlyIncome: number;
  yearlyIncome: number;
  monthlyExpenses: number;
  childrenExpenses: number;
  adjustedMonthlyOutflows: Record<OutflowCategory, number>;
} {
  // Use custom expenses if available, otherwise use lifestyle-based expenses
  const baseExpenses = scenario.customExpenses || getBaseExpensesForLifestyle(scenario.lifestyle);
  
  // Calculate adjusted monthly outflows with partner and location multipliers
  const adjustedMonthlyOutflows = Object.entries(baseExpenses).reduce<Record<OutflowCategory, number>>(
    (acc, [category, amount]) => {
      if (isValidCategory(category)) {
        // First apply partner multiplier if partnered
        const partnerMultiplier = scenario.family.relationship === 'partnered' 
          ? PARTNER_COST_MULTIPLIERS[category] 
          : 1;
        
        const partnerAdjustedAmount = Number(amount) * partnerMultiplier;
        
        // Then apply location cost multiplier
        // Only apply location multiplier to living expenses, not to savings/investments
        const shouldApplyLocationMultiplier = !['savings', 'investments'].includes(category);
        const locationMultiplier = shouldApplyLocationMultiplier ? scenario.location.costMultiplier : 1;
        
        acc[category] = Math.round(partnerAdjustedAmount * locationMultiplier);
      }
      return acc;
    },
    {} as Record<OutflowCategory, number>
  );

  // Calculate child-related expenses with lifestyle and location adjustments
  const baseChildCost = scenario.lifestyle === 'custom' 
    ? BASE_CHILD_COSTS.modest 
    : BASE_CHILD_COSTS[scenario.lifestyle];
  
  const adjustedChildCost = Math.round(baseChildCost * scenario.location.costMultiplier);
  const childrenExpenses = Math.round((scenario.family.numChildren || 0) * adjustedChildCost);

  // Calculate total monthly expenses
  const monthlyExpenses = Math.round(
    Object.values(adjustedMonthlyOutflows).reduce((a, b) => a + b, 0) +
    (childrenExpenses || 0)
  );

  // Calculate required income using the tax helper
  const yearlyIncome = Math.round(calculateRequiredIncome(
    monthlyExpenses,
    scenario.location.state,
    scenario.family.relationship === 'partnered',
    scenario.family.partnerIncome || 0
  ));

  const monthlyIncome = Math.round(yearlyIncome / 12);

  return {
    monthlyIncome,
    yearlyIncome,
    monthlyExpenses,
    childrenExpenses,
    adjustedMonthlyOutflows,
  };
} 