import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const FAQ: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'displayOrder', 'publicationStatus'],
    group: 'Stories, Guides & Pages',
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['planning', 'practical', 'seasons', 'tours', 'culture'],
    },
    { name: 'displayOrder', type: 'number', required: true, defaultValue: 0 },
    {
      name: 'publicationStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'review', 'approved', 'published'],
    },
  ],
};
