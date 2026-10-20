import type { CollectionConfig } from 'payload';
import { publishedContentReadAccess, staffContentWriteAccess } from './publishedContentAccess.ts';

export const Departure: CollectionConfig = {
  slug: 'departures',
  labels: {
    singular: 'Scheduled Departure',
    plural: 'Scheduled Departures',
  },
  access: {
    ...staffContentWriteAccess,
    read: publishedContentReadAccess,
  },
  admin: {
    useAsTitle: 'tour',
    defaultColumns: ['tour', 'startDate', 'endDate', 'capacity', 'departureStatus'],
    group: 'Trips & Departures',
    description: 'Specific scheduled dates and operational instances of tours and expeditions.',
  },
  fields: [
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      required: true,
      index: true,
    },
    { name: 'startDate', type: 'date', required: true, index: true },
    { name: 'endDate', type: 'date', required: true },
    {
      name: 'departureStatus',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled / Open', value: 'scheduled' },
        { label: 'Guaranteed Departure', value: 'guaranteed' },
        { label: 'Almost Full', value: 'almost_full' },
        { label: 'Fully Booked', value: 'sold_out' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'capacity', type: 'number', required: true, defaultValue: 12, min: 1 },
    { name: 'bookedTravellersCount', type: 'number', defaultValue: 0, min: 0 },
    { name: 'pricePerPerson', type: 'number', min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'leadGuide', type: 'text', admin: { description: 'Assigned expedition leader or head guide.' } },
    { name: 'operationalNotes', type: 'textarea', admin: { description: 'Internal team notes regarding permits, logistics, and vehicles.' } },
  ],
};
