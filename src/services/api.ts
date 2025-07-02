/**
 * API service for NeighborFit frontend
 * Handles communication with the Flask backend
 */

import { UserPreferences, NeighborhoodMatch } from '../types';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface MatchResponse {
  success: boolean;
  matches: NeighborhoodMatch[];
  total_neighborhoods: number;
}

interface NeighborhoodResponse {
  neighborhoods: any[];
  count: number;
}

interface HealthResponse {
  status: string;
  neighborhoods_loaded: number;
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Find neighborhood matches based on user preferences
 */
export async function findNeighborhoodMatches(
  preferences: UserPreferences
): Promise<ApiResponse<NeighborhoodMatch[]>> {
  const response = await apiRequest<MatchResponse>('/match', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });

  if (response.success && response.data) {
    return {
      success: true,
      data: response.data.matches
    };
  }

  return response as ApiResponse<NeighborhoodMatch[]>;
}

/**
 * Get all available neighborhoods
 */
export async function getAllNeighborhoods(): Promise<ApiResponse<any[]>> {
  const response = await apiRequest<NeighborhoodResponse>('/neighborhoods');
  
  if (response.success && response.data) {
    return {
      success: true,
      data: response.data.neighborhoods
    };
  }

  return response as ApiResponse<any[]>;
}

/**
 * Check API health status
 */
export async function checkApiHealth(): Promise<ApiResponse<HealthResponse>> {
  return apiRequest<HealthResponse>('/health');
}

/**
 * Test API connection
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await checkApiHealth();
    return response.success;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

/**
 * Retry mechanism for API requests
 */
export async function apiRequestWithRetry<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await requestFn();
    
    if (response.success) {
      return response;
    }

    lastError = response.error || 'Unknown error';
    
    if (attempt < maxRetries) {
      console.warn(`API request attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts. Last error: ${lastError}`
  };
}

/**
 * Validate user preferences before sending to API
 */
export function validatePreferences(preferences: UserPreferences): string | null {
  if (!preferences.budget || !['low', 'medium', 'high'].includes(preferences.budget)) {
    return 'Invalid budget selection';
  }

  if (!Number.isInteger(preferences.safetyImportance) || 
      preferences.safetyImportance < 1 || 
      preferences.safetyImportance > 5) {
    return 'Safety importance must be between 1 and 5';
  }

  if (!Number.isInteger(preferences.walkabilityImportance) || 
      preferences.walkabilityImportance < 1 || 
      preferences.walkabilityImportance > 5) {
    return 'Walkability importance must be between 1 and 5';
  }

  if (typeof preferences.familyFriendly !== 'boolean') {
    return 'Family friendly preference must be true or false';
  }

  if (typeof preferences.quietEnvironment !== 'boolean') {
    return 'Quiet environment preference must be true or false';
  }

  return null;
}

/**
 * Format API errors for user display
 */
export function formatApiError(error: string): string {
  // Common error mappings
  const errorMappings: Record<string, string> = {
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'NetworkError': 'Network error occurred. Please try again.',
    'TimeoutError': 'Request timed out. Please try again.',
  };

  // Check for mapped errors
  for (const [key, message] of Object.entries(errorMappings)) {
    if (error.includes(key)) {
      return message;
    }
  }

  // Return original error if no mapping found
  return error;
}

// Export API configuration for use in other modules
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
};