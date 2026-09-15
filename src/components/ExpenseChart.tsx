import React, { useState } from 'react';
import { ExpenseCategory, Expense } from '../types';

interface ExpenseChartProps {
  expenses: Expense[];
  totalBudget: number;
  currency?: string;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Accommodation: '#3b82f6', // blue
  'Flights & Transport': '#06b6d4', // cyan
  'Food & Dining': '#10b981', // emerald
  Activities: '#f59e0b', // amber
  Shopping: '#ec4899', // pink
  Misc: '#8b5cf6', // purple
};

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  expenses,
  totalBudget,
  currency = 'USD',
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<ExpenseCategory | null>(null);

  // Group expenses by category
  const categoryTotals: Record<ExpenseCategory, number> = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {
    Accommodation: 0,
    'Flights & Transport': 0,
    'Food & Dining': 0,
    Activities: 0,
    Shopping: 0,
    Misc: 0,
  });

  const totalSpent: number = (Object.values(categoryTotals) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const remaining: number = Math.max(0, totalBudget - totalSpent);
  const percentSpent: number = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  // Donut slices calculation
  const categories = Object.keys(CATEGORY_COLORS) as ExpenseCategory[];
  let cumulativeAngle = 0;

  const slices = categories
    .map((cat) => {
      const amount: number = categoryTotals[cat] || 0;
      if (amount === 0 || totalSpent === 0) return null;
      const fraction: number = amount / totalSpent;
      const angle = fraction * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      return {
        category: cat,
        amount,
        fraction,
        startAngle,
        angle,
        color: CATEGORY_COLORS[cat],
      };
    })
    .filter(Boolean) as {
    category: ExpenseCategory;
    amount: number;
    fraction: number;
    startAngle: number;
    angle: number;
    color: string;
  }[];

  // SVG coordinate calculation for donut
  const size = 200;
  const center = size / 2;
  const radius = 78;
  const innerRadius = 52;

  const getCoordinatesForAngle = (angleInDegrees: number, r: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + r * Math.cos(angleInRadians),
      y: center + r * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Budget & Expense Breakdown
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              percentSpent > 90
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : percentSpent > 70
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {percentSpent}% Used
          </span>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              percentSpent > 90
                ? 'bg-rose-500'
                : percentSpent > 70
                ? 'bg-amber-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>

        {/* Chart Content Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut SVG */}
          <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-0">
              {slices.length === 0 ? (
                <circle
                  cx={center}
                  cy={center}
                  r={(radius + innerRadius) / 2}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth={radius - innerRadius}
                  fill="none"
                />
              ) : (
                slices.map((slice) => {
                  const isHovered = hoveredCategory === slice.category;
                  const currentRadius = isHovered ? radius + 4 : radius;

                  const startOuter = getCoordinatesForAngle(slice.startAngle, currentRadius);
                  const endOuter = getCoordinatesForAngle(slice.startAngle + slice.angle - 0.01, currentRadius);
                  const startInner = getCoordinatesForAngle(slice.startAngle + slice.angle - 0.01, innerRadius);
                  const endInner = getCoordinatesForAngle(slice.startAngle, innerRadius);

                  const largeArcFlag = slice.angle > 180 ? 1 : 0;

                  const pathData = [
                    `M ${startOuter.x} ${startOuter.y}`,
                    `A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                    `L ${startInner.x} ${startInner.y}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
                    'Z',
                  ].join(' ');

                  return (
                    <path
                      key={slice.category}
                      d={pathData}
                      fill={slice.color}
                      className="transition-all duration-200 cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })
              )}
            </svg>

            {/* Inner Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {hoveredCategory || 'Total Spent'}
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ${hoveredCategory ? (categoryTotals[hoveredCategory] || 0).toLocaleString() : totalSpent.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">
                of ${totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Categorical Legend */}
          <div className="flex-1 w-full space-y-2">
            {categories.map((cat) => {
              const amount = categoryTotals[cat] || 0;
              const fraction = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              const isHovered = hoveredCategory === cat;

              return (
                <div
                  key={cat}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHovered
                      ? 'bg-slate-100 dark:bg-slate-800 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    />
                    <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 font-normal">
                      {Math.round(fraction)}%
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Remaining Buffer: <span className="font-bold text-emerald-600 dark:text-emerald-400">${remaining.toLocaleString()}</span>
        </div>
        <div className="font-medium">Currency: {currency}</div>
      </div>
    </div>
  );
};
