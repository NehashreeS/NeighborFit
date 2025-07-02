import React from 'react';
import { NeighborhoodMatch } from '../types';
import { ArrowLeft, MapPin, DollarSign, Shield, Footprints, Users, Volume2, AlertCircle, Loader2 } from 'lucide-react';

interface ResultsPageProps {
  matches: NeighborhoodMatch[];
  onBack: () => void;
  onStartOver: () => void;
  loading?: boolean;
  error?: string | null;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ 
  matches, 
  onBack, 
  onStartOver, 
  loading = false,
  error = null
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rent);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preferences
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Neighborhoods</h3>
            <p className="text-gray-600">Analyzing your preferences and matching with available neighborhoods...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preferences
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Find Matches</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={onBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Different Preferences
                </button>
                <button
                  onClick={onStartOver}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors ml-3"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No matches state
  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preferences
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any neighborhoods that match your current preferences. 
              Try adjusting your criteria to see more options.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Adjust Preferences
              </button>
              <button
                onClick={onStartOver}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors ml-3"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results display
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preferences
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Top Matches</h2>
              <p className="text-gray-600">Here are the neighborhoods that best fit your preferences.</p>
            </div>
            <button
              onClick={onStartOver}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {matches.map((match, index) => (
            <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{match.name}</h3>
                      <p className="text-gray-600">{match.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(match.matchScore)}`}>
                      {match.matchScore}% Match
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getScoreLabel(match.matchScore)}</p>
                  </div>
                </div>

                {/* Match Reasons */}
                {match.matchReasons && match.matchReasons.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Why this neighborhood fits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.matchReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-900">{formatRent(match.avgRent)}</div>
                    <div className="text-xs text-gray-500">Avg Rent</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-900">{match.safetyScore.toFixed(1)}/5</div>
                    <div className="text-xs text-gray-500">Safety</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Footprints className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-900">{match.walkabilityScore.toFixed(1)}/5</div>
                    <div className="text-xs text-gray-500">Walkability</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-900">{match.familyFriendlyScore.toFixed(1)}/5</div>
                    <div className="text-xs text-gray-500">Family</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Volume2 className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-900">{match.noiseLevel.toFixed(1)}/5</div>
                    <div className="text-xs text-gray-500">Noise Level</div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Neighborhood Highlights:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {match.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to explore different options? Try adjusting your preferences.
          </p>
          <button
            onClick={onStartOver}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Find More Neighborhoods
          </button>
        </div>
      </div>
    </div>
  );
};