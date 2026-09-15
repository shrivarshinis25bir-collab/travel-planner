import React, { useState } from 'react';
import {
  Heart,
  Star,
  Plus,
  ArrowRight,
  Compass,
  MapPin,
  CloudSun,
  Trash2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const SavedPlacesPage: React.FC = () => {
  const {
    destinations,
    savedDestinationIds,
    toggleFavoriteDestination,
    navigateToDestination,
    addTrip,
    setCurrentView,
  } = useTravel();

  const [categoryFilter, setCategoryFilter] = useState('All');

  const savedDestinations = destinations.filter((d) =>
    savedDestinationIds.includes(d.id)
  );

  const filtered = savedDestinations.filter((d) =>
    categoryFilter === 'All' ? true : d.category === categoryFilter
  );

  const handlePlanFromSaved = (dest: any) => {
    addTrip({
      destinationName: dest.name,
      country: dest.country,
      destinationId: dest.id,
      title: `Dream Holiday in ${dest.name}`,
      coverImage: dest.imageUrl,
      totalBudget: dest.avgCostPerDay * 5,
    });
    setCurrentView('itinerary');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span>Saved Places & Wishlist</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your collection of curated dream destinations ready to be turned into concrete itineraries.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('explore')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Places</span>
        </button>
      </div>

      {savedDestinations.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your travel wishlist is empty
          </h3>
          <p className="text-xs text-slate-400">
            Browse our catalog of world destinations and click the heart icon to save places you want to visit.
          </p>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
          >
            Discover Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={() => toggleFavoriteDestination(dest.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-pink-600 hover:bg-white transition-transform active:scale-95 shadow-md"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-extrabold">{dest.name}</h3>
                    <div className="text-xs text-slate-200">
                      {dest.country} • {dest.category}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Avg. ${dest.avgCostPerDay}/day
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateToDestination(dest.id)}
                  className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center"
                >
                  View Guide
                </button>
                <button
                  onClick={() => handlePlanFromSaved(dest)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-sm"
                >
                  Plan Trip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
