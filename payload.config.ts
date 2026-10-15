// payload.config.ts
import { buildConfig } from 'payload'
import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Enquiry } from './src/collections/Enquiry'
import { Outbox } from './src/collections/Outbox'
import { Users } from './src/collections/Users'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-fallback-secret-hunza-expeditions-payload',
  // Core Payload settings
  csrf: [process.env.SERVER_URL || 'http://localhost:3000'],
  // Database adapter (PostgreSQL)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/hunza_expeditions',
    },
    // optional transaction options can be added here
  }),
  // Collections
  collections: [Users, Enquiry, Outbox],
  // Optional custom server config
  serverURL: process.env.SERVER_URL,
})
