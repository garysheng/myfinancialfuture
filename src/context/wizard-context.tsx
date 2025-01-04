'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { Lifestyle, Location, FamilyStatus, Outflow } from '@/types';
import { CITY_PRESETS } from '@/lib/constants';

interface WizardState {
  step: number;
  lifestyle: Lifestyle;
  location: Location;
  family: FamilyStatus;
  outflows: Outflow[];
  isValid: boolean;
  customExpenses: Record<string, number> | null;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_LIFESTYLE'; payload: Lifestyle }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_FAMILY'; payload: FamilyStatus }
  | { type: 'SET_OUTFLOWS'; payload: Outflow[] }
  | { type: 'RESET' }
  | { type: 'SET_CUSTOM_EXPENSES'; payload: Record<string, number> };

const initialState: WizardState = {
  step: 1,
  lifestyle: 'modest',
  location: {
    city: CITY_PRESETS[0].name,
    state: CITY_PRESETS[0].state,
    country: CITY_PRESETS[0].country,
    costMultiplier: CITY_PRESETS[0].costMultiplier,
    isCustom: false,
  },
  family: {
    relationship: 'single',
    numChildren: 0,
    partnerIncome: 0,
  },
  outflows: [],
  isValid: false,
  customExpenses: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LIFESTYLE':
      console.log('Setting lifestyle:', action.payload);
      // Clear custom expenses if not custom lifestyle
      return { 
        ...state, 
        lifestyle: action.payload,
        customExpenses: action.payload === 'custom' ? state.customExpenses : null 
      };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_FAMILY':
      return { ...state, family: action.payload };
    case 'SET_OUTFLOWS':
      return { ...state, outflows: action.payload };
    case 'RESET':
      return initialState;
    case 'SET_CUSTOM_EXPENSES':
      console.log('Setting custom expenses:', action.payload);
      return {
        ...state,
        customExpenses: action.payload,
        lifestyle: 'custom' // Ensure lifestyle is set to custom when expenses are set
      };
    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const nextStep = () => {
    if (state.step < 4) {
      dispatch({ type: 'SET_STEP', payload: state.step + 1 });
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', payload: state.step - 1 });
    }
  };

  const isLastStep = state.step === 4;

  return (
    <WizardContext.Provider value={{ state, dispatch, nextStep, prevStep, isLastStep }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
} 