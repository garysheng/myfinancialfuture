'use client';

import { ResponsiveSankey } from '@nivo/sankey';
import { Card } from '@/components/ui/card';
import { ScenarioFrontend } from '@/types';
import { calculateTaxes } from '@/lib/tax-helper';
import { useState, useEffect } from 'react';

// Define types for nodes and links
interface SankeyNode {
  id: string;
  label: string;
  nodeColor: string;
  layer?: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

// Color palette for the diagram
const COLORS = {
  income: '#22c55e', // Green for income
  netIncome: '#86efac', // Light green for net income
  taxes: {
    federal: '#dc2626', // Deep red
    state: '#ef4444', // Red
    fica: '#f87171', // Light red
  },
  expenses: [
    '#b91c1c', // Dark red
    '#dc2626', // Red
    '#ef4444', // Bright red
    '#f87171', // Light red
    '#fca5a5', // Lighter red
    '#fee2e2', // Very light red
    '#991b1b', // Very dark red
    '#7f1d1d', // Darkest red
    '#fecaca', // Pink red
    '#fecdd3', // Pink
    '#fda4af', // Light pink
    '#fff1f2', // Very light pink
    '#be123c', // Ruby red
  ],
};

interface SankeyDiagramProps {
  scenario: ScenarioFrontend;
}

export function SankeyDiagram({ scenario }: SankeyDiagramProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate tax breakdown
  const taxBreakdown = calculateTaxes({
    annualIncome: scenario.yearlyIncome,
    state: scenario.location.state,
    isMarried: scenario.family.relationship === 'partnered',
    partnerIncome: scenario.family.partnerIncome
  });

  // Convert annual tax amounts to monthly
  const monthlyFederalTax = Math.round(taxBreakdown.federalTax / 12);
  const monthlyStateTax = Math.round(taxBreakdown.stateTax / 12);
  const monthlyFicaTax = Math.round((taxBreakdown.socialSecurity + taxBreakdown.medicare) / 12);

  // Group outflows by category and sort by amount (largest first)
  const outflowsByCategory = Object.entries(
    scenario.outflows.reduce<Record<string, number>>(
      (acc, outflow) => {
        if (!acc[outflow.category]) {
          acc[outflow.category] = 0;
        }
        acc[outflow.category] += outflow.amount;
        return acc;
      },
      {}
    )
  )
    .sort(([, a], [, b]) => b - a)
    .reduce<Record<string, number>>(
      (acc, [category, amount]) => {
        acc[category] = amount;
        return acc;
      },
      {}
    );

  // Create nodes for the Sankey diagram
  const nodes: SankeyNode[] = isMobile ? [
    { id: 'Gross Income', label: 'Gross Income', nodeColor: COLORS.income, layer: 0 },
    { id: 'Net Income', label: 'Net Income', nodeColor: COLORS.netIncome, layer: 2 },
    { id: 'Total Tax', label: 'Total Tax', nodeColor: COLORS.taxes.federal, layer: 1 },
    { id: 'Non Tax Expenses', label: 'Non-Tax Expenses', nodeColor: COLORS.expenses[0], layer: 3 },
  ] : [
    { id: 'Gross Income', label: 'Gross Income', nodeColor: COLORS.income, layer: 0 },
    { id: 'Net Income', label: 'Net Income', nodeColor: COLORS.netIncome, layer: 2 },
    { id: 'Federal Tax', label: 'Federal Tax', nodeColor: COLORS.taxes.federal, layer: 1 },
    { id: 'State Tax', label: 'State Tax', nodeColor: COLORS.taxes.state, layer: 1 },
    { id: 'FICA Tax', label: 'FICA Tax', nodeColor: COLORS.taxes.fica, layer: 1 },
    ...Object.keys(outflowsByCategory).map((category, index) => ({
      id: category.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + category.split(/(?=[A-Z])/).join(' ').slice(1),
      label: category === 'children' ? 'Child Costs' : category.charAt(0).toUpperCase() + category.slice(1),
      nodeColor: COLORS.expenses[index % COLORS.expenses.length],
      layer: 3,
    })),
  ];

  // Create links between nodes
  const totalTax = monthlyFederalTax + monthlyStateTax + monthlyFicaTax;
  const totalExpenses = Object.values(outflowsByCategory).reduce((sum, amount) => sum + amount, 0);

  const links: SankeyLink[] = isMobile ? [
    // Combined tax flow
    {
      source: 'Gross Income',
      target: 'Total Tax',
      value: totalTax,
    },
    // Net income flow
    {
      source: 'Gross Income',
      target: 'Net Income',
      value: scenario.monthlyIncome - totalTax,
    },
    // Combined expenses flow
    {
      source: 'Net Income',
      target: 'Non Tax Expenses',
      value: totalExpenses,
    },
  ] : [
    // Tax flows
    {
      source: 'Gross Income',
      target: 'Federal Tax',
      value: monthlyFederalTax,
    },
    {
      source: 'Gross Income',
      target: 'State Tax',
      value: monthlyStateTax,
    },
    {
      source: 'Gross Income',
      target: 'FICA Tax',
      value: monthlyFicaTax,
    },
    // Net income flow
    {
      source: 'Gross Income',
      target: 'Net Income',
      value: scenario.monthlyIncome - (monthlyFederalTax + monthlyStateTax + monthlyFicaTax),
    },
    // Expense flows
    ...Object.entries(outflowsByCategory).map(([category, amount]) => ({
      source: 'Net Income',
      target: category.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + category.split(/(?=[A-Z])/).join(' ').slice(1),
      value: amount,
    })),
  ];

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Cash Flow</h3>
      <div className="w-full h-[500px] bg-white">
        <ResponsiveSankey<SankeyNode, SankeyLink>
          data={{
            nodes,
            links,
          }}
          margin={isMobile
            ? { top: 50, right: 20, bottom: 50, left: 20 }
            : { top: 20, right: 160, bottom: 20, left: 160 }
          }
          align="justify"
          colors={(node) => node.nodeColor}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{
            from: 'nodeColor',
            modifiers: [['darker', 1]],
          }}
          sort={(nodeA, nodeB) => {
            // Sort by layer first to maintain flow
            if (nodeA.layer !== nodeB.layer) {
              return nodeA.layer! - nodeB.layer!;
            }
            
            // Within the same layer, sort taxes to top
            if (nodeA.layer === 1) { // Tax layer
              if (nodeA.id.includes('Tax') && nodeB.id.includes('Tax')) {
                // Federal first, then State, then FICA
                if (nodeA.id === 'federalTax') return -1;
                if (nodeB.id === 'federalTax') return 1;
                if (nodeA.id === 'stateTax') return -1;
                if (nodeB.id === 'stateTax') return 1;
              }
              return 0;
            }
            
            // For expense layer, sort by value
            if (nodeA.layer === 3) {
              return (nodeB.value || 0) - (nodeA.value || 0);
            }
            
            return 0;
          }}
          layout={isMobile ? 'vertical' : 'horizontal'}
          theme={{
            background: '#ffffff',
            text: {
              fontSize: 12,
              fill: '#111827',
            },
            tooltip: {
              container: {
                background: '#ffffff',
                color: '#111827',
                fontSize: '12px',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '12px',
                border: '1px solid #e5e7eb',
              },
            },
          }}
        />
      </div>
    </Card>
  );
} 