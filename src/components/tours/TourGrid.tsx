'use client';

import React, { useState, useMemo } from "react";
import { Search, Compass, X } from "lucide-react";
import { Tour } from "@/types";
import { TourCard } from "./TourCard";

interface TourGridProps {
  tours: Tour[];
  initialDestinationFilter?: string;
}

export function TourGrid({ tours, initialDestinationFilter }: TourGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDestination, setSelectedDestination] = useState<string>(
    initialDestinationFilter || "all"
  );

  const destinationsList = useMemo(() => {
    const set = new Set<string>();
    tours.forEach((t) => t.destinations.forEach((d) => set.add(d.name)));
    return ["all", ...Array.from(set)];
  }, [tours]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destinations.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === "all" || tour.difficulty === selectedDifficulty;

      const matchesDestination =
        selectedDestination === "all" ||
        tour.destinations.some((d) => d.name === selectedDestination || d.slug === selectedDestination);

      return matchesSearch && matchesDifficulty && matchesDestination;
    });
  }, [tours, searchQuery, selectedDifficulty, selectedDestination]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/90 subtle-shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tours by name, valley, or activity (e.g. Forts, Attabad, Glacier)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium shrink-0">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
            >
              <option value="all">All Difficulties</option>
              <option value="Gentle">Gentle (Leisure & Heritage)</option>
              <option value="Moderate">Moderate (Active Walking)</option>
              <option value="Challenging">Challenging (Steeper Trails)</option>
            </select>
          </div>
        </div>

        {/* Destination Filter Pills */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-stone-500 font-medium shrink-0">Valley:</span>
          {destinationsList.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDestination(dest)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                selectedDestination === dest
                  ? "bg-[#12283a] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {dest === "all" ? "All Valleys" : dest}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredTours.length}</strong> of {tours.length} itineraries
        </span>
        {(searchQuery || selectedDifficulty !== "all" || selectedDestination !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
              setSelectedDestination("all");
            }}
            className="text-stone-600 hover:text-stone-900 underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center space-y-3">
          <Compass className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="text-base font-semibold text-stone-800">No itineraries match your criteria</h4>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            We can customize a unique route matching your preferences using our Custom Journey Builder.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("all");
                setSelectedDestination("all");
              }}
              className="text-xs font-semibold text-[#12283a] hover:underline"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
