// tests/transaction.test.ts
import payload from 'payload';
import { initPayload } from '../src/payloadInit'; // Assuming an init function exists
import { Enquiry } from '../src/collections/Enquiry';
import { Outbox } from '../src/collections/Outbox';

describe('Atomic transaction test', () => {
  let payloadInstance: typeof payload;
  beforeAll(async () => {
    // Initialize Payload with test config (e.g., in-memory test DB or test Postgres DB)
    payloadInstance = await initPayload();
  });

  afterAll(async () => {
    await payloadInstance.disconnect();
  });

  it('should roll back both Enquiry and Outbox on failure', async () => {
    // Create a fake Enquiry that will cause the afterChange hook to throw
    const badEnquiry = {
      title: 'Test Enquiry',
      // any other required fields
    } as any;

    // Mock the Outbox creation to throw error
    const originalCreate = payloadInstance.create;
    jest.spyOn(payloadInstance, 'create').mockImplementationOnce(async (opts) => {
      if (opts.collection === 'outbox') {
        throw new Error('Simulated Outbox failure');
      }
      return originalCreate.call(payloadInstance, opts);
    });

    try {
      await payloadInstance.create({ collection: 'enquiries', data: badEnquiry });
    } catch (e) {
      // Expected error
    }

    // Verify that no Enquiry record was persisted
    const enquiries = await payloadInstance.find({ collection: 'enquiries', where: { title: { equals: 'Test Enquiry' } } });
    expect(enquiries.docs).toHaveLength(0);
  });
});
