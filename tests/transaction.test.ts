import { afterChangeHook } from '../src/hooks/enquiryAfterChange';

describe('Enquiry after-change hook', () => {
  it('creates the outbox entry using the enquiry request transaction', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'outbox-1' });
    const req = { payload: { create }, context: {} };
    const args = {
      req,
      operation: 'create',
      doc: {
        id: 'enquiry-1',
        referenceId: 'HX-2026-1234',
        fullName: 'Test Traveller',
        email: 'traveller@example.com',
        selectedDestinations: ['Hunza'],
        specialRequests: 'Please plan a trip to Hunza.',
      },
    } as unknown as Parameters<typeof afterChangeHook>[0];

    await afterChangeHook(args);

    expect(create).toHaveBeenCalledWith({
      req,
      collection: 'outbox',
      data: {
        enquiryId: 'enquiry-1',
        emailPayload: {
          to: 'traveller@example.com',
          subject: 'New journey enquiry: HX-2026-1234',
          body: 'Reference: HX-2026-1234\nName: Test Traveller\nEmail: traveller@example.com\nDestinations: Hunza\nPlease plan a trip to Hunza.',
        },
      },
    });
  });

  it('does not create another outbox entry when an enquiry is updated', async () => {
    const create = jest.fn();
    const req = { payload: { create }, context: {} };
    const args = {
      req,
      operation: 'update',
      doc: { id: 'enquiry-1' },
    } as unknown as Parameters<typeof afterChangeHook>[0];

    await afterChangeHook(args);

    expect(create).not.toHaveBeenCalled();
  });

  it('does not queue notifications for imported historical enquiries', async () => {
    const create = jest.fn();
    const req = { payload: { create }, context: { skipEnquiryOutbox: true } };
    const args = {
      req,
      operation: 'create',
      doc: { id: 'enquiry-1' },
    } as unknown as Parameters<typeof afterChangeHook>[0];

    await afterChangeHook(args);

    expect(create).not.toHaveBeenCalled();
  });
});
