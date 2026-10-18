import { storedEnquirySchema, toPayloadEnquiryData } from '../src/lib/enquiryData';

describe('Payload enquiry data mapping', () => {
  it('preserves enquiry details and excludes the anti-spam honeypot', () => {
    const enquiry = storedEnquirySchema.parse({
      website_field: '',
      fullName: 'Test Traveller',
      email: 'traveller@example.test',
      phone: '',
      preferredContact: 'email',
      countryOfResidence: 'Pakistan',
      startDate: '',
      dateFlexibility: 'flexible_few_days',
      durationDays: 7,
      adultsCount: 2,
      childrenCount: 0,
      childrenAges: '',
      budgetPerPerson: '',
      budgetCurrency: 'USD',
      accommodationStyle: 'comfort_hotels',
      selectedDestinations: ['Hunza Valley'],
      selectedInterests: ['culture'],
      specialRequests: 'A quiet itinerary, please.',
      privacyConsent: true,
      referenceId: 'HX-2026-1001',
      submittedAt: '2026-10-15T10:00:00.000Z',
      status: 'new',
      internalNotes: 'Received through the website.',
    });

    const payloadData = toPayloadEnquiryData(enquiry);

    expect(payloadData).toMatchObject({
      fullName: 'Test Traveller',
      selectedDestinations: ['Hunza Valley'],
      selectedInterests: ['culture'],
      referenceId: 'HX-2026-1001',
      privacyConsent: true,
    });
    expect(payloadData).not.toHaveProperty('website_field');
  });
});
