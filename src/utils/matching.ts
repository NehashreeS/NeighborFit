import { UserPreferences, Neighborhood, NeighborhoodMatch } from '../types';
import { neighborhoodData } from '../data/neighborhoods';

const getBudgetRange = (budget: string): [number, number] => {
  switch (budget) {
    case 'low': return [0, 1200];
    case 'medium': return [1200, 2000];
    case 'high': return [2000, Infinity];
    default: return [0, Infinity];
  }
};

const calculateBudgetScore = (rent: number, budget: string): number => {
  const [min, max] = getBudgetRange(budget);
  if (rent >= min && rent <= max) return 1.0;
  if (rent < min) return Math.max(0.5, 1 - (min - rent) / min);
  return Math.max(0, 1 - (rent - max) / max);
};

const normalizeScore = (score: number, maxValue: number = 5): number => {
  return Math.min(score / maxValue, 1);
};

export const findMatchingNeighborhoods = (preferences: UserPreferences): NeighborhoodMatch[] => {
  const matches: NeighborhoodMatch[] = neighborhoodData.map(neighborhood => {
    const budgetScore = calculateBudgetScore(neighborhood.avgRent, preferences.budget);
    const safetyScore = normalizeScore(neighborhood.safetyScore) * (preferences.safetyImportance / 5);
    const walkabilityScore = normalizeScore(neighborhood.walkabilityScore) * (preferences.walkabilityImportance / 5);
    const familyScore = preferences.familyFriendly 
      ? normalizeScore(neighborhood.familyFriendlyScore) * 0.8
      : 0.5;
    const quietScore = preferences.quietEnvironment 
      ? (1 - normalizeScore(neighborhood.noiseLevel)) * 0.7
      : 0.5;

    const totalScore = (budgetScore * 0.3) + (safetyScore * 0.25) + (walkabilityScore * 0.2) + (familyScore * 0.15) + (quietScore * 0.1);
    const matchScore = Math.round(totalScore * 100);

    const matchReasons: string[] = [];
    if (budgetScore > 0.8) matchReasons.push('Great budget fit');
    if (safetyScore > 0.7) matchReasons.push('Excellent safety rating');
    if (walkabilityScore > 0.7) matchReasons.push('Highly walkable');
    if (preferences.familyFriendly && neighborhood.familyFriendlyScore > 4.0) {
      matchReasons.push('Very family-friendly');
    }
    if (preferences.quietEnvironment && neighborhood.noiseLevel < 3.0) {
      matchReasons.push('Peaceful environment');
    }

    return {
      ...neighborhood,
      matchScore,
      matchReasons
    };
  });

  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
};