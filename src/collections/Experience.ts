import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const Experience: CollectionConfig = {
  slug: 'experiences',
  labels: {
    singular: 'Experience',
    plural: 'Community Experiences',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'operationalStatus', 'publicationStatus'],
    group: 'Travel content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'location', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'season', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'imageUrl', type: 'text', required: true },
    {
      name: 'operationalStatus',
      type: 'select',
      required: true,
      defaultValue: 'In Review',
      options: ['Proposed', 'In Review', 'Operationally Approved'],
    },
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
