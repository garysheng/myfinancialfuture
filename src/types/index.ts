import { Timestamp as FirebaseTimestamp } from 'firebase/firestore';

// Cost of living multipliers for different cities
export type CityPreset = {
  id: string;
  name: string;
  costMultiplier: number;
  state: string;
  country: string;
  icon: React.ElementType;
};

// Categories for different types of outflows
export type OutflowCategory = 
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'healthcare'
  | 'insurance'
  | 'savings'
  | 'investments'
  | 'entertainment'
  | 'personal'
  | 'education'
  | 'children'
  | 'other';

// Individual outflow item
export type Outflow = {
  id: string;
  name: string;
  amount: number;
  category: OutflowCategory;
  isRequired: boolean;
  description?: string;
};

// Lifestyle choice
export type Lifestyle = 'modest' | 'comfortable' | 'luxury' | 'custom';

// Family status
export type FamilyStatus = {
  relationship: 'single' | 'partnered';
  numChildren: number;
  partnerIncome: number;
};

// Location details
export type Location = {
  city: string;
  state: string;
  country: string;
  costMultiplier: number;
  isCustom: boolean;
};

// A complete financial scenario
export type Scenario = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lifestyle: Lifestyle;
  family: FamilyStatus;
  location: Location;
  outflows: Outflow[];
  monthlyIncome: number;
  yearlyIncome: number;
  userId: string;
  userName: string;
  isPublic: boolean;
  customExpenses: Record<string, number>|null;
};

// User preferences and settings
export type UserPreferences = {
  userId: string;
  defaultScenarioId?: string;
  preferredCurrency: string;
  customLocations: Location[];
  updatedAt: Date;
};

// For the frontend version that works with Dates instead of Firestore Timestamps
export type ScenarioFrontend = Omit<Scenario, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

// For the backend version that works with Firestore Timestamps
export type ScenarioBackend = Omit<Scenario, 'createdAt' | 'updatedAt'> & {
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
};

// User profile information
export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  currentIncome: number;
  createdAt: Date;
  updatedAt: Date;
};

// For the backend version that works with Firestore Timestamps
export type UserProfileBackend = Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
};

// Firebase User type
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}; 