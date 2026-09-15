import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  Sparkles,
  Calendar,
  Filter,
  Check,
  Loader2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ExpenseCategory } from '../types';
import { ExpenseChart } from '../components/ExpenseChart';

export const BudgetPage: React.FC = () => {
  const {
    activeTrip,
    expenses,
    addExpense,
    deleteExpense,
    userProfile,
  } = useTravel();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');
  const [isEstimatingAI, setIsEstimatingAI] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<any>(null);

  const totalBudget = activeTrip?.totalBudget || 3500;
  const currentTripExpenses = activeTrip
    ? expenses.filter((e) => e.tripId === activeTrip.id)
    : expenses;

  const totalSpent = currentTripExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const tripDaysCount = activeTrip?.days?.length || 5;
  const avgSpentPerDay = tripDaysCount > 0 ? Math.round(totalSpent / tripDaysCount) : 0;

  const filteredExpenses = currentTripExpenses.filter((e) =>
    selectedFilterCategory === 'All' ? true : e.category === selectedFilterCategory
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      tripId: activeTrip?.id,
      title,
      amount: Number(amount),
      category,
      date,
      notes,
    });

    setTitle('');
    setAmount('');
    setNotes('');
  };

  const handleAiBudgetEstimator = async () => {
    setIsEstimatingAI(true);
    try {
      const res = await fetch('/api/ai/estimate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: activeTrip?.destinationName || 'Tokyo, Japan',
          days: tripDaysCount,
          travelers: activeTrip?.travelers || 2,
          travelStyle: 'Moderate',
        }),
      });
      const data = await res.json();
      setAiEstimate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEstimatingAI(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budget & Expense Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track spending in real-time across flights, boutique hotels, dining, and daily activities.
          </p>
        </div>

        <button
          onClick={handleAiBudgetEstimator}
          disabled={isEstimatingAI}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {isEstimatingAI ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Calculating Market Estimates...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Budget Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Allocated</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ${totalBudget.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{userProfile.currency} Base</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            ${totalSpent.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">
            {Math.round((totalSpent / (totalBudget || 1)) * 100)}% of target
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Buffer</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ${remainingBudget.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Available balance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Avg Burn</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ${avgSpentPerDay}
          </div>
          <span className="text-[11px] text-slate-400">Across {tripDaysCount} days</span>
        </div>
      </div>

      {/* AI Benchmark Drawer */}
      {aiEstimate && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-200 dark:border-blue-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Market Cost Benchmark for {activeTrip?.destinationName || 'Trip'}</span>
            </div>
            <button
              onClick={() => setAiEstimate(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400">Accommodations</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                ${aiEstimate.breakdown?.accommodation || 850}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400">Dining & Drinks</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                ${aiEstimate.breakdown?.food || 450}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400">Sightseeing & Tours</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                ${aiEstimate.breakdown?.activities || 320}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400">Local Transit</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                ${aiEstimate.breakdown?.transport || 180}
              </div>
            </div>
          </div>

          {aiEstimate.savingTips && aiEstimate.savingTips.length > 0 && (
            <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              <span className="font-bold text-slate-900 dark:text-white">Pro Tip: </span>
              {aiEstimate.savingTips[0]}
            </div>
          )}
        </div>
      )}

      {/* Chart & New Expense Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart Component */}
        <div className="lg:col-span-6">
          <ExpenseChart
            expenses={currentTripExpenses}
            totalBudget={totalBudget}
            currency={userProfile.currency}
          />
        </div>

        {/* Right: Quick Log Expense Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Log New Expense
            </h3>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Expense Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kaiseki Dinner, Airport Express, Souvenirs..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 85"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Flights & Transport">Flights & Transport</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Activities">Activities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes / Receipt
                </label>
                <input
                  type="text"
                  placeholder="Optional memo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Add Expense Entry
            </button>
          </form>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Expense Transaction History ({filteredExpenses.length})
          </h3>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Accommodation', 'Flights & Transport', 'Food & Dining', 'Activities', 'Shopping'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedFilterCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  selectedFilterCategory === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No expense records found in this category.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-500">{exp.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{exp.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      ${exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{exp.notes || '—'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
