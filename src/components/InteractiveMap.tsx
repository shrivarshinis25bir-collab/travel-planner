import React, { useState } from 'react';
import { MapPin, Navigation, Info, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface MapPoint {
  id: string;
  name: string;
  category?: string;
  lat?: number;
  lng?: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  description?: string;
  time?: string;
}

interface InteractiveMapProps {
  centerTitle: string;
  points: MapPoint[];
  selectedPointId?: string;
  onSelectPoint?: (id: string) => void;
  showRouteLine?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  centerTitle,
  points,
  selectedPointId,
  onSelectPoint,
  showRouteLine = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [activePin, setActivePin] = useState<MapPoint | null>(
    points.find((p) => p.id === selectedPointId) || points[0] || null
  );

  const handlePinClick = (pt: MapPoint) => {
    setActivePin(pt);
    if (onSelectPoint) onSelectPoint(pt.id);
  };

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm select-none">
      {/* Map Graphic Canvas (Stylized Vector Map Grid & Landmass) */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover text-slate-300 dark:text-slate-800 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.3"
              />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Abstract stylized regional terrain / water contour */}
          <path
            d="M 100,120 Q 250,80 420,150 T 750,180 Q 880,210 950,320 T 720,480 Q 510,540 320,470 T 110,380 Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          <path
            d="M 180,200 Q 320,180 500,240 T 800,280 Q 750,420 540,430 T 220,340 Z"
            fill="currentColor"
            fillOpacity="0.4"
          />

          {/* Stylized River / Coastline */}
          <path
            d="M 0,220 C 200,210 320,290 520,310 S 800,240 1000,260"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeOpacity="0.35"
            strokeDasharray="4 4"
          />

          {/* Connecting route line between points */}
          {showRouteLine && points.length > 1 && (
            <polyline
              points={points.map((p) => `${(p.x / 100) * 1000},${(p.y / 100) * 600}`).join(' ')}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Pins overlaid on map */}
        {points.map((pt, idx) => {
          const isSelected = activePin?.id === pt.id;
          return (
            <button
              key={pt.id}
              onClick={() => handlePinClick(pt)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform duration-200"
              title={pt.name}
            >
              <div className="relative flex flex-col items-center">
                {/* Number Badge or Icon */}
                <div
                  className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                    isSelected
                      ? 'w-10 h-10 bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 scale-110 z-20'
                      : 'w-8 h-8 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 z-10'
                  }`}
                >
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>

                {/* Pin Tip */}
                <div
                  className={`w-2 h-2 -mt-1 rotate-45 ${
                    isSelected ? 'bg-blue-600' : 'bg-white dark:bg-slate-800 border-r border-b border-slate-300 dark:border-slate-600'
                  }`}
                />

                {/* Floating label on hover or selected */}
                <div
                  className={`mt-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shadow-md pointer-events-none transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 opacity-100'
                      : 'bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {pt.time ? `${pt.time} • ` : ''}
                  {pt.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Top Map Header Overlay */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-2">
        <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{centerTitle} Interactive Route Map</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-medium">
          {points.length} stops
        </span>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.25, 2.0))}
          className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.75))}
          className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors"
          title="Reset View"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Selected Point Details Bar */}
      {activePin && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activePin.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {activePin.time ? `${activePin.time} • ` : ''}
                {activePin.description || 'Wayfinding landmark with verified accessibility'}
              </div>
            </div>
          </div>
          {activePin.category && (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {activePin.category}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
