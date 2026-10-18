import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_places_publication_status" AS ENUM('draft', 'review', 'approved', 'published');
    CREATE TYPE "public"."enum_experiences_operational_status" AS ENUM('Proposed', 'In Review', 'Operationally Approved');
    CREATE TYPE "public"."enum_experiences_publication_status" AS ENUM('draft', 'review', 'approved', 'published');
    CREATE TYPE "public"."enum_articles_publication_status" AS ENUM('draft', 'review', 'approved', 'published');
    CREATE TYPE "public"."enum_faqs_category" AS ENUM('planning', 'practical', 'seasons', 'tours', 'culture');
    CREATE TYPE "public"."enum_faqs_publication_status" AS ENUM('draft', 'review', 'approved', 'published');

    CREATE TABLE "places" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "destination_slug" varchar NOT NULL,
      "destination_name" varchar NOT NULL,
      "region" varchar NOT NULL,
      "short_description" varchar NOT NULL,
      "description" varchar,
      "hero_image_url" varchar,
      "image_alt" varchar,
      "location_note" varchar,
      "verified_heritage_status" varchar,
      "coordinates" jsonb,
      "publication_status" "public"."enum_places_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "experiences" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "location" varchar NOT NULL,
      "category" varchar NOT NULL,
      "duration" varchar NOT NULL,
      "season" varchar NOT NULL,
      "description" varchar NOT NULL,
      "image_url" varchar NOT NULL,
      "operational_status" "public"."enum_experiences_operational_status" DEFAULT 'In Review' NOT NULL,
      "publication_status" "public"."enum_experiences_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "articles" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "category" varchar NOT NULL,
      "excerpt" varchar NOT NULL,
      "content" varchar,
      "image_url" varchar NOT NULL,
      "read_time_minutes" numeric NOT NULL,
      "author" varchar,
      "published_at" timestamp(3) with time zone,
      "related_destinations" jsonb DEFAULT '[]'::jsonb,
      "publication_status" "public"."enum_articles_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "faqs" (
      "id" serial PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL,
      "category" "public"."enum_faqs_category" NOT NULL,
      "display_order" numeric DEFAULT 0 NOT NULL,
      "publication_status" "public"."enum_faqs_publication_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "places_slug_idx" ON "places" USING btree ("slug");
    CREATE INDEX "places_destination_slug_idx" ON "places" USING btree ("destination_slug");
    CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
    CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
    CREATE UNIQUE INDEX "experiences_slug_idx" ON "experiences" USING btree ("slug");
    CREATE INDEX "experiences_updated_at_idx" ON "experiences" USING btree ("updated_at");
    CREATE INDEX "experiences_created_at_idx" ON "experiences" USING btree ("created_at");
    CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
    CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
    CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
    CREATE INDEX "faqs_display_order_idx" ON "faqs" USING btree ("display_order");
    CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
    CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "places" CASCADE;
    DROP TABLE "experiences" CASCADE;
    DROP TABLE "articles" CASCADE;
    DROP TABLE "faqs" CASCADE;
    DROP TYPE "public"."enum_places_publication_status";
    DROP TYPE "public"."enum_experiences_operational_status";
    DROP TYPE "public"."enum_experiences_publication_status";
    DROP TYPE "public"."enum_articles_publication_status";
    DROP TYPE "public"."enum_faqs_category";
    DROP TYPE "public"."enum_faqs_publication_status";
  `);
}
