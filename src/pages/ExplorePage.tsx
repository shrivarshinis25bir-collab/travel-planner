import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Heart,
  Calendar,
  DollarSign,
  ArrowRight,
  Plus,
  CloudSun,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Destination } from '../types';

export const ExplorePage: React.FC = () => {
  const {
    destinations,
    savedDestinationIds,
    toggleFavoriteDestination,
    navigateToDestination,
    setCurrentView,
    addTrip,
  } = useTravel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'cost-low' | 'cost-high' | 'name'>('rating');

  const continents = ['All', 'Asia', 'Europe', 'North America', 'Africa'];
  const categories = [
    'All',
    'Cultural & Historic',
    'Beaches & Coastal',
    'Mountain & Nature',
    'Urban & Modern',
    'Adventure',
  ];

  // Filtered and sorted destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const matchesQuery =
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesContinent =
          selectedContinent === 'All' || dest.continent === selectedContinent;

        const matchesCategory =
          selectedCategory === 'All' || dest.category === selectedCategory;

        return matchesQuery && matchesContinent && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'cost-low') return a.avgCostPerDay - b.avgCostPerDay;
        if (sortBy === 'cost-high') return b.avgCostPerDay - a.avgCostPerDay;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [destinations, searchQuery, selectedContinent, selectedCategory, sortBy]);

  const handleQuickPlan = (dest: Destination) => {
    addTrip({
      destinationName: dest.name,
      country: dest.country,
      destinationId: dest.id,
      title: `Adventure in ${dest.name}`,
      coverImage: dest.imageUrl,
      totalBudget: dest.avgCostPerDay * 5,
    });
    setCurrentView('itinerary');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore world-class locations with real-time weather, estimated daily budgets, and verified attractions.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('ai-assistant')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Need AI recommendations?</span>
        </button>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, country, or tag (e.g. Zen, Hiking, Wine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-auto px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="rating">Top Rated (★)</option>
              <option value="cost-low">Budget: Low to High</option>
              <option value="cost-high">Budget: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Continent Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-400 mr-1 shrink-0">Region:</span>
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                selectedContinent === continent
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-400 mr-1 shrink-0">Vibe:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching destinations found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedContinent('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => {
            const isSaved = savedDestinationIds.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-sm">
                        {dest.category}
                      </span>
                    </div>

                    {/* Heart Button */}
                    <button
                      onClick={() => toggleFavoriteDestination(dest.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                        isSaved
                          ? 'bg-white text-pink-600 shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-600' : ''}`} />
                    </button>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold tracking-tight drop-shadow-sm">
                            {dest.name}
                          </h3>
                          <div className="text-xs text-slate-200 drop-shadow-sm">
                            {dest.country} • {dest.continent}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{dest.rating}</span>
                          <span className="text-[10px] text-slate-300 font-normal">
                            ({dest.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Weather & Avg Cost Chips */}
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CloudSun className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold">{dest.weather.tempC}°C</span>
                        <span className="text-slate-400 font-normal">{dest.weather.condition}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        ${dest.avgCostPerDay}
                        <span className="text-[10px] text-slate-400 font-normal"> / day</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {dest.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigateToDestination(dest.id)}
                    className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Guide & Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleQuickPlan(dest)}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan Trip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
