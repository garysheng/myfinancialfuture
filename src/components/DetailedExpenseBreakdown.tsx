'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Scenario, OutflowCategory, Lifestyle } from '@/types';
import { OUTFLOW_CATEGORIES } from '@/lib/constants';
import { calculateTaxes } from '@/lib/tax-helper';
import { calculateRequiredMonthlyIncome } from '@/lib/income-helper';
import { categoryIcons } from '@/lib/icons';
import { 
  Receipt, 
  Building2, 
  MapPin, 
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface DetailedExpenseBreakdownProps {
  scenario: Scenario;
  monthlyIncome: number;
}

function getLifestyleDescription(category: OutflowCategory, lifestyle: Lifestyle) {
  switch (category) {
    case 'housing':
      return lifestyle === 'modest'
        ? 'Basic apartment or small house in an affordable area'
        : lifestyle === 'comfortable'
          ? 'Mid-size home or apartment in a good neighborhood'
          : 'Luxury apartment or large house in a prime location';
    case 'transportation':
      return lifestyle === 'modest'
        ? 'Public transit and/or used vehicle'
        : lifestyle === 'comfortable'
          ? 'Reliable car with moderate payments'
          : 'Luxury vehicle or multiple cars';
    case 'food':
      return lifestyle === 'modest'
        ? 'Home cooking with occasional dining out'
        : lifestyle === 'comfortable'
          ? 'Mix of home cooking and regular dining out'
          : 'Premium groceries and frequent fine dining';
    case 'utilities':
      return lifestyle === 'modest'
        ? 'Basic utilities with careful usage'
        : lifestyle === 'comfortable'
          ? 'Standard utilities with moderate usage'
          : 'Premium services with high usage';
    case 'healthcare':
      return lifestyle === 'modest'
        ? 'Basic health insurance and preventive care'
        : lifestyle === 'comfortable'
          ? 'Good health insurance with regular care'
          : 'Premium health coverage and specialized care';
    case 'insurance':
      return lifestyle === 'modest'
        ? 'Basic coverage for essentials'
        : lifestyle === 'comfortable'
          ? 'Comprehensive coverage with good limits'
          : 'Maximum coverage across all categories';
    case 'savings':
      return lifestyle === 'modest'
        ? 'Building emergency fund and basic savings'
        : lifestyle === 'comfortable'
          ? 'Healthy emergency fund and regular savings'
          : 'Substantial savings across multiple goals';
    case 'investments':
      return lifestyle === 'modest'
        ? 'Starting to build investment portfolio'
        : lifestyle === 'comfortable'
          ? 'Diversified investment strategy'
          : 'Extensive investment portfolio with professional management';
    case 'entertainment':
      return lifestyle === 'modest'
        ? 'Basic subscriptions and occasional activities'
        : lifestyle === 'comfortable'
          ? 'Regular entertainment and moderate travel'
          : 'Premium entertainment and frequent luxury travel';
    case 'personal':
      return lifestyle === 'modest'
        ? 'Basic personal care and wardrobe'
        : lifestyle === 'comfortable'
          ? 'Quality personal care and regular shopping'
          : 'Luxury personal care and designer shopping';
    case 'education':
      return lifestyle === 'modest'
        ? 'Self-learning and basic courses'
        : lifestyle === 'comfortable'
          ? 'Regular professional development'
          : 'Premium courses and private tutoring';
    case 'other':
      return lifestyle === 'modest'
        ? 'Basic miscellaneous expenses'
        : lifestyle === 'comfortable'
          ? 'Moderate discretionary spending'
          : 'Generous miscellaneous budget';
    case 'children':
      return lifestyle === 'modest'
        ? 'Basic childcare, public education, minimal activities, and basic education savings'
        : lifestyle === 'comfortable'
          ? 'Quality childcare, mix of activities, moderate education savings'
          : 'Private school, extensive activities, premium care, and significant education savings';
    default:
      return OUTFLOW_CATEGORIES[category] || '';
  }
}

export function DetailedExpenseBreakdown({ scenario }: DetailedExpenseBreakdownProps) {
  // Use income helper to calculate expenses
  const {
    childrenExpenses,
    adjustedMonthlyOutflows,
    monthlyIncome,
  } = calculateRequiredMonthlyIncome(scenario);

  // Calculate taxes using the tax helper
  const taxBreakdown = calculateTaxes({
    annualIncome: monthlyIncome * 12,
    state: scenario.location.state,
    city: scenario.location.city,
    isMarried: scenario.family.relationship === 'partnered',
    partnerIncome: scenario.family.partnerIncome,
  });

  // Convert yearly tax amounts to monthly
  const monthlyFederalTax = taxBreakdown.federalTax / 12;
  const monthlyStateTax = taxBreakdown.stateTax / 12;
  const monthlyCityTax = taxBreakdown.cityTax / 12;
  const monthlySocialSecurity = taxBreakdown.socialSecurity / 12;
  const monthlyMedicare = taxBreakdown.medicare / 12;
  const monthlyTotalTax = taxBreakdown.totalTax / 12;

  return (
    <Card className="p-6 bg-background text-white">
      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            View Detailed Breakdown
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4" />
                  <h4 className="font-semibold">
                    {(scenario.family.relationship === 'partnered' || scenario.family.numChildren > 0)
                      ? 'Household Tax Breakdown'
                      : 'Personal Tax Breakdown'}
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Federal Tax</span>
                    <span>${Math.round(monthlyFederalTax).toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax</span>
                    <span>${Math.round(monthlyStateTax).toLocaleString()}/month</span>
                  </div>
                  {monthlyCityTax > 0 && (
                    <div className="flex justify-between">
                      <span>City Tax</span>
                      <span>${Math.round(monthlyCityTax).toLocaleString()}/month</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Social Security</span>
                    <span>${Math.round(monthlySocialSecurity).toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicare</span>
                    <span>${Math.round(monthlyMedicare).toLocaleString()}/month</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Monthly Tax</span>
                    <span>${Math.round(monthlyTotalTax).toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Effective Tax Rate</span>
                    <span>{(taxBreakdown.effectiveTaxRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Marginal Tax Rate</span>
                    <span>{(taxBreakdown.marginalTaxRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <h4 className="font-semibold">
                    {(scenario.family.relationship === 'partnered' || scenario.family.numChildren > 0)
                      ? 'Household Lifestyle Choice:'
                      : 'Personal Lifestyle Choice:'}
                  </h4>
                </div>
                <p>{scenario.lifestyle.charAt(0).toUpperCase() + scenario.lifestyle.slice(1)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <h4 className="font-semibold">Location:</h4>
                </div>
                <p>{scenario.location.city}, {scenario.location.state}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <h4 className="font-semibold">Cost of Living Multiplier:</h4>
                </div>
                <p>{((scenario.location.costMultiplier - 1) * 100).toFixed(0)}% more than US average</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <h4 className="font-semibold">Family Status:</h4>
                </div>
                <p>
                  {scenario.family.relationship.charAt(0).toUpperCase() + scenario.family.relationship.slice(1)}
                  {scenario.family.numChildren > 0 && ` With ${scenario.family.numChildren} ${scenario.family.numChildren === 1 ? 'Child' : 'Children'}`}
                </p>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4" />
                  <h4 className="font-semibold">
                    {(scenario.family.relationship === 'partnered' || scenario.family.numChildren > 0)
                      ? 'Household Monthly Expenses'
                      : 'Personal Monthly Expenses'}
                  </h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(adjustedMonthlyOutflows).map(([category, amount]) => {
                    const Icon = categoryIcons[category as OutflowCategory];
                    return (
                      <div key={category} className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium capitalize">{category}</span>
                          </div>
                          <p className="text-xs text-white/70 mt-1">
                            {getLifestyleDescription(category as OutflowCategory, scenario.lifestyle)}
                          </p>
                        </div>
                        <span>${amount.toLocaleString()}</span>
                      </div>
                    );
                  })}

                  {scenario.family.numChildren > 0 && (
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {React.createElement(categoryIcons.children, { className: "h-4 w-4" })}
                          <span className="font-medium">Children (Additional Expenses)</span>
                        </div>
                        <p className="text-xs text-white/70 mt-1">
                          {getLifestyleDescription('children', scenario.lifestyle)}
                        </p>
                      </div>
                      <span>${childrenExpenses.toLocaleString()}</span>
                    </div>
                  )}

                  <Separator className="my-4" />
                  <div className="flex justify-between font-semibold text-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Total Monthly Expenses</span>
                    </div>
                    <span>${Math.round(monthlyIncome).toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
} 