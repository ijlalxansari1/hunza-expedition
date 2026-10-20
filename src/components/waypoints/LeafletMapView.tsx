
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { WaypointItem } from './WaypointsSection';

interface LeafletMapViewProps {
  waypoints: WaypointItem[];
  selectedWaypoint: WaypointItem | null;
  onSelectWaypoint: (waypoint: WaypointItem) => void;
}

type LeafletModule = typeof import('leaflet');
type LeafletMap = import('leaflet').Map;
type LeafletMarker = import('leaflet').Marker;

type CategoryStyle = {
  label: string;
  symbol: string;
  color: string;
  background: string;
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  lakes: {
    label: 'Lakes',
    symbol: '◉',
    color: '#087F8C',
    background: '#DDF4F1',
  },
  rivers: {
    label: 'Rivers & Waterfalls',
    symbol: '≈',
    color: '#087F8C',
    background: '#DDF4F1',
  },
  mountains: {
    label: 'Mountains',
    symbol: '▲',
    color: '#95612F',
    background: '#F5E8D1',
  },
  meadows: {
    label: 'Meadows',
    symbol: '✳',
    color: '#35764B',
    background: '#E0F0E3',
  },
  glaciers: {
    label: 'Glaciers',
    symbol: '❄',
    color: '#3976A8',
    background: '#E1EFFB',
  },
  forts: {
    label: 'Forts & Heritage',
    symbol: '♜',
    color: '#7350A0',
    background: '#EDE4F8',
  },
  parks: {
    label: 'National Parks',
    symbol: '♧',
    color: '#35764B',
    background: '#E0F0E3',
  },
  passes: {
    label: 'Mountain Passes',
    symbol: '⌁',
    color: '#95612F',
    background: '#F5E8D1',
  },
  accommodation: {
    label: 'Places to Stay',
    symbol: '⌂',
    color: '#A44F37',
    background: '#F6E2D9',
  },
  other: {
    label: 'Other Places',
    symbol: '●',
    color: '#176B58',
    background: '#DDEFE6',
  },
};

function getCategoryStyle(categoryName?: string): CategoryStyle {
  const category = (categoryName ?? '').toLowerCase();

  if (category.includes('lake')) return CATEGORY_STYLES.lakes;

  if (
    category.includes('river') ||
    category.includes('waterfall') ||
    category.includes('water')
  ) {
    return CATEGORY_STYLES.rivers;
  }

  if (
    category.includes('mountain') ||
    category.includes('peak') ||
    category.includes('range')
  ) {
    return CATEGORY_STYLES.mountains;
  }

  if (category.includes('meadow') || category.includes('plateau')) {
    return CATEGORY_STYLES.meadows;
  }

  if (category.includes('glacier')) return CATEGORY_STYLES.glaciers;

  if (
    category.includes('fort') ||
    category.includes('heritage') ||
    category.includes('historic')
  ) {
    return CATEGORY_STYLES.forts;
  }

  if (
    category.includes('national park') ||
    category.includes('protected') ||
    category.includes('wildlife sanctuary')
  ) {
    return CATEGORY_STYLES.parks;
  }

  if (category.includes('pass')) return CATEGORY_STYLES.passes;

  if (
    category.includes('accommodation') ||
    category.includes('hotel') ||
    category.includes('guesthouse') ||
    category.includes('camp') ||
    category.includes('stay')
  ) {
    return CATEGORY_STYLES.accommodation;
  }

  return CATEGORY_STYLES.other;
}

