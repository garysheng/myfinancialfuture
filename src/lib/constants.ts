import { CityPreset, Lifestyle, OutflowCategory } from '@/types';
import { 
  Landmark,
  Building2,
  Palmtree,
  Mountain,
  Building,
  TreePine,
  Waves,
  Warehouse,
  Factory,
  Sun
} from 'lucide-react';

interface ExpenseCategory {
  name: OutflowCategory;
  min: number;
  max: number;
  default: number;
  description: string;
}

// City presets with cost of living multipliers
// Base multiplier of 1.0 represents the US national average
export const CITY_PRESETS: CityPreset[] = [
  {
    id: '1',
    name: 'New York City',
    state: 'NY',
    country: 'United States',
    costMultiplier: 2.3,
    icon: Landmark, // Statue of Liberty/Financial District
  },
  {
    id: '2',
    name: 'San Francisco',
    state: 'CA',
    country: 'United States',
    costMultiplier: 2.4,
    icon: Sun,
  },
  {
    id: '3',
    name: 'Miami',
    state: 'FL',
    country: 'United States',
    costMultiplier: 1.6,
    icon: Palmtree, // Beach/Tropical
  },
  {
    id: '4',
    name: 'Denver',
    state: 'CO',
    country: 'United States',
    costMultiplier: 1.4,
    icon: Mountain, // Mountains
  },
  {
    id: '5',
    name: 'Chicago',
    state: 'IL',
    country: 'United States',
    costMultiplier: 1.5,
    icon: Building, // Skyline
  },
  {
    id: '6',
    name: 'Seattle',
    state: 'WA',
    country: 'United States',
    costMultiplier: 1.7,
    icon: TreePine, // Evergreen/Nature
  },
  {
    id: '7',
    name: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    costMultiplier: 2.0,
    icon: Waves, // Beach/Ocean
  },
  {
    id: '8',
    name: 'Austin',
    state: 'TX',
    country: 'United States',
    costMultiplier: 1.3,
    icon: Warehouse, // Tech/Warehouse District
  },
  {
    id: '9',
    name: 'Detroit',
    state: 'MI',
    country: 'United States',
    costMultiplier: 0.9,
    icon: Factory, // Industry/Auto
  },
  {
    id: '10',
    name: 'Atlanta',
    state: 'GA',
    country: 'United States',
    costMultiplier: 1.2,
    icon: Building2, // Modern City
  },
];

// Default recommended savings percentages
export const DEFAULT_SAVINGS_PERCENTAGES = {
  emergency: 0.10, // 10% for emergency fund
  retirement: 0.15, // 15% for retirement
  investment: 0.05, // 5% for additional investments
};

// Default outflow categories with descriptions
export const OUTFLOW_CATEGORIES: Record<OutflowCategory, string> = {
  housing: 'Rent, mortgage, property taxes, home insurance, maintenance',
  transportation: 'Car payments, gas, public transit, maintenance, parking',
  food: 'Groceries, dining out, snacks, beverages',
  utilities: 'Electricity, water, gas, internet, phone',
  healthcare: 'Health insurance, medications, doctor visits',
  insurance: 'Life insurance, disability insurance',
  savings: 'Emergency fund, general savings',
  investments: 'Retirement accounts, stocks, bonds',
  entertainment: 'Movies, hobbies, subscriptions, travel',
  personal: 'Clothing, personal care, gym',
  education: 'Tuition, books, courses, professional development',
  other: 'Miscellaneous expenses',
  children: 'Child-related expenses including education savings',
};

// Partner cost multipliers for different categories
// These represent how much costs increase when partnered (1 = no increase, 2 = doubles)
export const PARTNER_COST_MULTIPLIERS = {
  housing: 1.0,  // Housing cost stays the same when partnered
  transportation: 1.5, // 50% increase for potential second vehicle/transit
  food: 1.8,     // 80% increase for groceries/dining
  utilities: 1.2, // 20% increase for utilities
  healthcare: 2.0, // Doubles for second person
  insurance: 2.0,  // Doubles for second person
  savings: 1.0,    // Individual choice
  investments: 1.0, // Individual choice
  entertainment: 1.7, // 70% increase for couple activities
  personal: 2.0,    // Doubles for second person
  education: 1.0,   // Individual choice
  other: 1.5,      // 50% increase for misc expenses
  children: 1.0,    // Children costs calculated separately
};

