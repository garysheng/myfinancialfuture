import { CityPreset } from '@/types';

// 2024 Federal Tax Brackets (Single)
const FEDERAL_TAX_BRACKETS_SINGLE_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// 2024 Federal Tax Brackets (Married Filing Jointly)
const FEDERAL_TAX_BRACKETS_MARRIED_2024 = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

// State Tax Rates (Using highest marginal rate for conservative estimation)
const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.05,     // Alabama
  AK: 0,        // Alaska (no state income tax)
  AZ: 0.0459,   // Arizona
  AR: 0.055,    // Arkansas
  CA: 0.133,    // California
  CO: 0.0444,   // Colorado
  CT: 0.0699,   // Connecticut
  DE: 0.066,    // Delaware
  FL: 0,        // Florida (no state income tax)
  GA: 0.0575,   // Georgia
  HI: 0.11,     // Hawaii
  ID: 0.058,    // Idaho
  IL: 0.0495,   // Illinois
  IN: 0.0323,   // Indiana
  IA: 0.0600,   // Iowa
  KS: 0.057,    // Kansas
  KY: 0.045,    // Kentucky
  LA: 0.0425,   // Louisiana
  ME: 0.0715,   // Maine
  MD: 0.0575,   // Maryland
  MA: 0.05,     // Massachusetts
  MI: 0.0425,   // Michigan
  MN: 0.0985,   // Minnesota
  MS: 0.05,     // Mississippi
  MO: 0.0495,   // Missouri
  MT: 0.0675,   // Montana
  NE: 0.0664,   // Nebraska
  NV: 0,        // Nevada (no state income tax)
  NH: 0.05,     // New Hampshire (only on interest/dividends)
  NJ: 0.1075,   // New Jersey
  NM: 0.059,    // New Mexico
  NY: 0.109,    // New York
  NC: 0.0499,   // North Carolina
  ND: 0.0290,   // North Dakota
  OH: 0.0399,   // Ohio
  OK: 0.0475,   // Oklahoma
  OR: 0.099,    // Oregon
  PA: 0.0307,   // Pennsylvania
  RI: 0.0599,   // Rhode Island
  SC: 0.07,     // South Carolina
  SD: 0,        // South Dakota (no state income tax)
  TN: 0,        // Tennessee (no state income tax)
  TX: 0,        // Texas (no state income tax)
  UT: 0.0485,   // Utah
  VT: 0.0875,   // Vermont
  VA: 0.0575,   // Virginia
  WA: 0,        // Washington (no state income tax)
  WV: 0.065,    // West Virginia
  WI: 0.0765,   // Wisconsin
  WY: 0,        // Wyoming (no state income tax)
  DC: 0.0995,   // District of Columbia (not a state but included)
};

// Fallback state tax rates by region (for custom locations)
const STATE_TAX_FALLBACKS: Record<string, number> = {
  NORTHEAST: 0.06, // Average for Northeast states
  MIDWEST: 0.05,   // Average for Midwest states
  SOUTH: 0.05,     // Average for Southern states
  WEST: 0.07,      // Average for Western states
  DEFAULT: 0.05,   // National average
};

