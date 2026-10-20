import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const Accommodation: CollectionConfig = {
  slug: 'accommodation',
  labels: {
    singular: 'Accommodation',
    plural: 'Places to Stay & Lodges',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'propertyType', 'geographicArea', 'region', 'publicationStatus'],
    group: 'Places & Accommodation',
    description: 'Lodging properties, heritage hotels, boutique inns, and verified campsites.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'propertyType',
      type: 'select',
      required: true,
      defaultValue: 'hotel',
      options: [
        { label: 'Heritage Hotel & Palace', value: 'heritage_hotel' },
        { label: 'Hotel', value: 'hotel' },
        { label: 'Boutique Lodge', value: 'boutique_lodge' },
        { label: 'Traditional Guesthouse', value: 'guesthouse' },
        { label: 'Glamping / Fixed Camp', value: 'glamping' },
        { label: 'Wild Camping Site', value: 'campsite' },
      ],
    },
    { name: 'geographicArea', type: 'text', required: true },
    { name: 'region', type: 'text', required: true, defaultValue: 'Gilgit-Baltistan' },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'overview', type: 'textarea' },
    { name: 'heroImageUrl', type: 'text' },
    { name: 'imageAlt', type: 'text' },
    {
      name: 'coordinates',
      type: 'json',
      validate: (value) => {
        if (value == null) return true;
        if (typeof value !== 'object' || Array.isArray(value) || !('lat' in value) || !('lng' in value)) {
          return 'Coordinates must contain numeric lat and lng values.';
        }
        const { lat, lng } = value as { lat: unknown; lng: unknown };
        return (
          typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90
          && typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180
        ) || 'Latitude must be from -90 to 90 and longitude from -180 to 180.';
      },
    },
    { name: 'showOnMap', type: 'checkbox', defaultValue: true },
    { name: 'locationNote', type: 'text' },
    { name: 'nearbyPlaces', type: 'relationship', relationTo: 'places', hasMany: true },
    { name: 'facilities', type: 'array', fields: [{ name: 'facility', type: 'text', required: true }] },
    { name: 'seasonality', type: 'text', admin: { description: 'e.g. April to November, Open year-round' } },
    { name: 'verificationStatus', type: 'select', defaultValue: 'verified', options: [
      { label: 'Verified partner / property', value: 'verified' },
      { label: 'Pending inspection', value: 'pending' },
    ] },
    {
      name: 'publicationStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'published'],
    },
    { name: 'seoTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
};
