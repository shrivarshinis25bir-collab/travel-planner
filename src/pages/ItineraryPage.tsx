import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Building,
  Plane,
  Sparkles,
  Luggage,
  Map as MapIcon,
  ListOrdered,
  AlertCircle,
  Loader2,
  Compass,
  Edit2,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Activity, ActivityCategory } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { WeatherWidget } from '../components/WeatherWidget';

export const ItineraryPage: React.FC = () => {
  const {
    activeTrip,
    destinations,
    addActivityToDay,
    deleteActivity,
    toggleActivityCompleted,
    togglePackingItem,
    addPackingItem,
    setCurrentView,
  } = useTravel();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'schedule' | 'hotels-transport' | 'packing' | 'map'>('schedule');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  // New activity form state
  const [newActTime, setNewActTime] = useState('11:00 AM');
  const [newActTitle, setNewActTitle] = useState('');
  const [newActLocation, setNewActLocation] = useState('');
  const [newActCategory, setNewActCategory] = useState<ActivityCategory>('Sightseeing');
  const [newActCost, setNewActCost] = useState(25);
  const [newActDuration, setNewActDuration] = useState('2 hours');
  const [newActNotes, setNewActNotes] = useState('');

  // New packing item state
  const [newPackingText, setNewPackingText] = useState('');

  if (!activeTrip) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-xl mx-auto">
        <Plane className="w-12 h-12 text-blue-600 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active trip selected</h3>
        <p className="text-xs text-slate-500">
          Please select an existing trip from the navigation bar or create a new trip itinerary.
        </p>
        <button
          onClick={() => setCurrentView('trip-planner')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Plan a New Trip
        </button>
      </div>
    );
  }

  const destination =
    destinations.find((d) => d.id === activeTrip.destinationId) || destinations[0];

  const currentDay = activeTrip.days[selectedDayIndex] || activeTrip.days[0];

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim() || !currentDay) return;

    addActivityToDay(activeTrip.id, currentDay.dayNumber, {
      time: newActTime,
      title: newActTitle,
      location: newActLocation || activeTrip.destinationName,
      category: newActCategory,
      cost: Number(newActCost) || 0,
      duration: newActDuration,
      notes: newActNotes,
      completed: false,
    });

    setNewActTitle('');
    setNewActLocation('');
    setNewActNotes('');
    setShowAddActivityModal(false);
  };

  const handleAddPackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingText.trim()) return;
    addPackingItem(activeTrip.id, newPackingText.trim(), 'Essentials');
    setNewPackingText('');
  };

  const handleOptimizeItinerary = async () => {
    if (!currentDay) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daySchedule: currentDay,
          destination: activeTrip.destinationName,
        }),
      });
      const data = await res.json();
      setOptimizationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const mapPoints = (currentDay?.activities || []).map((act, idx) => ({
    id: act.id,
    name: act.title,
    category: act.category,
    x: 20 + idx * 22 + (idx % 2 === 0 ? 5 : -4),
    y: 28 + ((idx * 18) % 45),
    description: `${act.time} • ${act.location}`,
  }));

  const getCategoryBadgeClass = (category: ActivityCategory) => {
    switch (category) {
      case 'Sightseeing':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'Food & Drink':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Culture':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Transport':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300';
      case 'Relaxation':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={activeTrip.coverImage}
            alt={activeTrip.title}
            className="w-20 h-20 rounded-2xl object-cover shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {activeTrip.destinationName}, {activeTrip.country}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                {activeTrip.days.length} Days
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {activeTrip.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {activeTrip.startDate} → {activeTrip.endDate}
              </span>
              <span>•</span>
              <span>{activeTrip.travelers} Travelers ({activeTrip.travelerType})</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddActivityModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Day-by-Day Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('hotels-transport')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'hotels-transport'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Hotels & Transport ({activeTrip.hotels.length + (activeTrip.transportations?.length || 0)})</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'packing'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Luggage className="w-4 h-4" />
          <span>Packing Checklist ({activeTrip.packingList.filter(p => p.packed).length}/{activeTrip.packingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'map'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Route & Map View</span>
        </button>
      </div>

      {/* TAB 1: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8: Day Selector & Activity Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Day Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {activeTrip.days.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => {
                    setSelectedDayIndex(idx);
                    setOptimizationResult(null);
                  }}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-2xl text-xs transition-all shrink-0 ${
                    selectedDayIndex === idx
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Day {day.dayNumber}</span>
                  <span className="font-extrabold">{day.date.split('-').slice(1).join('/')}</span>
                </button>
              ))}
            </div>

            {/* Current Day Header & AI Optimize */}
            {currentDay && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Day {currentDay.dayNumber} • {currentDay.theme || 'Exploration'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentDay.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={isOptimizing}
                    onClick={handleOptimizeItinerary}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>AI Route Optimizer</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowAddActivityModal(true)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    title="Add activity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* AI Optimization Feedback Card */}
            {optimizationResult && (
              <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Schedule Analysis & Suggestions</span>
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
                  {optimizationResult.recommendations}
                </p>
                {optimizationResult.transitEstimate && (
                  <div className="text-xs text-indigo-700 dark:text-indigo-300">
                    Estimated Transit Time: <span className="font-bold">{optimizationResult.transitEstimate}</span>
                  </div>
                )}
              </div>
            )}

            {/* Activities Timeline */}
            <div className="space-y-3">
              {currentDay?.activities.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500 mb-3">No activities scheduled for this day yet.</p>
                  <button
                    onClick={() => setShowAddActivityModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                  >
                    Add First Activity
                  </button>
                </div>
              ) : (
                currentDay?.activities.map((act) => (
                  <div
                    key={act.id}
                    className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-start gap-4 ${
                      act.completed
                        ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50'
                        : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40'
                    }`}
                  >
                    {/* Complete check button */}
                    <button
                      onClick={() => toggleActivityCompleted(activeTrip.id, currentDay.dayNumber, act.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                    >
                      {act.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Time & Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                          {act.time}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeClass(
                            act.category
                          )}`}
                        >
                          {act.category}
                        </span>
                        {act.cost > 0 && (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            ${act.cost}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">• {act.duration}</span>
                      </div>

                      <h4
                        className={`text-sm font-bold text-slate-900 dark:text-white ${
                          act.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {act.title}
                      </h4>

                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.location}</span>
                      </div>

                      {act.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 leading-relaxed">
                          {act.notes}
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteActivity(activeTrip.id, currentDay.dayNumber, act.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                      title="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right 4: Weather & Day Summary Widget */}
          <div className="lg:col-span-4 space-y-6">
            {destination && (
              <WeatherWidget weather={destination.weather} locationName={activeTrip.destinationName} />
            )}

            {/* Day Map Preview */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Day Map Route
                </span>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Expand map
                </button>
              </div>
              <InteractiveMap
                centerTitle={`Day ${currentDay?.dayNumber || 1} Route`}
                points={mapPoints}
                showRouteLine={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTELS & TRANSPORT */}
      {activeTab === 'hotels-transport' && (
        <div className="space-y-6">
          {/* Hotels */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Accommodation & Lodging</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {activeTrip.hotels.length} Stays
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTrip.hotels.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{h.name}</h4>
                      <p className="text-xs text-slate-500">{h.address}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-500">★ {h.rating}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <span className="text-slate-400">Check-in:</span> {h.checkIn}
                    </div>
                    <div>
                      <span className="text-slate-400">Check-out:</span> {h.checkOut}
                    </div>
                    <div>
                      <span className="text-slate-400">Room:</span> {h.roomType}
                    </div>
                    <div>
                      <span className="text-slate-400">Total:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-white">${h.totalCost}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Ref: {h.confirmationCode || 'CONFIRMED'}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                      {h.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-indigo-600" />
              <span>Transportation & Transfers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeTrip.transportations || []).map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {t.type} • {t.provider}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">${t.cost}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold py-1">
                    <div>{t.departure} ({t.departureTime})</div>
                    <span className="text-slate-400">→</span>
                    <div>{t.arrival} ({t.arrivalTime})</div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Ref: {t.reference}</span>
                    <span>Status: {t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PACKING CHECKLIST */}
      {activeTab === 'packing' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Luggage & Packing Checklist
            </h3>
            <p className="text-xs text-slate-400">
              Never forget an essential passport, charger, or medication. Check off items as you pack.
            </p>
          </div>

          {/* Add custom item */}
          <form onSubmit={handleAddPackingSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Add item (e.g. Travel Adapter, Rain Jacket)..."
              value={newPackingText}
              onChange={(e) => setNewPackingText(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Add Item
            </button>
          </form>

          {/* Items list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeTrip.packingList.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePackingItem(activeTrip.id, item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  item.packed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {item.packed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`text-xs font-semibold ${item.packed ? 'line-through opacity-80' : ''}`}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXPANDED MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Trip Itinerary Vector Map
            </h3>
            <span className="text-xs text-slate-400">
              Pins represent scheduled activities and landmark waypoints.
            </span>
          </div>
          <InteractiveMap
            centerTitle={`${activeTrip.destinationName} Complete Route`}
            points={mapPoints}
            showRouteLine={true}
          />
        </div>
      )}

      {/* ADD ACTIVITY MODAL */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Activity to Day {currentDay?.dayNumber}
              </h3>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time</label>
                <input
                  type="text"
                  required
                  value={newActTime}
                  onChange={(e) => setNewActTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g. Bamboo Grove Walk & Tea Ceremony"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location / Address</label>
                <input
                  type="text"
                  value={newActLocation}
                  onChange={(e) => setNewActLocation(e.target.value)}
                  placeholder="e.g. Arashiyama, Kyoto"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newActCategory}
                    onChange={(e) => setNewActCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Culture">Culture</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={newActCost}
                    onChange={(e) => setNewActCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notes / Tips</label>
                <textarea
                  rows={2}
                  value={newActNotes}
                  onChange={(e) => setNewActNotes(e.target.value)}
                  placeholder="e.g. Arrive early to avoid crowds; wear comfortable walking shoes."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
