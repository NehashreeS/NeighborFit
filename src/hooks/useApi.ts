/**
 * Custom React hooks for API interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, NeighborhoodMatch } from '../types';
import { 
  findNeighborhoodMatches, 
  getAllNeighborhoods, 
  checkApiHealth,
  validatePreferences,
  formatApiError,
  apiRequestWithRetry
} from '../services/api';

// Hook state types
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseMatchesResult extends ApiState<NeighborhoodMatch[]> {
  findMatches: (preferences: UserPreferences) => Promise<void>;
  clearMatches: () => void;
}

interface UseNeighborhoodsResult extends ApiState<any[]> {
  refetch: () => Promise<void>;
}

interface UseApiHealthResult extends ApiState<any> {
  isHealthy: boolean;
  checkHealth: () => Promise<void>;
}

/**
 * Hook for managing neighborhood matches
 */
export function useMatches(): UseMatchesResult {
  const [state, setState] = useState<ApiState<NeighborhoodMatch[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const findMatches = useCallback(async (preferences: UserPreferences) => {
    // Validate preferences first
    const validationError = validatePreferences(preferences);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiRequestWithRetry(
        () => findNeighborhoodMatches(preferences),
        3,
        1000
      );

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: formatApiError(response.error || 'Failed to find matches'),
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: formatApiError(error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  }, []);

  const clearMatches = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    findMatches,
    clearMatches,
  };
}

/**
 * Hook for managing all neighborhoods data
 */
export function useNeighborhoods(): UseNeighborhoodsResult {
  const [state, setState] = useState<ApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchNeighborhoods = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getAllNeighborhoods();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: formatApiError(response.error || 'Failed to fetch neighborhoods'),
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: formatApiError(error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchNeighborhoods();
  }, [fetchNeighborhoods]);

  return {
    ...state,
    refetch: fetchNeighborhoods,
  };
}

/**
 * Hook for API health monitoring
 */
export function useApiHealth(): UseApiHealthResult {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const [isHealthy, setIsHealthy] = useState(false);

  const checkHealth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await checkApiHealth();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        setIsHealthy(response.data.status === 'healthy');
      } else {
        setState({
          data: null,
          loading: false,
          error: formatApiError(response.error || 'Health check failed'),
        });
        setIsHealthy(false);
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: formatApiError(error instanceof Error ? error.message : 'Unknown error'),
      });
      setIsHealthy(false);
    }
  }, []);

  // Auto-check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    ...state,
    isHealthy,
    checkHealth,
  };
}

/**
 * Hook for managing loading states across multiple API calls
 */
export function useApiLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  return { setLoading, isLoading };
}

/**
 * Hook for API error handling with user-friendly messages
 */
export function useApiError() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = useCallback((key: string, error: string | null) => {
    setErrors(prev => {
      if (error === null) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: formatApiError(error) };
    });
  }, []);

  const clearError = useCallback((key: string) => {
    setError(key, null);
  }, [setError]);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getError = useCallback((key: string) => {
    return errors[key] || null;
  }, [errors]);

  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    setError,
    clearError,
    clearAllErrors,
    getError,
    hasErrors,
    errors,
  };
}