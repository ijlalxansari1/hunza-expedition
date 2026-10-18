import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_place_categories_publication_status" AS ENUM('draft', 'review', 'approved', 'published');
    CREATE TYPE "public"."enum_official_designations_designation_type" AS ENUM(
      'unesco_world_heritage',
      'unesco_tentative_list',
      'unesco_intangible_heritage',
      'unesco_global_geopark',
      'unesco_biosphere_reserve',
      'unesco_other',
      'national_protected_area',
      'other_official'
    );
    CREATE TYPE "public"."enum_official_designations_designation_status" AS ENUM(
      'inscribed',
      'tentative_list',
      'recognized_element',
      'designated',
      'proposed'
    );
    CREATE TYPE "public"."enum_official_designations_verification_status" AS ENUM(
      'pending',
      'verified',
      'not_verified',
      'rejected'
    );
    CREATE TYPE "public"."enum_official_designations_publication_status" AS ENUM('draft', 'review', 'approved', 'published');

    CREATE TABLE "place_categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "parent_category_id" integer,
      "image_url" varchar,
      "image_alt" varchar,
      "icon_name" varchar,
      "marker_color" varchar,
      "display_order" numeric DEFAULT 0 NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "publication_status" "public"."enum_place_categories_publication_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "place_categories_parent_category_id_fk"
        FOREIGN KEY ("parent_category_id") REFERENCES "public"."place_categories"("id")
        ON DELETE set null ON UPDATE no action
    );

    CREATE TABLE "official_designations" (
      "id" serial PRIMARY KEY NOT NULL,
      "official_name" varchar NOT NULL,
      "designation_type" "public"."enum_official_designations_designation_type" NOT NULL,
      "designation_status" "public"."enum_official_designations_designation_status" NOT NULL,
      "geographic_area" varchar NOT NULL,
      "country_or_area" varchar NOT NULL,
      "official_source_url" varchar NOT NULL,
      "verification_status" "public"."enum_official_designations_verification_status" DEFAULT 'pending' NOT NULL,
      "last_verified_at" timestamp(3) with time zone,
      "editorial_notes" varchar,
      "publication_status" "public"."enum_official_designations_publication_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "places"
      ADD COLUMN "geographic_area" varchar DEFAULT '' NOT NULL,
      ADD COLUMN "primary_category_id" integer,
      ADD COLUMN "show_on_map" boolean DEFAULT false,
      ADD COLUMN "map_marker_label" varchar,
      ADD COLUMN "editorial_notes" varchar;

    UPDATE "places" SET "geographic_area" = "destination_name" WHERE "geographic_area" = '';

    ALTER TABLE "places"
      ADD CONSTRAINT "places_primary_category_id_place_categories_id_fk"
        FOREIGN KEY ("primary_category_id") REFERENCES "public"."place_categories"("id")
        ON DELETE set null ON UPDATE no action;

    CREATE TABLE "places_gallery" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "image_url" varchar NOT NULL,
      "image_alt" varchar NOT NULL,
      "caption" varchar,
      CONSTRAINT "places_gallery_parent_id_places_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id")
        ON DELETE cascade ON UPDATE no action
    );

    CREATE TABLE "places_travel_types" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "travel_type" varchar NOT NULL,
      CONSTRAINT "places_travel_types_parent_id_places_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id")
        ON DELETE cascade ON UPDATE no action
    );

    CREATE TABLE "places_source_links" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "title" varchar NOT NULL,
      "url" varchar NOT NULL,
      "verification_status" varchar DEFAULT 'pending' NOT NULL,
      "last_verified_at" timestamp(3) with time zone,
      CONSTRAINT "places_source_links_parent_id_places_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id")
        ON DELETE cascade ON UPDATE no action
    );

    CREATE TABLE "places_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer,
      "_parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "place_categories_id" integer,
      "official_designations_id" integer,
      "experiences_id" integer,
      "tours_id" integer,
      "articles_id" integer,
      CONSTRAINT "places_rels_parent_id_places_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "places_rels_place_categories_id_fk"
        FOREIGN KEY ("place_categories_id") REFERENCES "public"."place_categories"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "places_rels_official_designations_id_fk"
        FOREIGN KEY ("official_designations_id") REFERENCES "public"."official_designations"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "places_rels_experiences_id_fk"
        FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "places_rels_tours_id_fk"
        FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "places_rels_articles_id_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id")
        ON DELETE cascade ON UPDATE no action
    );

    CREATE TABLE "official_designations_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer,
      "_parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "places_id" integer,
      "experiences_id" integer,
      "articles_id" integer,
      CONSTRAINT "official_designations_rels_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."official_designations"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "official_designations_rels_places_id_fk"
        FOREIGN KEY ("places_id") REFERENCES "public"."places"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "official_designations_rels_experiences_id_fk"
        FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id")
        ON DELETE cascade ON UPDATE no action,
      CONSTRAINT "official_designations_rels_articles_id_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id")
        ON DELETE cascade ON UPDATE no action
    );

    CREATE UNIQUE INDEX "place_categories_slug_idx" ON "place_categories" USING btree ("slug");
    CREATE INDEX "place_categories_parent_category_idx" ON "place_categories" USING btree ("parent_category_id");
    CREATE INDEX "place_categories_display_order_idx" ON "place_categories" USING btree ("display_order");
    CREATE INDEX "place_categories_updated_at_idx" ON "place_categories" USING btree ("updated_at");
    CREATE INDEX "place_categories_created_at_idx" ON "place_categories" USING btree ("created_at");
    CREATE INDEX "official_designations_type_idx" ON "official_designations" USING btree ("designation_type");
    CREATE INDEX "official_designations_verification_idx" ON "official_designations" USING btree ("verification_status");
    CREATE INDEX "official_designations_updated_at_idx" ON "official_designations" USING btree ("updated_at");
    CREATE INDEX "official_designations_created_at_idx" ON "official_designations" USING btree ("created_at");
    CREATE INDEX "places_geographic_area_idx" ON "places" USING btree ("geographic_area");
    CREATE INDEX "places_primary_category_idx" ON "places" USING btree ("primary_category_id");
    CREATE INDEX "places_gallery_order_idx" ON "places_gallery" USING btree ("_order");
    CREATE INDEX "places_gallery_parent_idx" ON "places_gallery" USING btree ("_parent_id");
    CREATE INDEX "places_travel_types_order_idx" ON "places_travel_types" USING btree ("_order");
    CREATE INDEX "places_travel_types_parent_idx" ON "places_travel_types" USING btree ("_parent_id");
    CREATE INDEX "places_source_links_order_idx" ON "places_source_links" USING btree ("_order");
    CREATE INDEX "places_source_links_parent_idx" ON "places_source_links" USING btree ("_parent_id");
    CREATE INDEX "places_rels_order_idx" ON "places_rels" USING btree ("_order");
    CREATE INDEX "places_rels_parent_idx" ON "places_rels" USING btree ("_parent_id");
    CREATE INDEX "places_rels_path_idx" ON "places_rels" USING btree ("path");
    CREATE INDEX "places_rels_categories_idx" ON "places_rels" USING btree ("place_categories_id");
    CREATE INDEX "places_rels_designations_idx" ON "places_rels" USING btree ("official_designations_id");
    CREATE INDEX "places_rels_experiences_idx" ON "places_rels" USING btree ("experiences_id");
    CREATE INDEX "places_rels_tours_idx" ON "places_rels" USING btree ("tours_id");
    CREATE INDEX "places_rels_articles_idx" ON "places_rels" USING btree ("articles_id");
    CREATE INDEX "official_designations_rels_order_idx" ON "official_designations_rels" USING btree ("_order");
    CREATE INDEX "official_designations_rels_parent_idx" ON "official_designations_rels" USING btree ("_parent_id");
    CREATE INDEX "official_designations_rels_path_idx" ON "official_designations_rels" USING btree ("path");
    CREATE INDEX "official_designations_rels_places_idx" ON "official_designations_rels" USING btree ("places_id");
    CREATE INDEX "official_designations_rels_experiences_idx" ON "official_designations_rels" USING btree ("experiences_id");
    CREATE INDEX "official_designations_rels_articles_idx" ON "official_designations_rels" USING btree ("articles_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "places" DROP CONSTRAINT "places_primary_category_id_place_categories_id_fk";
    DROP TABLE "official_designations_rels";
    DROP TABLE "places_rels";
    DROP TABLE "places_source_links";
    DROP TABLE "places_travel_types";
    DROP TABLE "places_gallery";
    ALTER TABLE "places"
      DROP COLUMN "geographic_area",
      DROP COLUMN "primary_category_id",
      DROP COLUMN "show_on_map",
      DROP COLUMN "map_marker_label",
      DROP COLUMN "editorial_notes";
    DROP TABLE "official_designations" CASCADE;
    DROP TABLE "place_categories" CASCADE;
    DROP TYPE "public"."enum_official_designations_publication_status";
    DROP TYPE "public"."enum_official_designations_verification_status";
    DROP TYPE "public"."enum_official_designations_designation_status";
    DROP TYPE "public"."enum_official_designations_designation_type";
    DROP TYPE "public"."enum_place_categories_publication_status";
  `);
}
