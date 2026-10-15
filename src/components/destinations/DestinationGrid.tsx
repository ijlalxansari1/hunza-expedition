'use client';

import React, { useState, useMemo } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Destination } from "@/types";
import { DestinationCard } from "./DestinationCard";

interface DestinationGridProps {
  destinations: Destination[];
}

export function DestinationGrid({ destinations }: DestinationGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const regions = useMemo(() => {
    const list = Array.from(new Set(destinations.map((d) => d.region)));
    return ["all", ...list];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.placesOfInterest?.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === "all" || dest.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [destinations, searchQuery, selectedRegion]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 subtle-shadow flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by destination name, fort, or attraction (e.g. Baltit, Attabad, Passu)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-stone-500 font-medium mr-1 shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Region:
          </span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                selectedRegion === region
                  ? "bg-[#12283a] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {region === "all" ? "All Gilgit-Baltistan" : region}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredDestinations.length}</strong> of {destinations.length} destinations
        </span>
        {(searchQuery || selectedRegion !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("all");
            }}
            className="text-stone-600 hover:text-stone-900 underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center space-y-3">
          <MapPin className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="text-base font-semibold text-stone-800">No destinations found</h4>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            We could not find any destinations matching &quot;{searchQuery}&quot;. Try adjusting your search term or view all locations.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("all");
            }}
            className="inline-block mt-2 text-xs font-semibold text-[#12283a] hover:underline"
          >
            Clear search filters
          </button>
        </div>
      )}
    </div>
  );
}
