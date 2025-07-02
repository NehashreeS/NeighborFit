export interface UserPreferences {
  budget: 'low' | 'medium' | 'high';
  safetyImportance: number;
  walkabilityImportance: number;
  familyFriendly: boolean;
  quietEnvironment: boolean;
}

export interface Neighborhood {
  id: string;
  name: string;
  avgRent: number;
  safetyScore: number;
  walkabilityScore: number;
  familyFriendlyScore: number;
  noiseLevel: number;
  description: string;
  highlights: string[];
}

export interface NeighborhoodMatch extends Neighborhood {
  matchScore: number;
  matchReasons: string[];
}