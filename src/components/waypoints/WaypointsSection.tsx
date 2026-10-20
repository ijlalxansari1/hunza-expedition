
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Plus,
  Check,
  ArrowRight,
  Compass,
  X,
  List,
  Map as MapIcon,
} from 'lucide-react';
import type {
  PlaceContent,
  PlaceCategoryContent,
} from '@/lib/editorialContent';
import { LeafletMapView } from './LeafletMapView';

export interface WaypointItem {
  id: string | number;
  name: string;
  slug: string;
  shortDescription: string;
  region: string;
  geographicArea?: string;
  heroImageUrl?: string | null;
  imageAlt?: string | null;
  categorySlug: string;
  categoryName: string;
  categorySlugs?: string[];
  coordinates?: { lat: number; lng: number } | null;
}

interface WaypointsSectionProps {
  places: PlaceContent[];
  categories: PlaceCategoryContent[];
}

const WAYPOINTS_FILTERS = [
  { id: 'all', label: 'All Waypoints', slugs: [] },
  { id: 'mountains', label: 'Mountains', slugs: ['mountains-peaks'] },
  { id: 'lakes', label: 'Lakes', slugs: ['lakeside-scenic'] },
  { id: 'national-parks', label: 'National Parks', slugs: ['protected-areas'] },
  { id: 'forts', label: 'Forts', slugs: ['forts', 'culture-heritage'] },
  { id: 'glaciers', label: 'Glaciers', slugs: ['glaciers'] },
  { id: 'meadows', label: 'Meadows', slugs: ['meadows'] },
  { id: 'mountain-passes', label: 'Mountain Passes', slugs: ['mountain-passes'] },
  { id: 'places-to-stay', label: 'Places to Stay', slugs: ['places-to-stay'] },
];

function getCategoryData(place: PlaceContent) {
  const primaryCategory =
    place.primaryCategory && typeof place.primaryCategory === 'object'
      ? place.primaryCategory
      : null;

  const categorySlug = primaryCategory?.slug || 'uncategorised';
  const categoryName = primaryCategory?.name || 'Place';

  // Keep this array ready for multiple categories.
  // Connect actual secondary category relationships here once their
  // structure in PlaceContent has been confirmed.
  const categorySlugs = [categorySlug];

  return { categorySlug, categoryName, categorySlugs };
}

function getCoordinates(
  place: PlaceContent,
): { lat: number; lng: number } | null {
  const coordinates = place.coordinates;

  if (!coordinates || typeof coordinates !== 'object') return null;
  if (!('lat' in coordinates) || !('lng' in coordinates)) return null;

  const { lat, lng } = coordinates as { lat: number; lng: number };

  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return { lat, lng };
}

