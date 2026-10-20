import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

function relationshipIds(value: unknown): number[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return values.flatMap((item) => {
    if (typeof item === 'number') return [item];
    if (typeof item === 'object' && item !== null && 'id' in item && typeof item.id === 'number') {
      return [item.id];
    }
    return [];
  });
}

function isHttpUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export const Place: CollectionConfig = {
  slug: 'places',
  labels: {
    singular: 'Place',
    plural: 'Places & Attractions',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'geographicArea', 'region', 'primaryCategory', 'publicationStatus'],
    group: 'Places & Accommodation',
    preview: (doc) => {
      if (typeof doc.slug !== 'string') return null;
      const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
      return `${baseUrl}/api/preview?type=place&slug=${encodeURIComponent(doc.slug)}`;
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const publicationStatus = data.publicationStatus ?? originalDoc?.publicationStatus;
        const primaryCategory = data.primaryCategory ?? originalDoc?.primaryCategory;
        const primaryCategoryId = relationshipIds(primaryCategory)[0];
        const additionalCategoryIds = relationshipIds(
          data.additionalCategories ?? originalDoc?.additionalCategories,
        );
        const designationIds = relationshipIds(
          data.officialDesignations ?? originalDoc?.officialDesignations,
        );
        const sourceLinks = data.sourceLinks ?? originalDoc?.sourceLinks ?? [];

        for (const source of sourceLinks) {
          if (source.verificationStatus === 'verified' && (
            !isHttpUrl(source.url) || !source.lastVerifiedAt
          )) {
            throw new Error('Verified place sources require a valid HTTP(S) URL and last-verified date.');
          }
        }

        if (publicationStatus === 'published' && !primaryCategoryId) {
          throw new Error('Published places must have a primary category.');
        }

        for (const categoryId of [...new Set([primaryCategoryId, ...additionalCategoryIds].filter(
          (id): id is number => typeof id === 'number',
        ))]) {
          const category = await req.payload.findByID({
            collection: 'place-categories',
            id: categoryId,
            depth: 0,
            overrideAccess: true,
          });
          if (publicationStatus === 'published' && (
            !category.isActive || category.publicationStatus !== 'published'
          )) {
            throw new Error('Published places can only use active, published categories.');
          }
        }

        if (publicationStatus === 'published') {
          for (const designationId of designationIds) {
            const designation = await req.payload.findByID({
              collection: 'official-designations',
              id: designationId,
              depth: 0,
              overrideAccess: true,
            });
            if (
              designation.publicationStatus !== 'published'
              || designation.verificationStatus !== 'verified'
              || !designation.lastVerifiedAt
              || !isHttpUrl(designation.officialSourceUrl)
            ) {
              throw new Error('Published places can only reference published, verified designations with a source and verification date.');
            }
          }
        }

        return data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'destinationSlug', type: 'text', required: true, index: true },
    { name: 'destinationName', type: 'text', required: true },
    { name: 'region', type: 'text', required: true },
    { name: 'geographicArea', type: 'text', required: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'heroImageUrl', type: 'text' },
    { name: 'imageAlt', type: 'text' },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'imageUrl', type: 'text', required: true },
        { name: 'imageAlt', type: 'text', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    { name: 'locationNote', type: 'text' },
    {
      name: 'primaryCategory',
      type: 'relationship',
      relationTo: 'place-categories',
      index: true,
    },
    { name: 'additionalCategories', type: 'relationship', relationTo: 'place-categories', hasMany: true },
    { name: 'travelTypes', type: 'array', fields: [{ name: 'travelType', type: 'text', required: true }] },
    { name: 'relatedExperiences', type: 'relationship', relationTo: 'experiences', hasMany: true },
    { name: 'relatedTours', type: 'relationship', relationTo: 'tours', hasMany: true },
    { name: 'relatedArticles', type: 'relationship', relationTo: 'articles', hasMany: true },
    { name: 'officialDesignations', type: 'relationship', relationTo: 'official-designations', hasMany: true },
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
    { name: 'showOnMap', type: 'checkbox', defaultValue: false },
    { name: 'mapMarkerLabel', type: 'text' },
    {
      name: 'sourceLinks',
      type: 'array',
      admin: { description: 'Sources used to verify public place details.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'verificationStatus', type: 'select', required: true, defaultValue: 'pending', options: [
          { label: 'Pending verification', value: 'pending' },
          { label: 'Verified', value: 'verified' },
          { label: 'Not verified', value: 'not_verified' },
        ] },
        { name: 'lastVerifiedAt', type: 'date' },
      ],
    },
    { name: 'editorialNotes', type: 'textarea', admin: { description: 'Internal notes; never shown publicly.' } },
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