function isValidCoordinates(
  coordinates: WaypointItem['coordinates'],
): coordinates is { lat: number; lng: number } {
  if (!coordinates) return false;

  const { lat, lng } = coordinates;

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function getTileConfiguration() {
  const apiKey = process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim();

  if (apiKey) {
    return {
      url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(apiKey)}`,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    };
  }

  return {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };
}

export function LeafletMapView({
  waypoints,
  selectedWaypoint,
  onSelectWaypoint,
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const clusterRef = useRef<import('leaflet').LayerGroup | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const onSelectRef = useRef(onSelectWaypoint);

  const [mapReady, setMapReady] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelectWaypoint;
  }, [onSelectWaypoint]);

  const categories = useMemo(
    () =>
      [...new Set(waypoints.map((waypoint) => getCategoryStyle(waypoint.categoryName).label))].sort(),
    [waypoints],
  );

  const filteredWaypoints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return waypoints.filter((waypoint) => {
      if (!isValidCoordinates(waypoint.coordinates)) return false;

      const category = getCategoryStyle(waypoint.categoryName).label;

      if (activeFilters.length && !activeFilters.includes(category)) {
        return false;
      }

      return (
        !query ||
        waypoint.name.toLowerCase().includes(query) ||
        waypoint.slug.toLowerCase().includes(query) ||
        waypoint.categoryName.toLowerCase().includes(query)
      );
    });
  }, [waypoints, search, activeFilters]);

  // Initialise Leaflet once, including its clustering plugin.
  useEffect(() => {
    let cancelled = false;
    let createdMap: LeafletMap | null = null;

    async function initialise() {
      try {
        const L = await import('leaflet');
        await import('leaflet.markercluster');

        if (cancelled || !mapContainerRef.current) return;

        leafletRef.current = L;

        const map = L.map(mapContainerRef.current, {
          center: [36.3167, 74.65],
          zoom: 8,
          minZoom: 5,
          maxZoom: 18,
          scrollWheelZoom: false,
          zoomControl: true,
        });

        createdMap = map;
        mapInstanceRef.current = map;

        const tiles = getTileConfiguration();

        L.tileLayer(tiles.url, {
          attribution: tiles.attribution,
          maxZoom: 19,
        }).addTo(map);

        const clusterFactory = (
          L as unknown as {
            markerClusterGroup?: (options?: object) => import('leaflet').LayerGroup;
          }
        ).markerClusterGroup;

        if (clusterFactory) {
          const cluster = clusterFactory({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            removeOutsideVisibleBounds: true,
            maxClusterRadius: 45,
          });

          clusterRef.current = cluster;
          cluster.addTo(map);
        }

        setMapReady(true);

        requestAnimationFrame(() => {
          if (!cancelled && mapInstanceRef.current === map) {
            map.invalidateSize();
          }
        });
      } catch (error) {
        console.error('Could not initialise the destination map:', error);
        setMapError(true);
      }
    }

    void initialise();

    return () => {
      cancelled = true;

      if (createdMap) createdMap.remove();

      if (mapInstanceRef.current === createdMap) {
        mapInstanceRef.current = null;
      }

      markersRef.current.clear();
      clusterRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  // Keep visible markers synchronised with search and category filters.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;

    if (!L || !map || !mapReady) return;

    const cluster = clusterRef.current;

    markersRef.current.forEach((marker) => {
      if (cluster) cluster.removeLayer(marker);
      else marker.remove();
    });

    markersRef.current.clear();

    filteredWaypoints.forEach((waypoint) => {
      if (!isValidCoordinates(waypoint.coordinates)) return;

      const style = getCategoryStyle(waypoint.categoryName);
      const selected = selectedWaypoint?.slug === waypoint.slug;

      const icon = L.divIcon({
        className: 'waypoint-icon-shell',
        html: `
          <div class="waypoint-pin ${selected ? 'waypoint-pin-selected' : ''}"
               style="--pin-color:${style.color};--pin-bg:${style.background}"
               aria-hidden="true">
            <span>${style.symbol}</span>
          </div>
        `,
        iconSize: [selected ? 42 : 34, selected ? 42 : 34],
        iconAnchor: [selected ? 21 : 17, selected ? 21 : 17],
      });

      const marker = L.marker(
        [waypoint.coordinates.lat, waypoint.coordinates.lng],
        {
          icon,
          title: `${waypoint.name} — ${style.label}`,
          alt: waypoint.name,
          keyboard: true,
          riseOnHover: true,
        },
      );

      marker.on('click', () => onSelectRef.current(waypoint));

      if (cluster) cluster.addLayer(marker);
      else marker.addTo(map);

      markersRef.current.set(waypoint.slug, marker);
    });
  }, [filteredWaypoints, selectedWaypoint, mapReady]);

  // Fit the map to the visible filtered places.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;

    if (!map || !L || !mapReady) return;

    const points = filteredWaypoints
      .filter((waypoint) => isValidCoordinates(waypoint.coordinates))
      .map((waypoint) => [
        waypoint.coordinates!.lat,
        waypoint.coordinates!.lng,
      ] as [number, number]);

    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), {
        padding: [45, 45],
        maxZoom: 10,
      });
    } else if (points.length === 1) {
      map.setView(points[0], 11);
    }
  }, [filteredWaypoints, mapReady]);

  // Fly to a selected destination.
  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !isValidCoordinates(selectedWaypoint?.coordinates)) return;

    map.flyTo(
      [selectedWaypoint.coordinates.lat, selectedWaypoint.coordinates.lng],
      Math.max(map.getZoom(), 11),
      { animate: true, duration: 0.5 },
    );
  }, [selectedWaypoint]);

  function toggleFilter(category: string) {
    setActiveFilters((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  const selectedStyle = selectedWaypoint
    ? getCategoryStyle(selectedWaypoint.categoryName)
    : null;

  // Optional display fields can be added to WaypointItem later.
  const selectedContent = selectedWaypoint as
    | (WaypointItem & { image?: string; description?: string })
    | null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search lakes, forts, mountains..."
            className="w-full bg-transparent text-sm outline-none"
            aria-label="Search destinations"
          />
        </label>

        <p className="text-sm text-stone-600">
          <strong className="text-stone-900">{filteredWaypoints.length}</strong>{' '}
          places
        </p>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2"
        aria-label="Filter destinations by category"
      >
        <button
          type="button"
          onClick={() => setActiveFilters([])}
          aria-pressed={activeFilters.length === 0}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
            activeFilters.length === 0
              ? 'border-emerald-800 bg-emerald-800 text-white'
              : 'border-stone-200 bg-white text-stone-700'
          }`}
        >
          All places
        </button>

        {categories.map((category) => {
          const active = activeFilters.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleFilter(category)}
              aria-pressed={active}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                active
                  ? 'border-emerald-800 bg-emerald-800 text-white'
                  : 'border-stone-200 bg-white text-stone-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="relative h-[540px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <div
          ref={mapContainerRef}
          className="h-full w-full"
          role="region"
          aria-label="Interactive map of destinations in northern Pakistan"
          tabIndex={0}
        />

        {mapError && (
          <div className="absolute inset-x-4 top-4 z-[500] rounded-xl bg-white p-4 shadow">
            <p className="font-semibold">The map could not load.</p>
            <p className="mt-1 text-sm text-stone-600">
              Check your internet connection and map tile provider settings.
            </p>
          </div>
        )}

        {selectedWaypoint && selectedStyle && (
          <aside className="absolute bottom-4 left-4 right-4 z-[500] max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl sm:left-auto sm:right-4">
            {selectedContent?.image && (
              <img
                src={selectedContent.image}
                alt=""
                loading="lazy"
                className="h-36 w-full object-cover"
              />
            )}

            <div className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{
                    backgroundColor: selectedStyle.background,
                    color: selectedStyle.color,
                  }}
                  aria-hidden="true"
                >
                  {selectedStyle.symbol}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {selectedStyle.label}
                  </p>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {selectedWaypoint.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectWaypoint(selectedWaypoint)}
                  className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                  aria-label={`Select ${selectedWaypoint.name}`}
                >
                  ↗
                </button>
              </div>

              {selectedContent?.description && (
                <p className="line-clamp-3 text-sm leading-6 text-stone-600">
                  {selectedContent.description}
                </p>
              )}

              <div className="flex gap-2">
                <a
                  href={`/places/${selectedWaypoint.slug}`}
                  className="flex-1 rounded-full bg-stone-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Explore place
                </a>

                <button
                  type="button"
                  onClick={() => onSelectWaypoint(selectedWaypoint)}
                  className="flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-emerald-700"
                >
                  Add to My Trip
                </button>
              </div>
            </div>
          </aside>
        )}

        {filteredWaypoints.length === 0 && (
          <div className="absolute inset-x-4 top-4 z-[400] rounded-xl bg-white p-4 text-center shadow">
            <p className="font-semibold text-stone-900">No places found</p>
            <p className="mt-1 text-sm text-stone-600">
              Try another search or clear your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveFilters([]);
              }}
              className="mt-3 text-sm font-semibold text-emerald-800 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .waypoint-icon-shell {
          background: transparent;
          border: 0;
        }

        .waypoint-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          color: var(--pin-color);
          background: var(--pin-bg);
          border: 2px solid var(--pin-color);
          border-radius: 50%;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
          font-size: 17px;
          font-weight: 700;
          transition: transform 160ms ease;
        }

        .waypoint-pin-selected {
          width: 42px;
          height: 42px;
          border-width: 3px;
          box-shadow: 0 0 0 5px rgba(23, 107, 88, 0.18),
            0 5px 16px rgba(0, 0, 0, 0.25);
        }

        .waypoint-icon-shell:hover .waypoint-pin {
          transform: scale(1.08);
        }

        .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
          background: #e8e5dc;
        }

        .leaflet-control-attribution {
          font-size: 10px;
        }

        @media (prefers-reduced-motion: reduce) {
          .waypoint-pin {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