type MonthlyOutflows = {
  housing: number;
  transportation: number;
  food: number;
  utilities: number;
  healthcare: number;
  insurance: number;
  savings: number;
  investments: number;
  entertainment: number;
  personal: number;
  education: number;
  other: number;
};

export const DEFAULT_MONTHLY_OUTFLOWS: Record<Exclude<Lifestyle, 'custom'>, MonthlyOutflows> = {
  modest: {
    housing: 1500,
    transportation: 400,
    food: 400,
    utilities: 200,
    healthcare: 300,
    insurance: 100,
    savings: 500,
    investments: 300,
    entertainment: 200,
    personal: 100,
    education: 50,
    other: 100,
  },
  comfortable: {
    housing: 2500,
    transportation: 600,
    food: 800,
    utilities: 300,
    healthcare: 400,
    insurance: 200,
    savings: 1000,
    investments: 800,
    entertainment: 500,
    personal: 300,
    education: 200,
    other: 200,
  },
  luxury: {
    housing: 5000,
    transportation: 1200,
    food: 1500,
    utilities: 500,
    healthcare: 600,
    insurance: 400,
    savings: 2000,
    investments: 2000,
    entertainment: 1000,
    personal: 800,
    education: 500,
    other: 500,
  },
};

// Base monthly cost per child (based on research for major US cities)
// Includes: food, clothing, healthcare, activities, education savings, and childcare
export const BASE_CHILD_COSTS = {
  modest: 1200, // Basic needs, public education, minimal activities, basic education savings
  comfortable: 2000, // Mix of public/private education, regular activities, moderate education savings
  luxury: 3900, // Private school, extensive activities, premium healthcare, significant education savings
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { 
    name: 'housing', 
    min: 1500, 
    max: 15000, 
    default: 3000,
    description: OUTFLOW_CATEGORIES.housing
  },
  { 
    name: 'transportation', 
    min: 300, 
    max: 1500, 
    default: 600,
    description: OUTFLOW_CATEGORIES.transportation
  },
  { 
    name: 'food', 
    min: 400, 
    max: 2000, 
    default: 800,
    description: OUTFLOW_CATEGORIES.food
  },
  { 
    name: 'utilities', 
    min: 200, 
    max: 800, 
    default: 400,
    description: OUTFLOW_CATEGORIES.utilities
  },
  { 
    name: 'healthcare', 
    min: 300, 
    max: 1200, 
    default: 600,
    description: OUTFLOW_CATEGORIES.healthcare
  },
  { 
    name: 'insurance', 
    min: 100, 
    max: 500, 
    default: 250,
    description: OUTFLOW_CATEGORIES.insurance
  },
  { 
    name: 'entertainment', 
    min: 200, 
    max: 3000, 
    default: 500,
    description: OUTFLOW_CATEGORIES.entertainment
  },
  { 
    name: 'personal', 
    min: 100, 
    max: 1000, 
    default: 300,
    description: OUTFLOW_CATEGORIES.personal
  },
  { 
    name: 'education', 
    min: 50, 
    max: 1000, 
    default: 200,
    description: OUTFLOW_CATEGORIES.education
  },
  { 
    name: 'other', 
    min: 100, 
    max: 1000, 
    default: 300,
    description: OUTFLOW_CATEGORIES.other
  },
  { 
    name: 'savings', 
    min: 500, 
    max: 5000, 
    default: 1000,
    description: OUTFLOW_CATEGORIES.savings
  },
  { 
    name: 'investments', 
    min: 300, 
    max: 5000, 
    default: 800,
    description: OUTFLOW_CATEGORIES.investments
  },
]; 