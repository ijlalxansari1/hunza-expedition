import 'server-only';
import { getPayload } from 'payload';
import { z } from 'zod';
import configPromise from '@/../payload.config';
import { initialDestinations } from '@/data/seedDestinations';
import { initialTours } from '@/data/seedTours';
import type { Destination, Tour } from '@/types';
import { withDatabaseFallback } from '@/lib/databaseFallback';
import { cachePublicContent } from '@/lib/publicContentCache';
import { optimizedImageUrl } from '@/lib/imageUrl';

const coordinatesSchema = z.object({ lat: z.number(), lng: z.number() });
const placeSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  locationNote: z.string().optional(),
  verifiedHeritageStatus: z.string().optional(),
});
const seasonSchema = z.object({
  season: z.string(),
  months: z.string(),
  description: z.string(),
});
const itineraryDaySchema = z.object({
  dayNumber: z.number(),
  title: z.string(),
  description: z.string(),
  accommodation: z.string().optional(),
  mealsIncluded: z.string().optional(),
  travelNotes: z.string().optional(),
});

const destinationSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  region: z.string(),
  shortDescription: z.string(),
  overview: z.string(),
  heroImageUrl: z.string(),
  galleryUrls: z.array(z.string()).optional(),
  coordinates: coordinatesSchema.optional(),
  placesOfInterest: z.array(placeSchema).optional(),
  bestTimeToVisit: z.object({
    summary: z.string(),
    seasons: z.array(seasonSchema),
  }).optional(),
  transportNotes: z.string().optional(),
  practicalInfo: z.array(z.string()).optional(),
  safetyNotes: z.string().optional(),
  publicationStatus: z.enum(['draft', 'review', 'approved', 'published']),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const tourSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  shortSummary: z.string(),
  fullDescription: z.string(),
  heroImageUrl: z.string(),
  galleryUrls: z.array(z.string()).optional(),
  destinations: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    slug: z.string(),
  })),
  durationDays: z.number(),
  difficulty: z.enum(['Gentle', 'Moderate', 'Challenging', 'Strenuous']),
  activityCategories: z.array(z.string()),
  travelStyle: z.string(),
  season: z.string(),
  itinerary: z.array(itineraryDaySchema),
  price: z.number().optional(),
  currency: z.string().optional(),
  pricingBasis: z.string().optional(),
  isPriceConfirmed: z.boolean(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  packingRequirements: z.array(z.string()).optional(),
  safetyNotes: z.string().optional(),
  publicationStatus: z.enum(['draft', 'review', 'approved', 'published']),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

function parseJsonField<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  return schema.parse(value ?? fallback);
}

function mapDestination(doc: {
  id: number;
  name: string;
  slug: string;
  region: string;
  shortDescription: string;
  overview: string;
  heroImageUrl: string;
  galleryUrls?: unknown;
  coordinates?: unknown;
  placesOfInterest?: unknown;
  bestTimeToVisit?: unknown;
  transportNotes?: string | null;
  practicalInfo?: unknown;
  safetyNotes?: string | null;
  publicationStatus: 'draft' | 'review' | 'approved' | 'published';
  seoTitle?: string | null;
  metaDescription?: string | null;
}): Destination {
  return destinationSchema.parse({
    _id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    region: doc.region,
    shortDescription: doc.shortDescription,
    overview: doc.overview,
    heroImageUrl: optimizedImageUrl(doc.heroImageUrl),
    galleryUrls: parseJsonField(z.array(z.string()), doc.galleryUrls, []).map(optimizedImageUrl),
    coordinates: doc.coordinates == null
      ? undefined
      : parseJsonField(coordinatesSchema, doc.coordinates, { lat: 0, lng: 0 }),
    placesOfInterest: parseJsonField(z.array(placeSchema), doc.placesOfInterest, []).map((place) => ({
      ...place,
      imageUrl: place.imageUrl ? optimizedImageUrl(place.imageUrl) : undefined,
    })),
    bestTimeToVisit: doc.bestTimeToVisit == null
      ? undefined
      : parseJsonField(destinationSchema.shape.bestTimeToVisit.unwrap(), doc.bestTimeToVisit, {
        summary: '',
        seasons: [],
      }),
    transportNotes: doc.transportNotes ?? undefined,
    practicalInfo: parseJsonField(z.array(z.string()), doc.practicalInfo, []),
    safetyNotes: doc.safetyNotes ?? undefined,
    publicationStatus: doc.publicationStatus,
    seoTitle: doc.seoTitle ?? undefined,
    metaDescription: doc.metaDescription ?? undefined,
  });
}

