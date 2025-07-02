import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApiStatus } from './components/ApiStatus';
import { LandingPage } from './components/LandingPage';
import { PreferencesForm } from './components/PreferencesForm';
import { ResultsPage } from './components/ResultsPage';
import { UserPreferences, NeighborhoodMatch } from './types';
import { useMatches } from './hooks/useApi';

type AppState = 'landing' | 'preferences' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const { data: matches, loading, error, findMatches, clearMatches } = useMatches();

  const handleGetStarted = () => {
    setCurrentPage('preferences');
  };

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    await findMatches(preferences);
    if (!error) {
      setCurrentPage('results');
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    clearMatches();
  };

  const handleBackToPreferences = () => {
    setCurrentPage('preferences');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'preferences':
        return (
          <PreferencesForm
            onSubmit={handlePreferencesSubmit}
            onBack={handleBackToLanding}
            loading={loading}
            error={error}
          />
        );
      case 'results':
        return (
          <ResultsPage
            matches={matches || []}
            onBack={handleBackToPreferences}
            onStartOver={handleBackToLanding}
            loading={loading}
            error={error}
          />
        );
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {/* API Status Indicator */}
        <div className="fixed top-4 right-4 z-50">
          <ApiStatus showDetails />
        </div>
        
        {renderCurrentPage()}
      </div>
    </ErrorBoundary>
  );
}

export default App;