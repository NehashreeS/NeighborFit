import React from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useApiHealth } from '../hooks/useApi';

interface ApiStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const { data, loading, error, isHealthy, checkHealth } = useApiHealth();

  const getStatusIcon = () => {
    if (loading) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (isHealthy) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    if (isHealthy) return 'API Connected';
    if (error) return 'API Disconnected';
    return 'Unknown Status';
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (isHealthy) return 'text-green-600';
    if (error) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {showDetails && data && (
        <span className="text-xs text-gray-500">
          ({data.neighborhoods_loaded} neighborhoods)
        </span>
      )}
      
      {!loading && (
        <button
          onClick={checkHealth}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
      
      {error && showDetails && (
        <div className="text-xs text-red-500 max-w-xs truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};