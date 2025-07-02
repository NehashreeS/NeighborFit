import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ 
  onSubmit, 
  onBack, 
  loading = false,
  error = null
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 'medium',
    safetyImportance: 4,
    walkabilityImportance: 3,
    familyFriendly: false,
    quietEnvironment: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(preferences);
    }
  };

  const renderStarRating = (value: number, onChange: (value: number) => void, label: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            disabled={loading}
            className={`w-8 h-8 rounded-full transition-colors ${
              star <= value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {star}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {value === 1 && 'Not important'}
        {value === 2 && 'Slightly important'}
        {value === 3 && 'Moderately important'}
        {value === 4 && 'Very important'}
        {value === 5 && 'Extremely important'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              disabled={loading}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Preferences</h2>
            <p className="text-gray-600">Tell us what matters most to you in a neighborhood.</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Error finding matches</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Budget Range</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'low', label: 'Low', range: 'Under $1,200/month' },
                  { value: 'medium', label: 'Medium', range: '$1,200 - $2,000/month' },
                  { value: 'high', label: 'High', range: 'Over $2,000/month' }
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value={option.value}
                      checked={preferences.budget === option.value}
                      onChange={(e) => setPreferences({ ...preferences, budget: e.target.value as any })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.budget === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${loading ? 'opacity-50' : ''}`}>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.range}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Safety Importance */}
            {renderStarRating(
              preferences.safetyImportance,
              (value) => setPreferences({ ...preferences, safetyImportance: value }),
              'How important is safety to you?'
            )}

            {/* Walkability Importance */}
            {renderStarRating(
              preferences.walkabilityImportance,
              (value) => setPreferences({ ...preferences, walkabilityImportance: value }),
              'How important is walkability to you?'
            )}

            {/* Family Friendly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Family Considerations</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: true, label: 'Family-friendly', desc: 'Good schools, parks, safe for kids' },
                  { value: false, label: 'No preference', desc: 'Family amenities not a priority' }
                ].map((option) => (
                  <label key={option.value.toString()} className="cursor-pointer">
                    <input
                      type="radio"
                      name="familyFriendly"
                      checked={preferences.familyFriendly === option.value}
                      onChange={() => setPreferences({ ...preferences, familyFriendly: option.value })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.familyFriendly === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${loading ? 'opacity-50' : ''}`}>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quiet Environment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Environment Preference</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: true, label: 'Quiet & Peaceful', desc: 'Low noise levels, residential feel' },
                  { value: false, label: 'Vibrant & Lively', desc: 'Don\'t mind urban noise and activity' }
                ].map((option) => (
                  <label key={option.value.toString()} className="cursor-pointer">
                    <input
                      type="radio"
                      name="quietEnvironment"
                      checked={preferences.quietEnvironment === option.value}
                      onChange={() => setPreferences({ ...preferences, quietEnvironment: option.value })}
                      disabled={loading}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.quietEnvironment === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${loading ? 'opacity-50' : ''}`}>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Finding Your Perfect Neighborhoods...
                </>
              ) : (
                <>
                  Find My Perfect Neighborhoods
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};