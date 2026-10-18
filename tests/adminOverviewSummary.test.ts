import {
  adminEnquiryListSchema,
  summarizeEnquiries,
} from '../src/lib/adminOverviewSummary';

describe('admin enquiry overview summary', () => {
  it('counts new and in-progress statuses from persisted records', () => {
    const enquiries = adminEnquiryListSchema.parse([
      {
        referenceId: 'HX-2026-1001',
        fullName: 'Test Traveller',
        email: 'traveller@example.test',
        submittedAt: '2026-10-15T10:00:00.000Z',
        status: 'new',
        selectedDestinations: ['Hunza Valley'],
      },
      {
        referenceId: 'HX-2026-1002',
        fullName: 'Another Traveller',
        email: 'another@example.test',
        submittedAt: '2026-10-14T10:00:00.000Z',
        status: 'under_review',
        selectedDestinations: ['Skardu'],
      },
      {
        referenceId: 'HX-2026-1003',
        fullName: 'Former Traveller',
        email: 'former@example.test',
        submittedAt: '2026-10-13T10:00:00.000Z',
        status: 'closed',
        selectedDestinations: ['Nagar'],
      },
    ]);

    expect(summarizeEnquiries(enquiries)).toMatchObject({
      state: 'available',
      total: 3,
      newCount: 1,
      inProgressCount: 1,
    });
  });

  it('distinguishes an empty persisted store from an unavailable store', () => {
    expect(summarizeEnquiries([])).toEqual({
      state: 'available',
      total: 0,
      newCount: 0,
      inProgressCount: 0,
      recent: [],
    });
  });

  it('uses database totals when only recent records are loaded', () => {
    const enquiries = adminEnquiryListSchema.parse([
      {
        referenceId: 'HX-2026-1001',
        fullName: 'Test Traveller',
        email: 'traveller@example.test',
        submittedAt: '2026-10-15T10:00:00.000Z',
        status: 'new',
        selectedDestinations: ['Hunza Valley'],
      },
    ]);

    expect(summarizeEnquiries(enquiries, {
      total: 24,
      newCount: 5,
      inProgressCount: 8,
    })).toMatchObject({
      total: 24,
      newCount: 5,
      inProgressCount: 8,
      recent: enquiries,
    });
  });

  it('keeps only the latest ten records for the dashboard activity panel', () => {
    const enquiries = adminEnquiryListSchema.parse(
      Array.from({ length: 12 }, (_, index) => ({
        referenceId: `HX-2026-${1000 + index}`,
        fullName: `Traveller ${index}`,
        email: `traveller${index}@example.test`,
        submittedAt: new Date(Date.UTC(2026, 9, 17 - index)).toISOString(),
        status: 'new',
        selectedDestinations: ['Hunza Valley'],
      })),
    );

    const overview = summarizeEnquiries(enquiries);

    expect(overview.state).toBe('available');
    if (overview.state === 'available') {
      expect(overview.total).toBe(12);
      expect(overview.recent).toHaveLength(10);
      expect(overview.recent[0].referenceId).toBe(enquiries[0].referenceId);
      expect(overview.recent[9].referenceId).toBe(enquiries[9].referenceId);
    }
  });
});