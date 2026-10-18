import { initialDestinations } from './seedDestinations.ts';
import type { PublicationStatus } from '@/types';

function toSlug(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function categoryAssignment(name: string): { primaryCategorySlug: string; additionalCategorySlugs?: string[] } {
  if (/fort|historic|village/i.test(name)) {
    return { primaryCategorySlug: 'culture-heritage' };
  }
  if (/lake|scenic|desert/i.test(name)) {
    return { primaryCategorySlug: 'lakeside-scenic', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/bridge/i.test(name)) {
    return { primaryCategorySlug: 'adventure-outdoors' };
  }
  if (/mountain|peak|pass|glacier|cones/i.test(name)) {
    return { primaryCategorySlug: 'mountains-peaks', additionalCategorySlugs: ['natural-wonders'] };
  }
  return { primaryCategorySlug: 'natural-wonders' };
}

export const initialPlaces = initialDestinations.flatMap((destination) => (
  destination.placesOfInterest?.map((place) => ({
    name: place.name,
    slug: `${destination.slug}-${toSlug(place.name)}`,
    destinationSlug: destination.slug,
    destinationName: destination.name,
    region: destination.region,
    shortDescription: place.summary,
    description: place.description ?? '',
    heroImageUrl: place.imageUrl ?? destination.heroImageUrl,
    imageAlt: place.imageAlt ?? place.name,
    locationNote: place.locationNote ?? '',
    ...categoryAssignment(place.name),
    geographicArea: destination.name,
    coordinates: destination.coordinates
      ? { lat: destination.coordinates.lat, lng: destination.coordinates.lng }
      : undefined,
    showOnMap: false,
    publicationStatus: 'published' as const,
  })) ?? []
));

export const proposedPlaceSeeds = [
  {
    name: 'Khunjerab National Park',
    slug: 'khunjerab-national-park',
    destinationSlug: 'passu-gojal',
    destinationName: 'Passu & Gojal (Upper Hunza)',
    geographicArea: 'Khunjerab Pass area',
    region: 'Gilgit-Baltistan',
    shortDescription: 'Proposed place entry. Details and any protected-area claims require editorial verification before publication.',
    description: 'Proposed seed record. Verify boundaries, visitor information, and official protected-area designation against authoritative sources before publishing.',
    heroImageUrl: '/images/passu-cones.webp',
    imageAlt: 'Mountain landscape in Gilgit-Baltistan',
    primaryCategorySlug: 'protected-areas',
    additionalCategorySlugs: ['natural-wonders'],
    showOnMap: false,
    editorialNotes: 'Proposed example only. Do not publish until geographic details and protected-area sources are verified.',
    publicationStatus: 'draft' as PublicationStatus,
  },
  {
    name: 'Hussaini Suspension Bridge',
    slug: 'hussaini-suspension-bridge',
    destinationSlug: 'passu-gojal',
    destinationName: 'Passu & Gojal (Upper Hunza)',
    geographicArea: 'Hussaini, Upper Hunza',
    region: 'Gilgit-Baltistan',
    shortDescription: 'Proposed place entry. Verify access, safety information, and visitor guidance before publication.',
    description: 'Proposed seed record. Confirm current access conditions and safety guidance with reliable local sources before publishing.',
    heroImageUrl: '/images/passu-cones.webp',
    imageAlt: 'Mountain landscape in Gilgit-Baltistan',
    primaryCategorySlug: 'adventure-outdoors',
    showOnMap: false,
    editorialNotes: 'Proposed example only. Verify all location, access, and safety details before publication.',
    publicationStatus: 'draft' as PublicationStatus,
  },
];
