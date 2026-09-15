import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  DollarSign,
  MapPin,
  Utensils,
  Sparkles,
  Compass,
  Check,
  Share2,
  Plus,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { WeatherWidget } from '../components/WeatherWidget';

export const DestinationDetailsPage: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setCurrentView,
    savedDestinationIds,
    toggleFavoriteDestination,
    addTrip,
  } = useTravel();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const destination =
    destinations.find((d) => d.id === selectedDestinationId) || destinations[0];

  const isSaved = savedDestinationIds.includes(destination.id);

  // Synthesize interactive map points from top attractions
  const mapPoints = destination.topAttractions.map((att, idx) => ({
    id: `map-${idx}`,
    name: att.name,
    category: att.type,
    x: 25 + idx * 18 + (idx % 2 === 0 ? 5 : -5),
    y: 30 + (idx * 15) % 45,
    description: att.description,
  }));

  const handleCreateTrip = () => {
    addTrip({
      destinationName: destination.name,
      country: destination.country,
      destinationId: destination.id,
      title: `Grand Tour of ${destination.name}`,
      coverImage: destination.imageUrl,
      totalBudget: destination.avgCostPerDay * 5,
    });
    setCurrentView('itinerary');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('explore')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleFavoriteDestination(destination.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isSaved
                ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-950/60 dark:border-pink-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-pink-600' : ''}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save'}</span>
          </button>

          <button
            onClick={handleCreateTrip}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Trip Here</span>
          </button>
        </div>
      </div>

      {/* Main Photographic Header Gallery */}
      <div className="space-y-3">
        <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-md">
          <img
            src={destination.gallery[activePhotoIndex] || destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Floating Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>{destination.category} • {destination.continent}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {destination.name}, {destination.country}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl mt-1 line-clamp-2">
                {destination.description}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-base">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{destination.rating}</span>
              </div>
              <div className="text-left text-xs border-l border-white/20 pl-3">
                <div className="font-bold">${destination.avgCostPerDay} USD</div>
                <div className="text-slate-300 text-[10px]">Estimated / day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {destination.gallery.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {destination.gallery.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoIndex === idx
                    ? 'border-blue-600 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Overview, Map, Weather & Attractions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column 7: Attractions & Interactive Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Map */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Landmarks & Route Map</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click pins for details</span>
            </div>
            <InteractiveMap
              centerTitle={destination.name}
              points={mapPoints}
              showRouteLine={true}
            />
          </div>

          {/* Top Attractions List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Must-See Attractions</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {destination.topAttractions.map((att, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{att.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {att.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                      {att.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{att.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Dishes / Food Scene */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span>Culinary Specialties & Regional Dishes</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {destination.localDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="text-amber-500 font-bold">🍴</span>
                  <span>{dish}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column 5: Weather, Travel Info, AI Prompt Trigger */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget weather={destination.weather} locationName={destination.name} />

          {/* Best Time & Travel Quick Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Travel Essentials
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Best Season</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {destination.bestTimeToVisit}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <DollarSign className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Daily Cost Level</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Approx. ${destination.avgCostPerDay} USD / day ({destination.currency}) covers mid-tier boutique lodging, dining, and transit.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Itinerary Co-pilot Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Trip Builder</span>
            </div>
            <h4 className="text-lg font-bold">
              Generate a Tailored Itinerary for {destination.name}
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Let WanderBot create a personalized morning-to-night itinerary tailored to your schedule, dietary preferences, and travel pace.
            </p>
            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="w-full py-2.5 rounded-xl bg-white text-blue-900 text-xs font-extrabold hover:bg-blue-50 transition-colors shadow-md"
            >
              Ask AI to Plan {destination.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
