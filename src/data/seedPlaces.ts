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
  if (/fort|watchtower|castle/i.test(name)) {
    return { primaryCategorySlug: 'forts', additionalCategorySlugs: ['culture-heritage'] };
  }
  if (/historic|village|settlement|bazaar/i.test(name)) {
    return { primaryCategorySlug: 'culture-heritage' };
  }
  if (/glacier/i.test(name)) {
    return { primaryCategorySlug: 'glaciers', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/meadow|pasture/i.test(name)) {
    return { primaryCategorySlug: 'meadows', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/pass/i.test(name)) {
    return { primaryCategorySlug: 'mountain-passes', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/national park/i.test(name)) {
    return { primaryCategorySlug: 'protected-areas', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/hotel|lodge|camp|stay|resort/i.test(name)) {
    return { primaryCategorySlug: 'places-to-stay' };
  }
  if (/lake|river|waterfall/i.test(name)) {
    return { primaryCategorySlug: 'lakeside-scenic', additionalCategorySlugs: ['natural-wonders'] };
  }
  if (/peak|mountain|range/i.test(name)) {
    return { primaryCategorySlug: 'mountains-peaks', additionalCategorySlugs: ['natural-wonders'] };
  }
  return { primaryCategorySlug: 'natural-wonders' };
}

const placeCoordinates: Record<string, { lat: number; lng: number }> = {
  'baltit-fort': { lat: 36.3262, lng: 74.6713 },
  'altit-fort': { lat: 36.3144, lng: 74.6936 },
  'attabad-lake': { lat: 36.3389, lng: 74.8694 },
  'passu-cones-passu-glacier': { lat: 36.4682, lng: 74.8947 },
  'hopar-valley-hopar-glacier': { lat: 36.2167, lng: 74.7833 },
  'minapin-diran-base-camp-approach': { lat: 36.2514, lng: 74.5369 },
  'katpana-sarfaranga-cold-deserts': { lat: 35.3142, lng: 75.5861 },
  'shigar-fort-fong-khar': { lat: 35.4286, lng: 75.7428 },
  'lower-upper-kachura-lakes': { lat: 35.4481, lng: 75.4497 },
  'passu-suspension-bridges': { lat: 36.4862, lng: 74.8872 },
  'borith-lake-wildlife-sanctuary': { lat: 36.4278, lng: 74.8611 },
  'khunjerab-pass-4-693m': { lat: 36.8497, lng: 75.4281 },
};

export const initialPlaces = initialDestinations.flatMap((destination) => (
  destination.placesOfInterest?.map((place) => {
    const slugSuffix = toSlug(place.name);
    const specificCoords = placeCoordinates[slugSuffix] ?? destination.coordinates;

    return {
      name: place.name,
      slug: `${destination.slug}-${slugSuffix}`,
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
      coordinates: specificCoords,
      showOnMap: Boolean(specificCoords),
      publicationStatus: 'published' as const,
    };
  }) ?? []
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
