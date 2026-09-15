import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Destination } from '../types';

export const TripPlannerPage: React.FC = () => {
  const { destinations, addTrip, setCurrentView, navigateToItinerary } = useTravel();

  const [destinationName, setDestinationName] = useState('Kyoto');
  const [country, setCountry] = useState('Japan');
  const [title, setTitle] = useState('Kyoto Cultural Escape');
  const [startDate, setStartDate] = useState('2026-10-18');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [travelers, setTravelers] = useState(2);
  const [travelerType, setTravelerType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');
  const [budget, setBudget] = useState(2500);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & Temples',
    'Local Food & Gastronomy',
    'Scenic Photography',
  ]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const availableInterests = [
    'Culture & Temples',
    'Local Food & Gastronomy',
    'Scenic Photography',
    'Hiking & Nature',
    'Beaches & Watersports',
    'Shopping & Markets',
    'Nightlife & Bars',
    'Wellness & Spas',
  ];

  const calculateDays = () => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 4;
    return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleSelectPopularDestination = (dest: Destination) => {
    setDestinationName(dest.name);
    setCountry(dest.country);
    setTitle(`Journey to ${dest.name}`);
    setBudget(dest.avgCostPerDay * calculateDays() * travelers);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const daysCount = calculateDays();
    const destination = destinations.find(
      (d) => d.name.toLowerCase() === destinationName.toLowerCase()
    );

    const generatedDays = Array.from({ length: daysCount }).map((_, idx) => {
      const d = new Date(new Date(startDate).getTime() + idx * 86400000)
        .toISOString()
        .split('T')[0];
      return {
        id: `day-${Date.now()}-${idx + 1}`,
        dayNumber: idx + 1,
        date: d,
        title: idx === 0 ? 'Arrival & Welcome Orientation' : `Day ${idx + 1}: Highlights & Exploration`,
        theme: idx === 0 ? 'Arrival' : 'Exploration',
        activities: [
          {
            id: `act-${Date.now()}-${idx}-1`,
            time: '09:30 AM',
            title: `Morning Discovery in ${destinationName}`,
            location: `${destinationName} Landmark`,
            category: 'Sightseeing' as const,
            cost: 20,
            duration: '2 hours',
            notes: 'Take photographs and stroll through local markets.',
            completed: false,
          },
          {
            id: `act-${Date.now()}-${idx}-2`,
            time: '01:00 PM',
            title: 'Authentic Regional Lunch',
            location: 'Local Specialty Restaurant',
            category: 'Food & Drink' as const,
            cost: 35,
            duration: '1.5 hours',
            notes: 'Sample local culinary specialties.',
            completed: false,
          },
        ],
      };
    });

    const newTrip = addTrip({
      title,
      destinationName,
      country,
      destinationId: destination?.id,
      coverImage: destination?.imageUrl,
      startDate,
      endDate,
      travelers,
      travelerType,
      totalBudget: budget,
      currency: 'USD',
      days: generatedDays,
      status: 'upcoming',
    });

    navigateToItinerary(newTrip.id);
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
    const daysCount = calculateDays();

    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: `${destinationName}, ${country}`,
          days: daysCount,
          style: travelStyle,
          budget: budget > 3000 ? 'Luxury' : budget < 1200 ? 'Budget' : 'Moderate',
          interests: selectedInterests,
        }),
      });

      const data = await res.json();

      const destination = destinations.find(
        (d) => d.name.toLowerCase() === destinationName.toLowerCase()
      );

      // Convert generated AI days to trip format
      const days = (data.days || []).map((d: any, idx: number) => {
        const dateStr = new Date(new Date(startDate).getTime() + idx * 86400000)
          .toISOString()
          .split('T')[0];
        return {
          id: `day-${Date.now()}-${idx + 1}`,
          dayNumber: idx + 1,
          date: dateStr,
          title: d.theme || `Day ${idx + 1}: ${destinationName} Highlights`,
          theme: d.theme,
          activities: (d.activities || []).map((a: any, aIdx: number) => ({
            id: `act-${Date.now()}-${idx}-${aIdx}`,
            time: a.time || '10:00 AM',
            title: a.title || 'Sightseeing Tour',
            location: a.location || destinationName,
            category: (a.type?.includes('Food') ? 'Food & Drink' : a.type?.includes('Culture') ? 'Culture' : 'Sightseeing') as any,
            cost: parseInt(a.cost?.replace(/[^0-9]/g, '') || '25', 10),
            duration: a.duration || '2 hours',
            notes: a.description || '',
            completed: false,
          })),
        };
      });

      const newTrip = addTrip({
        title,
        destinationName,
        country,
        destinationId: destination?.id,
        coverImage: destination?.imageUrl,
        startDate,
        endDate,
        travelers,
        travelerType,
        totalBudget: budget,
        currency: 'USD',
        days,
        packingList: (data.packingTips || []).map((tip: string, idx: number) => ({
          id: `pack-${idx}`,
          item: tip,
          category: 'Clothing' as const,
          packed: false,
        })),
        status: 'upcoming',
      });

      navigateToItinerary(newTrip.id);
    } catch (err: any) {
      console.error('AI itinerary error:', err);
      setAiError('Could not reach AI model. Creating structured standard itinerary instead.');
      // Fallback: create manual
      handleSubmitManual({ preventDefault: () => {} } as any);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Trip Architect</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create & Plan a New Trip
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your travel parameters or let our AI concierge auto-generate your complete day-by-day itinerary with verified timings and local hotspots.
        </p>
      </div>

      {/* Quick Select Popular Destinations */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or Choose from Popular Destinations
          </span>
          <span className="text-[11px] text-blue-600 font-semibold cursor-pointer" onClick={() => setCurrentView('explore')}>
            Browse full catalog
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {destinations.slice(0, 5).map((dest) => (
            <button
              key={dest.id}
              onClick={() => handleSelectPopularDestination(dest)}
              className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left shrink-0 transition-all ${
                destinationName.toLowerCase() === dest.name.toLowerCase()
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <img src={dest.imageUrl} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{dest.name}</div>
                <div className="text-[10px] text-slate-400">{dest.country}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmitManual} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Destination & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Destination City & Country
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Kyoto, Positano, Banff..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Trip Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autumn Serenity in Kyoto"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              End Date ({calculateDays()} Days Trip)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Travelers & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={1}
                max={16}
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Travel Party Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Solo', 'Couple', 'Family', 'Friends'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTravelerType(type)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    travelerType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget & Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total Target Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                step={50}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Preferred Travel Pace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Relaxed', 'Balanced', 'Fast-Paced'].map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setTravelStyle(style)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    travelStyle === style
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Travel Interests & Priorities
          </label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {aiError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Create Empty Trip & Add Manually
          </button>

          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={handleGenerateWithAI}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating {calculateDays()}-Day Itinerary with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Auto-Generate Full Itinerary with AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
