# Admin Setup

The Payload admin is available at `/admin`. It uses the `users` collection for authentication. The first administrator is created once through `/admin/create-first-user` after the database schema has been installed; Payload disables first-user registration after that account exists.

## CMS Responsibilities

- Payload at `/admin` is the only CMS. It manages users, enquiries, destinations, places, tours, community experiences, travel guides/blog articles, author profiles, and FAQs. Legacy `/studio` URLs permanently redirect to `/admin`.
- Published Payload content is rendered dynamically on the public site. Staff can edit or publish these records without rebuilding the site. Bookings and payment tracking are not configured.

## Recovering Admin Access

There are no default credentials. If the existing administrator password is lost and email delivery has not been configured for password resets, run the local recovery script from the repository root:

```bash
node --env-file=.env.local --experimental-strip-types scripts/reset-admin-password.ts
```

The script asks for the existing administrator's email and a new password in the terminal. Password input is hidden. It only updates the password of one matching account whose role is already `admin`; it does not create accounts or change roles. Run it only on a trusted machine with access to the intended database, and do not paste passwords into chat, shell arguments, or source control. Then sign in at `/admin`.

## Required Environment

Configure `DATABASE_URL`, `PAYLOAD_SECRET`, and `SERVER_URL` in the server environment. Keep these values out of browser code and source control. Production startup intentionally fails when the database URL or Payload secret is missing.

## Database Migration

Payload schema auto-push is disabled. Review and back up the target database before applying migrations. The baseline at `src/migrations/20231015_155342_baseline_payload_schema.ts` creates the initial users, enquiries, and outbox schema. `src/migrations/20261018_114900_enquiry_workflow.ts` adds the enquiry fields required by the current form. `src/migrations/20261018_150600_payload_catalog.ts` creates the Payload destinations and tours collections. The editorial content migration creates places, experiences, articles, and FAQs. `src/migrations/20261018_201000_article_editorial_fields.ts` adds the article rich-text, blog/guide type, tags, author profile, and related-content fields. Apply registered migrations with:

```bash
npx payload migrate
```

Review and back up the target database before applying migrations, especially in production. Check the pending migration list with `npx payload migrate:status` first.

## Importing Existing Enquiries

The legacy `data/enquiries.json` file is retained as an import source and is not modified or deleted by migrations. After applying the database migrations, preview and apply the idempotent import:

```bash
npm run payload:import-enquiries -- --validate-only
npm run payload:import-enquiries -- --dry-run
npm run payload:import-enquiries -- --apply
```

The validation mode checks the source file without contacting the database. The dry run checks for duplicates but writes nothing. Applying preserves reference IDs, submission timestamps, trip details, status, and internal notes; it skips records whose reference ID already exists in Payload. Back up the file and database before importing; do not remove the JSON file until the import has been verified.

## Loading Existing Website Content

The website keeps its built-in destination, place, tour, experience, guide, and FAQ seed data as a fallback until records are added to the corresponding Payload collection. After migrating the database, preview and import those records into Payload:

```bash
npm run payload:import-content -- --dry-run
npm run payload:import-content -- --apply
```

The importer skips slugs that already exist. After verifying imported content in the Payload admin collections, those records are served by the public website. Existing starter guides contain the summaries already present on the site. New articles can use the Lexical rich-text editor, categories, tags, managed author profiles, SEO/social metadata, and related content. Set the article type to Guide or Blog Post to publish at `/guides/[slug]` or `/blog/[slug]`. The article preview action requires a signed-in Payload staff account; draft content is available only in that authenticated preview session.

## Current Data Sources and Limits

Destinations, places, tours, community experiences, guides/blog posts, and FAQs are read from Payload/PostgreSQL and rendered dynamically. An entirely empty collection uses its bundled starter records; once records are added to a collection, only its published Payload records are shown. Starter guides include the existing summaries only, so editors can add full article copy in the article content field. Booking requests are recorded as enquiries; payment processing and payment tracking are not configured.

## Tour Booking Requests and Payment

Travellers can add published tours to a browser-persisted trip basket and send one booking request with their dates, party details, and preferred payment method. Requests are stored with enquiries in Payload for staff review. Prices shown before confirmation are indicative; sending a request does not confirm availability, create a booking, or collect money. The traveller's card or bank-transfer selection is only a preference. Staff must confirm the itinerary, final price, terms, and secure payment instructions with the traveller.

The site does not currently integrate a payment processor and never collects card numbers. Before enabling live card payments for the UK business, configure an approved processor (for example, Stripe Checkout), secure server-side credentials and webhook verification, and a confirmed-price/deposit workflow. Do not request or store payment card data in Payload.
