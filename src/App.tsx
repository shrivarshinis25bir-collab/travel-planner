import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BudgetPage } from './pages/BudgetPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { Bot, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView } = useTravel();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'explore':
        return <ExplorePage />;
      case 'destination-details':
        return <DestinationDetailsPage />;
      case 'my-trips':
        return <MyTripsPage />;
      case 'trip-planner':
        return <TripPlannerPage />;
      case 'itinerary':
        return <ItineraryPage />;
      case 'budget':
        return <BudgetPage />;
      case 'saved-places':
        return <SavedPlacesPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Navbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating AI Concierge Quick Trigger (visible when not on AI Assistant page) */}
      {currentView !== 'ai-assistant' && (
        <button
          onClick={() => setCurrentView('ai-assistant')}
          id="floating-ai-button"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all group"
          aria-label="Ask AI Travel Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline">Ask WanderBot</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <MainLayout />
    </TravelProvider>
  );
}