// City Tax Rates (for major cities with income tax)
const CITY_TAX_RATES: Record<string, number> = {
  'New York City': 0.03876,      // NYC highest marginal rate
  'Philadelphia': 0.0371,        // Philadelphia wage tax for residents
  'San Francisco': 0.0138,       // SF highest marginal rate
  'Detroit': 0.0245,            // Detroit resident rate
  'Cincinnati': 0.019,          // Cincinnati earnings tax
  'Cleveland': 0.024,           // Cleveland income tax
  'Columbus': 0.025,            // Columbus income tax
  'St. Louis': 0.01,            // St. Louis earnings tax
  'Kansas City': 0.01,          // Kansas City earnings tax
  'Pittsburgh': 0.03,           // Pittsburgh
  'Toledo': 0.0225,             // Toledo
  'Baltimore': 0.032,           // Baltimore
  'Wilmington': 0.0125,         // Wilmington, DE
  'Portland': 0.0137,           // Portland, OR (Multnomah County)
  'Birmingham': 0.01,           // Birmingham, AL
  'Louisville': 0.0235,         // Louisville, KY
  'Dayton': 0.0225,            // Dayton, OH
  'Akron': 0.025,              // Akron, OH
  'Newark': 0.01,              // Newark, NJ
  'Youngstown': 0.025,         // Youngstown, OH
  'Grand Rapids': 0.015,       // Grand Rapids, MI
  'Lansing': 0.01,             // Lansing, MI
  'Flint': 0.01,               // Flint, MI
  'Indianapolis': 0.0202,      // Indianapolis/Marion County
  'Scranton': 0.0235,          // Scranton, PA
  'Reading': 0.0235,           // Reading, PA
  'Erie': 0.018,               // Erie, PA
  'Allentown': 0.015,          // Allentown, PA
  'Yonkers': 0.016675,         // Yonkers, NY
  'Kansas City KS': 0.01,      // Kansas City, KS
  'Warren': 0.01,              // Warren, MI
  'Pontiac': 0.01,             // Pontiac, MI
  'Battle Creek': 0.01,        // Battle Creek, MI
  'Jackson MI': 0.01,          // Jackson, MI
  'Springfield OH': 0.02,      // Springfield, OH
  'Saginaw': 0.015,           // Saginaw, MI
  'Benton Harbor': 0.01,       // Benton Harbor, MI
  'Albion': 0.01,             // Albion, MI
  'Big Rapids': 0.01,          // Big Rapids, MI
  'East Lansing': 0.01,       // East Lansing, MI
  'Gahanna': 0.015,           // Gahanna, OH
  'Hamtramck': 0.01,          // Hamtramck, MI
  'Highland Park': 0.02,       // Highland Park, MI
  'Ionia': 0.01,              // Ionia, MI
  'Lapeer': 0.01,             // Lapeer, MI
  'Muskegon': 0.01,           // Muskegon, MI
  'Muskegon Heights': 0.01,   // Muskegon Heights, MI
  'Port Huron': 0.01,         // Port Huron, MI
  'Portland MI': 0.01,        // Portland, MI
  'Lancaster': 0.019,         // Lancaster, PA
};

// Helper function to get state tax rate with fallback
function getStateTaxRateWithFallback(state: string): number {
  // If we have an exact match, use it
  if (STATE_TAX_RATES[state]) {
    return STATE_TAX_RATES[state];
  }

  // Otherwise, try to determine region and use fallback
  const northeast = ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'];
  const midwest = ['OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'];
  const south = ['DE', 'MD', 'DC', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'AL', 'MS', 'AR', 'LA', 'OK', 'TX'];
  const west = ['MT', 'ID', 'WY', 'CO', 'NM', 'AZ', 'UT', 'NV', 'CA', 'OR', 'WA', 'AK', 'HI'];

  if (northeast.includes(state)) return STATE_TAX_FALLBACKS.NORTHEAST;
  if (midwest.includes(state)) return STATE_TAX_FALLBACKS.MIDWEST;
  if (south.includes(state)) return STATE_TAX_FALLBACKS.SOUTH;
  if (west.includes(state)) return STATE_TAX_FALLBACKS.WEST;

  return STATE_TAX_FALLBACKS.DEFAULT;
}

// Helper function to determine if a city is likely to have city tax
function estimateCityTaxRate(city: string, state: string): number {
  // If we have an exact match, use it
  if (CITY_TAX_RATES[city]) {
    return CITY_TAX_RATES[city];
  }

  // Cities in certain states are more likely to have local income taxes
  const cityTaxStates = ['OH', 'PA', 'NY', 'MI', 'MO', 'KY', 'IN', 'MD', 'AL'];
  const population = 500000; // Assume large city if custom location (conservative estimate)

  // If it's a major city in a state known for city taxes, use a conservative estimate
  if (cityTaxStates.includes(state) && population > 250000) {
    return 0.01; // Conservative 1% estimate for large cities in these states
  }

  return 0; // Most US cities don't have city income tax
}

// FICA Tax Rates
const FICA_RATES = {
  socialSecurity: {
    rate: 0.062,
    wageBase: 168600, // 2024 Social Security wage base
  },
  medicare: {
    rate: 0.0145,
    additionalRate: 0.009, // Additional Medicare tax for high earners
    threshold: {
      single: 200000,
      married: 250000,
    },
  },
};

interface TaxCalculationParams {
  annualIncome: number;
  state: string;
  city?: string;
  isMarried?: boolean;
  partnerIncome?: number;
}

interface TaxBreakdown {
  federalTax: number;
  stateTax: number;
  cityTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  takeHomePay: number;
  monthlyTakeHome: number;
}

