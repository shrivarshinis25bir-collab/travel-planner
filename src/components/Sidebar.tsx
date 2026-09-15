import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Map,
  CalendarDays,
  PlusCircle,
  Receipt,
  Heart,
  Bot,
  User,
  Sun,
  Moon,
  Plane,
  X,
  Sparkles,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { PageView } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    trips,
    activeTrip,
    savedDestinationIds,
    userProfile,
  } = useTravel();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore Destinations', icon: <Compass className="w-5 h-5" /> },
    { id: 'my-trips', label: 'My Trips', icon: <Plane className="w-5 h-5" />, badge: trips.length },
    { id: 'trip-planner', label: 'Trip Planner', icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'itinerary', label: 'Itinerary & Schedule', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'budget', label: 'Budget & Expenses', icon: <Receipt className="w-5 h-5" /> },
    { id: 'saved-places', label: 'Saved Places', icon: <Heart className="w-5 h-5" />, badge: savedDestinationIds.length },
    {
      id: 'ai-assistant',
      label: 'AI Travel Assistant',
      icon: <Bot className="w-5 h-5 text-blue-500" />,
      badge: 'AI',
    },
    { id: 'profile', label: 'Profile & Settings', icon: <User className="w-5 h-5" /> },
  ];

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              WanderCraft
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                PRO
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              AI Travel Architect
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Trip Quick Glance Pill */}
      {activeTrip && (
        <div className="px-4 pt-3 pb-1">
          <div
            onClick={() => handleNavClick('itinerary')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 cursor-pointer transition-all flex items-center gap-2.5 group"
          >
            <img
              src={activeTrip.coverImage}
              alt={activeTrip.title}
              className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Current Trip
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activeTrip.destinationName}
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {activeTrip.days.length}d
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'AI'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Highlighted AI Co-pilot banner */}
        <div className="pt-2">
          <div
            onClick={() => handleNavClick('ai-assistant')}
            className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-transparent border border-blue-200 dark:border-blue-900/60 cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Concierge</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Ask AI to generate instant 3-day plans, suggest hidden gems, or re-balance your itinerary.
            </p>
          </div>
        </div>
      </nav>

      {/* Footer Controls & User Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {theme}
          </span>
        </button>

        {/* User Mini Profile */}
        <div
          onClick={() => handleNavClick('profile')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {userProfile.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {userProfile.homeAirport.split('-')[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
