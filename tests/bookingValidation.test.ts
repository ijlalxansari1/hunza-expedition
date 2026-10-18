import { bookingRequestSchema } from '../src/lib/validations/booking';

const validRequest = {
  website_field: '',
  fullName: 'Alex Traveller',
  email: 'alex@example.test',
  phone: '',
  countryOfResidence: 'United Kingdom',
  startDate: '2099-06-15',
  dateFlexibility: 'exact',
  adultsCount: 2,
  childrenCount: 1,
  childrenAges: '8',
  preferredContact: 'email',
  paymentPreference: 'card',
  specialRequests: '',
  privacyConsent: true,
  tours: ['hunza-valley-highlights'],
};

describe('Tour booking request validation', () => {
  it('accepts a valid booking request and payment preference', () => {
    expect(bookingRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it('rejects duplicate tours and oversized groups', () => {
    expect(bookingRequestSchema.safeParse({ ...validRequest, tours: ['tour-a', 'tour-a'] }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...validRequest, adultsCount: 30, childrenCount: 1 }).success).toBe(false);
  });

  it('rejects invalid dates, missing consent, and invalid payment options', () => {
    expect(bookingRequestSchema.safeParse({ ...validRequest, startDate: '2099-02-30' }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...validRequest, privacyConsent: false }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...validRequest, paymentPreference: 'cash' }).success).toBe(false);
  });
});
