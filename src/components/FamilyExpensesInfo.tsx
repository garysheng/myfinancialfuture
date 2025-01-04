import { BASE_CHILD_COSTS, PARTNER_COST_MULTIPLIERS } from '@/lib/constants';
import type { Lifestyle, Location } from '@/types';

interface FamilyExpensesInfoProps {
  lifestyle: Lifestyle;
  location: Location;
}

export function FamilyExpensesInfo({ lifestyle, location }: FamilyExpensesInfoProps) {
  // Calculate child costs based on lifestyle and location
  const baseChildCost = lifestyle === 'custom' 
    ? BASE_CHILD_COSTS.modest 
    : BASE_CHILD_COSTS[lifestyle];
  
  const adjustedChildCost = Math.round(baseChildCost * location.costMultiplier);
  const educationSavings = lifestyle === 'luxury' ? 500 :
                          lifestyle === 'comfortable' ? 300 :
                          200;

  return (
    <div className="space-y-4 rounded-lg bg-muted/50 p-4">
      <h3 className="font-semibold">How Family Affects Your Expenses</h3>
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium">Partner Impact:</h4>
          <p className="text-sm text-muted-foreground">
            Having a partner affects various expenses differently:
            • Food costs increase by {PARTNER_COST_MULTIPLIERS.food * 100 - 100}%
            • Transportation costs increase by {PARTNER_COST_MULTIPLIERS.transportation * 100 - 100}%
            • Healthcare and personal expenses double
            • Entertainment increases by {PARTNER_COST_MULTIPLIERS.entertainment * 100 - 100}%
            • Utilities increase by {PARTNER_COST_MULTIPLIERS.utilities * 100 - 100}%
            • Housing costs typically remain the same (split between partners)
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Children Impact:</h4>
          <p className="text-sm text-muted-foreground">
            Each child adds significant monthly expenses:
            • Basic costs (adjusted for {location.city}): ${adjustedChildCost.toLocaleString()}/month
            • Education savings: ${educationSavings}/month per child
            • Covers food, clothing, healthcare, activities, and education/childcare
            • Based on {lifestyle} lifestyle level in {location.city}
          </p>
        </div>
      </div>
    </div>
  );
} 