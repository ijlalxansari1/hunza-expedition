import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_destinations_publication_status" AS ENUM('draft', 'review', 'approved', 'published');
    CREATE TYPE "public"."enum_tours_difficulty" AS ENUM('Gentle', 'Moderate', 'Challenging', 'Strenuous');
    CREATE TYPE "public"."enum_tours_publication_status" AS ENUM('draft', 'review', 'approved', 'published');

    CREATE TABLE "destinations" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "region" varchar NOT NULL,
      "short_description" varchar NOT NULL,
      "overview" varchar NOT NULL,
      "hero_image_url" varchar NOT NULL,
      "gallery_urls" jsonb DEFAULT '[]'::jsonb,
      "coordinates" jsonb,
      "places_of_interest" jsonb DEFAULT '[]'::jsonb,
      "best_time_to_visit" jsonb,
      "transport_notes" varchar,
      "practical_info" jsonb DEFAULT '[]'::jsonb,
      "safety_notes" varchar,
      "publication_status" "public"."enum_destinations_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "tours" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "short_summary" varchar NOT NULL,
      "full_description" varchar NOT NULL,
      "hero_image_url" varchar NOT NULL,
      "gallery_urls" jsonb DEFAULT '[]'::jsonb,
      "destinations" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "duration_days" numeric NOT NULL,
      "difficulty" "public"."enum_tours_difficulty" NOT NULL,
      "activity_categories" jsonb DEFAULT '[]'::jsonb,
      "travel_style" varchar NOT NULL,
      "season" varchar NOT NULL,
      "itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "price" numeric,
      "currency" varchar,
      "pricing_basis" varchar,
      "is_price_confirmed" boolean DEFAULT false NOT NULL,
      "inclusions" jsonb DEFAULT '[]'::jsonb,
      "exclusions" jsonb DEFAULT '[]'::jsonb,
      "packing_requirements" jsonb DEFAULT '[]'::jsonb,
      "safety_notes" varchar,
      "publication_status" "public"."enum_tours_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
    CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
    CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
    CREATE UNIQUE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");
    CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
    CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "destinations" CASCADE;
    DROP TABLE "tours" CASCADE;
    DROP TYPE "public"."enum_destinations_publication_status";
    DROP TYPE "public"."enum_tours_difficulty";
    DROP TYPE "public"."enum_tours_publication_status";
  `);
}
