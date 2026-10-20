'use client';

import React from 'react';
import { CloudSun, Sun, Cloud, CloudSnow, Wind, Compass } from 'lucide-react';

interface WeatherStation {
  name: string;
  representativeArea?: string;
  tempC: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'snow' | 'wind';
}

const GB_WEATHER_STATIONS: WeatherStation[] = [
  {
    name: 'Hunza',
    representativeArea: 'Karimabad & Central Hunza',
    tempC: 12,
    condition: 'Clear skies',
    icon: 'sun',
  },
  {
    name: 'Skardu',
    representativeArea: 'Baltistan Valley',
    tempC: 8,
    condition: 'Cloudy',
    icon: 'cloud',
  },
  {
    name: 'Gilgit',
    representativeArea: 'Gilgit City & River Basin',
    tempC: 16,
    condition: 'Partly cloudy',
    icon: 'cloud-sun',
  },
  {
    name: 'Nagar',
    representativeArea: 'Hopar & Minapin',
    tempC: 10,
    condition: 'Brisk & clear',
    icon: 'sun',
  },
  {
    name: 'Passu',
    representativeArea: 'Upper Hunza (Gojal)',
    tempC: 6,
    condition: 'Fresh mountain breeze',
    icon: 'wind',
  },
  {
    name: 'Khaplu',
    representativeArea: 'Shyok River Valley',
    tempC: 9,
    condition: 'Partly cloudy',
    icon: 'cloud-sun',
  },
  {
    name: 'Astore',
    representativeArea: 'Rama & Valley Basin',
    tempC: 7,
    condition: 'Overcast',
    icon: 'cloud',
  },
  {
    name: 'Fairy Meadows',
    representativeArea: 'Nanga Parbat Foothills',
    tempC: 2,
    condition: 'Crisp alpine chill',
    icon: 'snow',
  },
];

function WeatherIcon({ type }: { type: WeatherStation['icon'] }) {
  switch (type) {
    case 'sun':
      return <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />;
    case 'cloud-sun':
      return <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />;
    case 'cloud':
      return <Cloud className="w-3.5 h-3.5 text-stone-300 shrink-0" aria-hidden="true" />;
    case 'snow':
      return <CloudSnow className="w-3.5 h-3.5 text-cyan-200 shrink-0" aria-hidden="true" />;
    case 'wind':
      return <Wind className="w-3.5 h-3.5 text-emerald-300 shrink-0" aria-hidden="true" />;
    default:
      return <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />;
  }
}

export function WeatherMarquee() {
  return (
    <div
      className="bg-[#081a13] text-stone-200 border-b border-[#143324] overflow-hidden text-xs py-2 relative z-50 selection:bg-emerald-900"
      aria-label="Gilgit-Baltistan Regional Weather Forecast"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Fixed Title & Badge */}
        <div className="flex items-center gap-2.5 shrink-0 pr-4 border-r border-[#1a422f] z-10 bg-[#081a13]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Gilgit-Baltistan Weather</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Data
          </span>
        </div>

        {/* Scrolling Marquee Container */}
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {/* Duplicated for seamless continuous loop */}
            {[...GB_WEATHER_STATIONS, ...GB_WEATHER_STATIONS].map((station, index) => (
              <div
                key={`${station.name}-${index}`}
                className="inline-flex items-center gap-3.5 py-0.5 px-2 rounded hover:bg-[#122e21] transition-colors cursor-default"
                title={`Representative region: ${station.representativeArea}`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-[12px] leading-tight">
                    {station.name}
                  </span>
                  <span className="text-[10px] text-stone-400 leading-none">
                    {station.condition}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[13px]">
                  <WeatherIcon type={station.icon} />
                  <span>{station.tempC}°C</span>
                </div>

                <span className="text-stone-700 select-none ml-2" aria-hidden="true">|</span>
              </div>
            ))}
          </div>
        </div>

        {/* Informative Disclaimer Label */}
        <div className="hidden xl:flex items-center shrink-0 pl-3 text-[10px] text-stone-400 border-l border-[#1a422f]">
          <span>Mountain valley observations</span>
        </div>
      </div>
    </div>
  );
}
