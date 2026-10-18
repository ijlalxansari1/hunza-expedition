// payload.config.ts
import { buildConfig } from 'payload'
import path from 'node:path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Destination } from './src/collections/Destination.ts'
import { Article } from './src/collections/Article.ts'
import { Author } from './src/collections/Author.ts'
import { Enquiry } from './src/collections/Enquiry.ts'
import { Experience } from './src/collections/Experience.ts'
import { FAQ } from './src/collections/FAQ.ts'
import { Outbox } from './src/collections/Outbox.ts'
import { OfficialDesignation } from './src/collections/OfficialDesignation.ts'
import { Place } from './src/collections/Place.ts'
import { PlaceCategory } from './src/collections/PlaceCategory.ts'
import { Tour } from './src/collections/Tour.ts'
import { Users } from './src/collections/Users.ts'

const isProduction = process.env.NODE_ENV === 'production'
const payloadSecret = process.env.PAYLOAD_SECRET ||
  (isProduction ? undefined : 'development-only-payload-secret')
const databaseUrl = process.env.DATABASE_URL ||
  (isProduction ? undefined : 'postgres://postgres:postgres@127.0.0.1:5432/hunza_expeditions')

function normalizeDatabaseSslMode(connectionString: string): string {
  const url = new URL(connectionString)
  if (url.searchParams.get('sslmode') === 'require') {
    url.searchParams.set('sslmode', 'verify-full')
  }
  return url.toString()
}

if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET must be configured in production.')
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be configured in production.')
}

export default buildConfig({
  secret: payloadSecret,
  admin: {
    user: 'users',
    components: {
      views: {
        dashboard: {
          Component: '@/components/admin/Overview#Overview',
        },
      },
    },
  },
  // Core Payload settings
  csrf: [process.env.SERVER_URL || 'http://localhost:3000'],
  // Database adapter (PostgreSQL)
  db: postgresAdapter({
    pool: {
      connectionString: normalizeDatabaseSslMode(databaseUrl),
    },
    migrationDir: path.resolve(process.cwd(), 'src/migrations'),
    push: false,
  }),
  // Collections
  collections: [
    Users,
    Author,
    Enquiry,
    Outbox,
    Destination,
    Place,
    PlaceCategory,
    OfficialDesignation,
    Tour,
    Experience,
    Article,
    FAQ,
  ],
  // Optional custom server config
  serverURL: process.env.SERVER_URL,
})
