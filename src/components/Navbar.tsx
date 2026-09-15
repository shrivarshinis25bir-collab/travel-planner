import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Plane,
  ChevronDown,
  CheckCheck,
  Calendar,
  AlertCircle,
  CloudSun,
  Sparkles,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { PageView } from '../types';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const {
    currentView,
    setCurrentView,
    trips,
    activeTrip,
    setActiveTripId,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useTravel();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const tripRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (tripRef.current && !tripRef.current.contains(event.target as Node)) {
        setTripDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('explore');
    }
  };

  const getPageTitle = (view: PageView) => {
    switch (view) {
      case 'dashboard':
        return 'Travel Dashboard';
      case 'explore':
        return 'Explore Destinations';
      case 'destination-details':
        return 'Destination Guide';
      case 'my-trips':
        return 'My Trips';
      case 'trip-planner':
        return 'Create & Plan Trip';
      case 'itinerary':
        return 'Trip Itinerary & Schedule';
      case 'budget':
        return 'Budget & Expenses';
      case 'saved-places':
        return 'Saved Places & Wishlist';
      case 'ai-assistant':
        return 'AI Travel Assistant';
      case 'profile':
        return 'Profile & Travel Preferences';
      default:
        return 'Travel Planner';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getPageTitle(currentView)}
            </h1>
            {activeTrip && (currentView === 'itinerary' || currentView === 'budget') && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Plane className="w-3.5 h-3.5" />
                <span>{activeTrip.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search input */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="global-destination-search"
              placeholder="Search cities, countries, landmarks, attractions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Right: Actions, Trip Selector, Notification Bell, Plan Button */}
        <div className="flex items-center gap-2.5">
          {/* Active Trip Selector Dropdown */}
          <div className="relative" ref={tripRef}>
            <button
              onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[120px] truncate">{activeTrip?.destinationName || 'Select Trip'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {tripDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-1.5 tracking-wider">
                  Switch Active Trip
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {trips.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTripId(t.id);
                        setTripDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        activeTrip?.id === t.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      <img src={t.coverImage} alt={t.title} className="w-7 h-7 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{t.destinationName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{t.startDate}</div>
                      </div>
                      {activeTrip?.id === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setTripDropdownOpen(false);
                      setCurrentView('trip-planner');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan New Trip</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              id="notification-bell-btn"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Travel Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto mt-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No travel reminders right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl transition-colors cursor-pointer flex gap-3 ${
                          n.read ? 'opacity-70 hover:opacity-100' : 'bg-blue-50/50 dark:bg-blue-950/30'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {n.type === 'weather' ? (
                            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                              <CloudSun className="w-4 h-4" />
                            </div>
                          ) : n.type === 'budget' ? (
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          ) : n.type === 'tip' ? (
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                              <Calendar className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Trip Button */}
          <button
            onClick={() => setCurrentView('trip-planner')}
            id="plan-trip-header-btn"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Plan Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