export function calculateTaxes({
  annualIncome,
  state,
  city,
  isMarried = false,
  partnerIncome = 0,
}: TaxCalculationParams): TaxBreakdown {
  // Determine which tax brackets to use
  const brackets = isMarried ? FEDERAL_TAX_BRACKETS_MARRIED_2024 : FEDERAL_TAX_BRACKETS_SINGLE_2024;
  
  // Calculate Federal Tax
  let federalTax = 0;
  let previousBracketMax = 0;
  
  // For married filing jointly, we need to consider combined income for brackets
  const combinedIncome = isMarried ? annualIncome + partnerIncome : annualIncome;
  
  for (const bracket of brackets) {
    if (combinedIncome > previousBracketMax) {
      const taxableInThisBracket = Math.min(combinedIncome - previousBracketMax, bracket.max - previousBracketMax);
      federalTax += taxableInThisBracket * bracket.rate;
      previousBracketMax = bracket.max;
    }
  }

  // If married, prorate the federal tax based on income proportion
  if (isMarried && partnerIncome > 0) {
    const proportion = annualIncome / combinedIncome;
    federalTax = Math.round(federalTax * proportion);
  }

  // Calculate State Tax with fallback
  const stateRate = getStateTaxRateWithFallback(state);
  const stateTax = annualIncome * stateRate;

  // Calculate City Tax with estimation for custom cities
  const cityRate = city ? estimateCityTaxRate(city, state) : 0;
  const cityTax = annualIncome * cityRate;

  // Calculate Social Security Tax (individual, not combined)
  const socialSecurity = Math.min(annualIncome, FICA_RATES.socialSecurity.wageBase) * FICA_RATES.socialSecurity.rate;

  // Calculate Medicare Tax
  let medicare = annualIncome * FICA_RATES.medicare.rate;
  const medicareThreshold = isMarried ? FICA_RATES.medicare.threshold.married : FICA_RATES.medicare.threshold.single;
  
  // For Medicare additional tax, we need to consider combined income if married
  const totalIncomeForMedicare = isMarried ? annualIncome + partnerIncome : annualIncome;
  if (totalIncomeForMedicare > medicareThreshold) {
    // Only apply additional tax to the portion of THIS person's income that contributes to being over threshold
    const individualContributionOverThreshold = Math.max(0, 
      annualIncome - (medicareThreshold - (isMarried ? partnerIncome : 0))
    );
    medicare += individualContributionOverThreshold * FICA_RATES.medicare.additionalRate;
  }

  // Calculate total tax and rates (now including city tax)
  const totalTax = federalTax + stateTax + cityTax + socialSecurity + medicare;
  const effectiveTaxRate = totalTax / annualIncome;
  
  // Calculate marginal tax rate (based on combined income if married)
  const marginalTaxRate = calculateMarginalRate(combinedIncome, brackets) + stateRate + cityRate;

  // Calculate take-home pay
  const takeHomePay = annualIncome - totalTax;
  const monthlyTakeHome = takeHomePay / 12;

  return {
    federalTax,
    stateTax,
    cityTax,
    socialSecurity,
    medicare,
    totalTax,
    effectiveTaxRate,
    marginalTaxRate,
    takeHomePay,
    monthlyTakeHome,
  };
}

function calculateMarginalRate(income: number, brackets: typeof FEDERAL_TAX_BRACKETS_SINGLE_2024): number {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i].min) {
      return brackets[i].rate;
    }
  }
  return 0;
}

// Helper function to estimate required gross income for a desired net income
export function calculateRequiredIncome(
  desiredMonthlyNet: number,
  state: string,
  isMarried = false,
  partnerIncome = 0
): number {
  const desiredAnnualNet = desiredMonthlyNet * 12;
  let low = desiredAnnualNet;
  let high = desiredAnnualNet * 2; // Initial guess
  let iterations = 0;
  const maxIterations = 20;
  const tolerance = 1000; // Acceptable difference in dollars

  while (iterations < maxIterations) {
    const mid = (low + high) / 2;
    const taxes = calculateTaxes({
      annualIncome: mid,
      state,
      isMarried,
      partnerIncome,
    });

    const diff = taxes.takeHomePay - desiredAnnualNet;

    if (Math.abs(diff) < tolerance) {
      return mid;
    }

    if (diff < 0) {
      low = mid;
    } else {
      high = mid;
    }

    iterations++;
  }

  return low; // Return best approximation
}

// Helper function to get state tax rate for a location
export function getStateTaxRate(location: CityPreset): number {
  return STATE_TAX_RATES[location.state] || 0;
}

// Helper function to format tax amount as currency
export function formatTaxAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format tax rate as percentage
export function formatTaxRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
} 