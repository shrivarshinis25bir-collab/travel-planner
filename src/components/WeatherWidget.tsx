import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Compass } from 'lucide-react';
import { DestinationWeather } from '../types';

interface WeatherWidgetProps {
  weather: DestinationWeather;
  locationName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, locationName }) => {
  const getWeatherIcon = (condition: string, sizeClass = 'w-6 h-6') => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
      return <CloudRain className={`${sizeClass} text-sky-500`} />;
    }
    if (c.includes('thunder') || c.includes('lightning')) {
      return <CloudLightning className={`${sizeClass} text-amber-500`} />;
    }
    if (c.includes('cloud') || c.includes('overcast')) {
      return <Cloud className={`${sizeClass} text-slate-400`} />;
    }
    if (c.includes('wind') || c.includes('breeze')) {
      return <Wind className={`${sizeClass} text-teal-400`} />;
    }
    return <Sun className={`${sizeClass} text-amber-500`} />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Local Forecast
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
            {locationName}
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-medium">
          {getWeatherIcon(weather.condition, 'w-4 h-4')}
          <span>{weather.condition}</span>
        </div>
      </div>

      {/* Main Temperature Hero */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {weather.tempC}°C
          </span>
          <span className="text-lg font-medium text-slate-400 dark:text-slate-500">
            / {weather.tempF}°F
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>{weather.humidity}% Hum</span>
          </div>
          <div className="flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>{weather.rainChance}% Rain</span>
          </div>
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>UV {weather.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* 5-day mini forecast */}
      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {weather.forecast.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              {f.day}
            </span>
            <div className="my-1">{getWeatherIcon(f.condition, 'w-4 h-4')}</div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {f.tempC}°
            </span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
              {f.rainChance}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
