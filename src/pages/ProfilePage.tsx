import React, { useState } from 'react';
import {
  User,
  Mail,
  Plane,
  Globe,
  DollarSign,
  Bell,
  Sparkles,
  Check,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { UserProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useTravel();

  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const interestOptions = [
    'Culture & Temples',
    'Fine Dining & Local Food',
    'Photography',
    'Hiking & Nature',
    'Beaches & Islands',
    'Art & Museums',
    'Architecture',
    'Nightlife & Socializing',
  ];

  const handleInterestToggle = (interest: string) => {
    const exists = formData.travelInterests.includes(interest);
    setFormData((prev) => ({
      ...prev,
      travelInterests: exists
        ? prev.travelInterests.filter((i) => i !== interest)
        : [...prev.travelInterests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Reset application data to initial demo state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your traveler persona, currency, home base, and AI recommendation priorities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name}</h3>
              <p className="text-xs text-slate-400">{formData.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold mt-2">
                <Sparkles className="w-3 h-3" />
                <span>WanderCraft Pro Member</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative mt-1">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Home Base / Origin Airport
              </label>
              <div className="relative mt-1">
                <Plane className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.homeAirport}
                  onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
                  placeholder="e.g. SFO - San Francisco Intl"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Preferred Currency
              </label>
              <div className="relative mt-1">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Interests Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Travel Themes & Lifestyle Interests
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These keywords guide WanderBot when tailoring recommendations and generating custom itineraries.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {interestOptions.map((interest) => {
              const active = formData.travelInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications & System Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Travel Notifications & Alerts</span>
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Weather Forecast Warnings</div>
                <div className="text-[11px] text-slate-400">Receive alert if rain or typhoons are forecasted during your trip</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Budget Threshold Alerts</div>
                <div className="text-[11px] text-slate-400">Notify when expenses exceed 85% of planned budget</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Concierge Proactive Tips</div>
                <div className="text-[11px] text-slate-400">Smart reminders for reservations, packing, and peak tourist hours</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
