// src/migrations/20231016-create-outbox.ts
import payload from 'payload';
import config from '../../payload.config';

export const up = async () => {
  // Payload will create the Outbox collection automatically when the config is loaded.
  // This migration is a placeholder to ensure the migration system records the change.
  await payload.init({ config });
};

export const down = async () => {
  // Remove the Outbox collection (drops the table).
  const initializedPayload = await (payload as any).init({ config });
  if (initializedPayload.deleteCollection) {
    await initializedPayload.deleteCollection({ collection: 'outbox' });
  }
};
