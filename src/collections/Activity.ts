import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const Activity: CollectionConfig = {
  slug: 'activities',
  labels: {
    singular: 'Activity',
    plural: 'Activities',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'difficulty', 'seasonality', 'publicationStatus'],
    group: 'Activities & Experiences',
    description: 'Specific physical or cultural activities visitors can undertake in northern Pakistan.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hiking & Trekking', value: 'hiking_trekking' },
        { label: 'Mountaineering & Climbing', value: 'mountaineering_climbing' },
        { label: 'Boating & Water Activities', value: 'boating_water' },
        { label: 'Wildlife Watching', value: 'wildlife_watching' },
        { label: 'Photography', value: 'photography' },
        { label: 'Camping', value: 'camping' },
        { label: 'Cycling & Mountain Biking', value: 'cycling' },
        { label: 'Skiing & Snow Activities', value: 'skiing_snow' },
        { label: 'Cultural Workshops', value: 'cultural_workshops' },
        { label: 'Food & Culinary Activities', value: 'food_culinary' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'difficulty',
      type: 'select',
      defaultValue: 'Moderate',
      options: ['Gentle', 'Moderate', 'Challenging', 'Strenuous', 'Technical'],
    },
    { name: 'duration', type: 'text', admin: { description: 'e.g. 2-4 hours, Full day, Multi-day' } },
    { name: 'seasonality', type: 'text', admin: { description: 'e.g. May to October, Year-round' } },
    { name: 'suitablePlaces', type: 'relationship', relationTo: 'places', hasMany: true },
    { name: 'relatedExperiences', type: 'relationship', relationTo: 'experiences', hasMany: true },
    { name: 'relatedTours', type: 'relationship', relationTo: 'tours', hasMany: true },
    { name: 'equipmentNotes', type: 'textarea', admin: { description: 'Recommended equipment, footwear, or layers.' } },
    { name: 'safetyNotes', type: 'textarea', admin: { description: 'Important safety considerations or guide requirements.' } },
    { name: 'imageUrl', type: 'text' },
    { name: 'imageAlt', type: 'text' },
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
