import React from 'react';
import {
  Compass,
  Plane,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Receipt,
  Heart,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ExpenseChart } from '../components/ExpenseChart';
import { WeatherWidget } from '../components/WeatherWidget';

export const DashboardPage: React.FC = () => {
  const {
    trips,
    activeTrip,
    destinations,
    savedDestinationIds,
    expenses,
    userProfile,
    setCurrentView,
    navigateToDestination,
    navigateToItinerary,
    toggleFavoriteDestination,
  } = useTravel();

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const nextTrip = upcomingTrips[0] || trips[0];
  const nextTripDestination = destinations.find((d) => d.id === nextTrip?.destinationId) || destinations[0];

  // Calculate stats
  const totalBudgetManaged = trips.reduce((acc, t) => acc + (t.totalBudget || 0), 0);
  const totalExpensesSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Calculate days remaining to next trip
  const getDaysUntil = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = nextTrip ? getDaysUntil(nextTrip.startDate) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AI Travel Intelligence Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready for your next adventure, {userProfile.name.split(' ')[0]}?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              You have <span className="font-semibold text-white">{upcomingTrips.length} upcoming trips</span> on your radar. Kyoto departure is in {daysLeft} days. Explore fresh recommendations or tailor your daily schedule.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('trip-planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Trip</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => setCurrentView('my-trips')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Trips</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {trips.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{upcomingTrips.length} upcoming</span> • {trips.filter(t => t.status === 'completed').length} completed
          </div>
        </div>

        <div
          onClick={() => setCurrentView('saved-places')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-pink-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved Places</span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {savedDestinationIds.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Destinations on your wishlist
          </div>
        </div>

        <div
          onClick={() => setCurrentView('budget')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Budget Managed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ${totalBudgetManaged.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ${totalExpensesSpent.toLocaleString()} logged expenses
          </div>
        </div>

        <div
          onClick={() => setCurrentView('explore')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Global Database</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {destinations.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curated world destinations
          </div>
        </div>
      </div>

      {/* Featured Next Trip Showcase */}
      {nextTrip && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Upcoming Adventure • Depart in {daysLeft} days</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {nextTrip.title}
              </h3>
            </div>
            <button
              onClick={() => navigateToItinerary(nextTrip.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 hover:text-blue-600 text-xs font-bold transition-colors"
            >
              <span>View Full Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Cover & Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-inner group">
                <img
                  src={nextTrip.coverImage}
                  alt={nextTrip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{nextTrip.startDate} – {nextTrip.endDate}</span>
                    <span>•</span>
                    <Users className="w-3.5 h-3.5" />
                    <span>{nextTrip.travelers} Travelers ({nextTrip.travelerType})</span>
                  </div>
                  <div className="text-lg font-bold">{nextTrip.destinationName}, {nextTrip.country}</div>
                </div>
              </div>

              {/* Day 1 Quick Timeline preview */}
              {nextTrip.days.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-2.5 flex items-center justify-between">
                    <span>Day 1 Preview: {nextTrip.days[0].title}</span>
                    <span className="text-[11px] text-blue-600 font-medium">
                      {nextTrip.days[0].activities.length} activities planned
                    </span>
                  </div>
                  <div className="space-y-2">
                    {nextTrip.days[0].activities.slice(0, 3).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-blue-600 shrink-0">{act.time}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 ml-2">{act.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Weather & Budget preview */}
            <div className="lg:col-span-5 space-y-4">
              {nextTripDestination && (
                <WeatherWidget
                  weather={nextTripDestination.weather}
                  locationName={nextTrip.destinationName}
                />
              )}

              {/* Hotel booking card */}
              {nextTrip.hotels.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Confirmed Stay
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {nextTrip.hotels[0].name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {nextTrip.hotels[0].roomType} • ★ {nextTrip.hotels[0].rating}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      Booked
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Middle Grid: Expense Breakdown & Trending Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6: Budget Chart */}
        <div className="lg:col-span-6">
          <ExpenseChart
            expenses={expenses}
            totalBudget={totalBudgetManaged || 3500}
            currency={userProfile.currency}
          />
        </div>

        {/* Right 6: Trending Destinations to Discover */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hand-Picked Destinations
                </h3>
                <p className="text-xs text-slate-400">
                  Tailored to your love for {userProfile.travelInterests[0] || 'culture'} & {userProfile.travelInterests[1] || 'food'}
                </p>
              </div>
              <button
                onClick={() => setCurrentView('explore')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {destinations.slice(0, 3).map((dest) => {
                const isSaved = savedDestinationIds.includes(dest.id);
                return (
                  <div
                    key={dest.id}
                    onClick={() => navigateToDestination(dest.id)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {dest.name}
                          </h4>
                          <span className="text-[11px] text-amber-500 font-bold shrink-0">
                            ★ {dest.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {dest.country} • {dest.category}
                        </p>
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                          Avg. ${dest.avgCostPerDay}/day
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteDestination(dest.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-950/60 dark:border-pink-800'
                          : 'text-slate-400 hover:text-pink-600 border-slate-200 dark:border-slate-700'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-600' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('explore')}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
          >
            Explore All 8 World Destinations
          </button>
        </div>
      </div>
    </div>
  );
};