export function WaypointsSection({
  places,
  categories,
}: WaypointsSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWaypoint, setSelectedWaypoint] =
    useState<WaypointItem | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [draftTrip, setDraftTrip] = useState<WaypointItem[]>([]);
  const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);

  const waypoints = useMemo<WaypointItem[]>(() => {
    return places.map((place) => {
      const category = getCategoryData(place);

      return {
        id: place.id,
        name: place.name,
        slug: place.slug,
        shortDescription: place.shortDescription || '',
        region: place.region || '',
        geographicArea: place.geographicArea || undefined,
        heroImageUrl: place.heroImageUrl || null,
        imageAlt: place.imageAlt || null,
        categorySlug: category.categorySlug,
        categoryName: category.categoryName,
        categorySlugs: category.categorySlugs,
        coordinates: getCoordinates(place),
      };
    });
  }, [places]);

  const filteredWaypoints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filter = WAYPOINTS_FILTERS.find(
      (item) => item.id === activeFilter,
    );

    return waypoints.filter((waypoint) => {
      const slugs = waypoint.categorySlugs?.length
        ? waypoint.categorySlugs
        : [waypoint.categorySlug];

      const matchesCategory =
        !filter?.slugs.length ||
        filter.slugs.some((slug) => slugs.includes(slug));

      const searchableText = [
        waypoint.name,
        waypoint.region,
        waypoint.geographicArea || '',
        waypoint.shortDescription,
        waypoint.categoryName,
        ...slugs,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [waypoints, activeFilter, searchQuery]);

  // Clear the selection if the selected place is no longer in the results.
  useEffect(() => {
    if (
      selectedWaypoint &&
      !filteredWaypoints.some(
        (waypoint) => waypoint.slug === selectedWaypoint.slug,
      )
    ) {
      setSelectedWaypoint(null);
    }
  }, [filteredWaypoints, selectedWaypoint]);

  // Keep trip items aligned with the latest published place data.
  useEffect(() => {
    setDraftTrip((previous) =>
      previous
        .map((oldItem) =>
          waypoints.find((item) => item.slug === oldItem.slug),
        )
        .filter((item): item is WaypointItem => Boolean(item)),
    );
  }, [waypoints]);

  const isInTrip = (item: WaypointItem) =>
    draftTrip.some((tripItem) => tripItem.slug === item.slug);

  const toggleTripItem = (item: WaypointItem) => {
    if (isInTrip(item)) {
      setDraftTrip((previous) =>
        previous.filter((tripItem) => tripItem.slug !== item.slug),
      );
    } else {
      setDraftTrip((previous) => [...previous, item]);
      setIsTripDrawerOpen(true);
    }
  };

  const tripPlannerUrl = useMemo(() => {
    const params = new URLSearchParams();
    draftTrip.forEach((item) => params.append('destination', item.slug));
    return `/plan-your-trip?${params.toString()}`;
  }, [draftTrip]);

  return (
    <section
      id="waypoints"
      className="relative overflow-hidden bg-stone-900 py-16 text-white sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:24px_24px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-stone-800 pb-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Compass className="h-3.5 w-3.5" />
              <span>Interactive Geography of Northern Pakistan</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Waypoints
            </h2>

            <p className="text-sm leading-relaxed text-stone-300 sm:text-base">
              Explore mountains, lakes, glaciers, historic forts and other
              destinations. Filter the places and build a draft itinerary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setViewMode((previous) =>
                  previous === 'map' ? 'list' : 'map',
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 transition hover:bg-stone-700"
              aria-label={
                viewMode === 'map'
                  ? 'Switch to list view'
                  : 'Switch to map view'
              }
            >
              {viewMode === 'map' ? (
                <>
                  <List className="h-4 w-4 text-emerald-400" />
                  <span>List View</span>
                </>
              ) : (
                <>
                  <MapIcon className="h-4 w-4 text-emerald-400" />
                  <span>Map View</span>
                </>
              )}
            </button>

            {draftTrip.length > 0 && (
              <button
                type="button"
                onClick={() => setIsTripDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#b4532a] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-[#c96335]"
              >
                <span>Draft Trip ({draftTrip.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Waypoint category filters"
          >
            {WAYPOINTS_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                      : 'border border-stone-700/60 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search mountains, forts, lakes..."
              aria-label="Search waypoints"
              className="w-full rounded-lg border border-stone-700 bg-stone-800 py-2 pl-10 pr-8 text-xs text-white placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-stone-400" aria-live="polite">
          Showing {filteredWaypoints.length} of {waypoints.length} places
        </p>

        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-3 lg:col-span-8">
              <LeafletMapView
                waypoints={filteredWaypoints}
                selectedWaypoint={selectedWaypoint}
                onSelectWaypoint={setSelectedWaypoint}
              />
              <div className="flex items-center justify-between gap-3 px-1 text-xs text-stone-400">
                <span>Explore destinations across northern Pakistan</span>
                <span>Pan and zoom the map</span>
              </div>
            </div>

            <div className="flex min-h-[500px] flex-col justify-between rounded-2xl border border-stone-700/80 bg-stone-800/80 p-6 lg:col-span-4">
              {selectedWaypoint ? (
                <div className="space-y-5">
                  {selectedWaypoint.heroImageUrl && (
                    <div className="relative h-44 overflow-hidden rounded-xl bg-stone-900">
                      <Image
                        src={selectedWaypoint.heroImageUrl}
                        alt={
                          selectedWaypoint.imageAlt ||
                          selectedWaypoint.name
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {selectedWaypoint.categoryName}
                    </span>

                    <h3 className="text-xl font-bold text-white">
                      {selectedWaypoint.name}
                    </h3>

                    <p className="flex items-center gap-1.5 text-xs text-stone-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>
                        {selectedWaypoint.region}
                        {selectedWaypoint.geographicArea
                          ? ` · ${selectedWaypoint.geographicArea}`
                          : ''}
                      </span>
                    </p>

                    <p className="pt-2 text-xs leading-relaxed text-stone-300">
                      {selectedWaypoint.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-stone-700/80 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleTripItem(selectedWaypoint)}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                        isInTrip(selectedWaypoint)
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-[#b4532a] text-white hover:bg-[#c96335]'
                      }`}
                    >
                      {isInTrip(selectedWaypoint) ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added to Draft Trip</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add to My Trip</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/places/${selectedWaypoint.slug}`}
                      className="inline-flex items-center justify-center rounded-lg border border-stone-600 p-2.5 text-stone-200 transition hover:bg-stone-700"
                      aria-label={`View details for ${selectedWaypoint.name}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="my-auto flex flex-col items-center justify-center space-y-3 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-700/60 text-stone-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-200">
                    Select a Waypoint
                  </h4>
                  <p className="max-w-xs text-xs leading-relaxed text-stone-400">
                    Select a map marker to view the place and add it to your
                    draft itinerary.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-stone-700/60 pt-4 text-xs text-stone-400">
                <span>Places in your draft</span>
                <strong className="text-stone-200">
                  {draftTrip.length}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWaypoints.map((waypoint) => {
              const inTrip = isInTrip(waypoint);

              return (
                <article
                  key={waypoint.slug}
                  className="flex flex-col justify-between space-y-4 rounded-xl border border-stone-800 bg-stone-800 p-5"
                >
                  {waypoint.heroImageUrl && (
                    <div className="relative h-40 overflow-hidden rounded-lg bg-stone-900">
                      <Image
                        src={waypoint.heroImageUrl}
                        alt={waypoint.imageAlt || waypoint.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-emerald-400">
                        {waypoint.categoryName}
                      </span>
                      <span className="text-stone-400">{waypoint.region}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      <Link
                        href={`/places/${waypoint.slug}`}
                        className="hover:text-emerald-400"
                      >
                        {waypoint.name}
                      </Link>
                    </h3>

                    <p className="line-clamp-2 text-xs leading-relaxed text-stone-300">
                      {waypoint.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-stone-700 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleTripItem(waypoint)}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        inTrip
                          ? 'border-emerald-500/50 bg-emerald-600/30 text-emerald-300'
                          : 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                      }`}
                    >
                      {inTrip ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      <span>{inTrip ? 'In Trip' : 'Add to Trip'}</span>
                    </button>

                    <Link
                      href={`/places/${waypoint.slug}`}
                      className="rounded-lg border border-stone-700 px-3 py-2 text-xs text-stone-300 hover:bg-stone-700"
                    >
                      Details
                    </Link>
                  </div>
                </article>
              );
            })}

            {filteredWaypoints.length === 0 && (
              <div className="col-span-full rounded-xl border border-stone-800 p-10 text-center">
                <p className="text-sm font-semibold text-stone-200">
                  No matching places found
                </p>
                <p className="mt-2 text-xs text-stone-400">
                  Try another search term or select a different category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isTripDrawerOpen && (
        <div
          className="fixed inset-0 z-50"
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsTripDrawerOpen(false);
          }}
        >
          <button
            type="button"
            aria-label="Close trip drawer"
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
            onClick={() => setIsTripDrawerOpen(false)}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full flex-col justify-between border-l border-stone-800 bg-stone-900 p-6 shadow-2xl sm:w-96"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <h3
                    id="trip-drawer-title"
                    className="text-lg font-bold text-white"
                  >
                    Your Custom Journey Draft
                  </h3>
                  <p className="text-xs text-stone-400">
                    {draftTrip.length} places selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTripDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white"
                  aria-label="Close trip drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {draftTrip.length === 0 ? (
                <p className="py-8 text-center text-xs text-stone-400">
                  No places added yet. Select destinations or landmarks from
                  the Waypoints map.
                </p>
              ) : (
                <ul className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                  {draftTrip.map((item, index) => (
                    <li
                      key={item.slug}
                      className="flex items-center justify-between rounded-lg border border-stone-700/60 bg-stone-800/80 p-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-white">
                            {item.name}
                          </span>
                        </div>
                        <span className="block pl-5 text-[11px] text-stone-400">
                          {item.region}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTripItem(item)}
                        className="p-1 text-stone-400 hover:text-red-400"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3 border-t border-stone-800 pt-4">
              <Link
                href={tripPlannerUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b4532a] px-4 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#c96335]"
              >
                <span>Continue to Trip Planner</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsTripDrawerOpen(false)}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-200"
              >
                Keep Exploring Map
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
