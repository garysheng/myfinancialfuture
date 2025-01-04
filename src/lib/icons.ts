import type { LucideIcon } from 'lucide-react';
import type { OutflowCategory } from '@/types';
import { 
  Home,
  Car,
  Utensils,
  HeartPulse,
  Plane,
  PiggyBank,
  TrendingUp,
  User,
  GraduationCap,
  CircleDollarSign,
  Baby,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

export const categoryIcons: Record<OutflowCategory, LucideIcon> = {
  housing: Home,
  transportation: Car,
  food: Utensils,
  healthcare: HeartPulse,
  entertainment: Plane,
  savings: PiggyBank,
  investments: TrendingUp,
  utilities: Lightbulb,
  insurance: ShieldCheck,
  personal: User,
  education: GraduationCap,
  other: CircleDollarSign,
  children: Baby
}; 