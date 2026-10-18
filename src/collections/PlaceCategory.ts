import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

function relationshipId(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'number') {
    return value.id;
  }
  return null;
}

export const PlaceCategory: CollectionConfig = {
  slug: 'place-categories',
  labels: { singular: 'Place Category', plural: 'Place Categories' },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parentCategory', 'displayOrder', 'isActive', 'publicationStatus'],
    group: 'Travel content',
    description: 'Manage place classifications and category landing pages.',
    preview: (doc) => {
      if (typeof doc.slug !== 'string') return null;
      const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
      return `${baseUrl}/api/preview?type=place-category&slug=${encodeURIComponent(doc.slug)}`;
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const parentId = relationshipId(data.parentCategory);
        if (parentId === null) return data;

        const currentId = typeof originalDoc?.id === 'number' ? originalDoc.id : null;
        const visited = new Set<number>();
        let ancestorId: number | null = parentId;

        while (ancestorId !== null) {
          if (ancestorId === currentId) {
            throw new Error('A category cannot be its own ancestor.');
          }
          if (visited.has(ancestorId)) {
            throw new Error('The selected parent already belongs to a category cycle.');
          }
          visited.add(ancestorId);

          const ancestor = await req.payload.findByID({
            collection: 'place-categories',
            id: ancestorId,
            depth: 0,
            overrideAccess: true,
          });
          ancestorId = relationshipId(ancestor.parentCategory);
        }

        return data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'place-categories',
      index: true,
    },
    { name: 'imageUrl', type: 'text' },
    { name: 'imageAlt', type: 'text' },
    { name: 'iconName', type: 'text', admin: { description: 'Optional Lucide icon name used by the places UI.' } },
    {
      name: 'markerColor',
      type: 'text',
      validate: (value: unknown) => (
        value == null || value === '' || (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value))
          ? true
          : 'Use a six-digit hex colour, for example #176b3a.'
      ),
    },
    { name: 'displayOrder', type: 'number', required: true, defaultValue: 0, min: 0 },
    { name: 'isActive', type: 'checkbox', required: true, defaultValue: true },
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