function mapTour(doc: {
  id: number;
  title: string;
  slug: string;
  shortSummary: string;
  fullDescription: string;
  heroImageUrl: string;
  galleryUrls?: unknown;
  destinations: unknown;
  durationDays: number;
  difficulty: 'Gentle' | 'Moderate' | 'Challenging' | 'Strenuous';
  activityCategories?: unknown;
  travelStyle: string;
  season: string;
  itinerary: unknown;
  price?: number | null;
  currency?: string | null;
  pricingBasis?: string | null;
  isPriceConfirmed: boolean;
  inclusions?: unknown;
  exclusions?: unknown;
  packingRequirements?: unknown;
  safetyNotes?: string | null;
  publicationStatus: 'draft' | 'review' | 'approved' | 'published';
  seoTitle?: string | null;
  metaDescription?: string | null;
}): Tour {
  return tourSchema.parse({
    _id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    shortSummary: doc.shortSummary,
    fullDescription: doc.fullDescription,
    heroImageUrl: optimizedImageUrl(doc.heroImageUrl),
    galleryUrls: parseJsonField(z.array(z.string()), doc.galleryUrls, []).map(optimizedImageUrl),
    destinations: parseJsonField(tourSchema.shape.destinations, doc.destinations, []),
    durationDays: doc.durationDays,
    difficulty: doc.difficulty,
    activityCategories: parseJsonField(z.array(z.string()), doc.activityCategories, []),
    travelStyle: doc.travelStyle,
    season: doc.season,
    itinerary: parseJsonField(z.array(itineraryDaySchema), doc.itinerary, []),
    price: doc.price ?? undefined,
    currency: doc.currency ?? undefined,
    pricingBasis: doc.pricingBasis ?? undefined,
    isPriceConfirmed: doc.isPriceConfirmed,
    inclusions: parseJsonField(z.array(z.string()), doc.inclusions, []),
    exclusions: parseJsonField(z.array(z.string()), doc.exclusions, []),
    packingRequirements: parseJsonField(z.array(z.string()), doc.packingRequirements, []),
    safetyNotes: doc.safetyNotes ?? undefined,
    publicationStatus: doc.publicationStatus,
    seoTitle: doc.seoTitle ?? undefined,
    metaDescription: doc.metaDescription ?? undefined,
  });
}

async function hasCatalogRecords(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'destinations' | 'tours',
): Promise<boolean> {
  const result = await payload.find({
    collection,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs.length > 0;
}

async function readPublishedDestinations(): Promise<Destination[]> {
  return withDatabaseFallback('Published destinations', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'destinations',
      where: { publicationStatus: { equals: 'published' } },
      sort: 'name',
      pagination: false,
      depth: 0,
    });
    if (result.docs.length === 0) {
      if (await hasCatalogRecords(payload, 'destinations')) {
        return [];
      }
      return initialDestinations.filter((destination) => destination.publicationStatus === 'published');
    }
    return result.docs.map(mapDestination);
  }, () => initialDestinations.filter((destination) => destination.publicationStatus === 'published'));
}

export const getPublishedDestinations = cachePublicContent(
  'destinations-list',
  readPublishedDestinations,
);

async function readDestinationBySlug(slug: string): Promise<Destination | null> {
  return withDatabaseFallback('Destination detail', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'destinations',
      where: {
        and: [
          { slug: { equals: slug } },
          { publicationStatus: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    if (result.docs[0]) {
      return mapDestination(result.docs[0]);
    }
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length > 0 || await hasCatalogRecords(payload, 'destinations')) {
      return null;
    }
    return initialDestinations.find((destination) => (
      destination.slug === slug && destination.publicationStatus === 'published'
    )) ?? null;
  }, () => initialDestinations.find((destination) => (
    destination.slug === slug && destination.publicationStatus === 'published'
  )) ?? null);
}

export const getDestinationBySlug = cachePublicContent(
  'destination-detail',
  readDestinationBySlug,
);

async function readPublishedTours(): Promise<Tour[]> {
  return withDatabaseFallback('Published tours', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'tours',
      where: { publicationStatus: { equals: 'published' } },
      sort: 'title',
      pagination: false,
      depth: 0,
    });
    if (result.docs.length === 0) {
      if (await hasCatalogRecords(payload, 'tours')) {
        return [];
      }
      return initialTours.filter((tour) => tour.publicationStatus === 'published');
    }
    return result.docs.map(mapTour);
  }, () => initialTours.filter((tour) => tour.publicationStatus === 'published'));
}

export const getPublishedTours = cachePublicContent(
  'tours-list',
  readPublishedTours,
);

async function readTourBySlug(slug: string): Promise<Tour | null> {
  return withDatabaseFallback('Tour detail', async () => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'tours',
      where: {
        and: [
          { slug: { equals: slug } },
          { publicationStatus: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    if (result.docs[0]) {
      return mapTour(result.docs[0]);
    }
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length > 0 || await hasCatalogRecords(payload, 'tours')) {
      return null;
    }
    return initialTours.find((tour) => (
      tour.slug === slug && tour.publicationStatus === 'published'
    )) ?? null;
  }, () => initialTours.find((tour) => (
    tour.slug === slug && tour.publicationStatus === 'published'
  )) ?? null);
}

export const getTourBySlug = cachePublicContent(
  'tour-detail',
  readTourBySlug,
);
