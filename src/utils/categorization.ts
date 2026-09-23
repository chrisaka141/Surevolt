import { IssueCategory, Department } from '../types';

export interface CategorizationResult {
  category: IssueCategory;
  confidence: 'high' | 'medium';
  reason: string;
  recommendedPriceRange: { min: number; max: number };
  requiresInspectionNotice: boolean;
}

export function analyzeEquipmentIssue(
  text: string,
  department: Department,
  pricing: { servicingMin: number; servicingMax: number; overhaulingMin: number; overhaulingMax: number }
): CategorizationResult {
  const lower = text.toLowerCase().trim();

  // Keyword sets for overhauling
  const overhaulingKeywords = [
    'smoking',
    'smoke',
    'white smoke',
    'black smoke',
    'knocked',
    'knock',
    'seized',
    'seize',
    'leaking oil',
    'oil leak',
    'leakage of oil',
    'shortage of oil',
    'low oil',
    'loss of compression',
    'piston',
    'rings',
    'connecting rod',
    'crankshaft',
    'engine knocked',
    'overheating and stopping',
    'metal sound',
    'burnt smell',
  ];

  // Keyword sets for servicing
  const servicingKeywords = [
    'hard starting',
    'not starting',
    'wont start',
    'hard to pull',
    'routine check',
    'routine',
    'servicing',
    'service',
    'regular maintenance',
    'tune up',
    'spark plug',
    'carburetor',
    'cleaning',
    'oil change',
    'filter',
    'rough idle',
    'surging',
    'generator vibrating',
    'fuel line',
  ];

  // Check Overhauling first
  for (const kw of overhaulingKeywords) {
    if (lower.includes(kw)) {
      return {
        category: 'overhauling',
        confidence: 'high',
        reason: `Detected "${kw}": Engine symptoms point to internal engine wear, ring/piston fatigue, or severe oil issues requiring complete overhauling.`,
        recommendedPriceRange: { min: pricing.overhaulingMin, max: pricing.overhaulingMax },
        requiresInspectionNotice: true,
      };
    }
  }

  // Check Servicing
  for (const kw of servicingKeywords) {
    if (lower.includes(kw)) {
      return {
        category: 'servicing',
        confidence: 'high',
        reason: `Detected "${kw}": Symptoms match standard ignition, carburetor, fuel flow, or routine preventative maintenance.`,
        recommendedPriceRange: { min: pricing.servicingMin, max: pricing.servicingMax },
        requiresInspectionNotice: true,
      };
    }
  }

  // Department-specific fallbacks
  if (department === 'ac') {
    if (lower.includes('gas') || lower.includes('leak') || lower.includes('not cooling') || lower.includes('frost')) {
      return {
        category: 'repair',
        confidence: 'medium',
        reason: 'Refrigerant pressure, coil examination or electrical capacitor repair recommended.',
        recommendedPriceRange: { min: 10000, max: 20000 },
        requiresInspectionNotice: true,
      };
    }
    return {
      category: 'servicing',
      confidence: 'medium',
      reason: 'Standard chemical deep cleaning, fin washing & air filter servicing recommended.',
      recommendedPriceRange: { min: pricing.servicingMin, max: pricing.servicingMax },
      requiresInspectionNotice: true,
    };
  }

  if (department === 'sumo') {
    if (lower.includes('stuck') || lower.includes('tripping') || lower.includes('no water') || lower.includes('humming')) {
      return {
        category: 'overhauling',
        confidence: 'medium',
        reason: 'Sumo submersible pump impeller jam, motor rewinding, or mechanical seal overhaul recommended.',
        recommendedPriceRange: { min: pricing.overhaulingMin, max: pricing.overhaulingMax },
        requiresInspectionNotice: true,
      };
    }
    return {
      category: 'servicing',
      confidence: 'medium',
      reason: 'Control box inspection, capacitor test, and electrical continuity servicing recommended.',
      recommendedPriceRange: { min: pricing.servicingMin, max: pricing.servicingMax },
      requiresInspectionNotice: true,
    };
  }

  // Generic fallback if text is too brief
  return {
    category: 'servicing',
    confidence: 'medium',
    reason: 'Initial diagnostic & servicing booked. Full engine inspection will confirm final requirement.',
    recommendedPriceRange: { min: pricing.servicingMin, max: pricing.servicingMax },
    requiresInspectionNotice: true,
  };
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}
