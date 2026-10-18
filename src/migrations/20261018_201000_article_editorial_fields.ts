import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_articles_content_type" AS ENUM('guide', 'blog');
    CREATE TYPE "public"."enum_authors_publication_status" AS ENUM('draft', 'review', 'approved', 'published');

    CREATE TABLE "authors" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "biography" varchar NOT NULL,
      "image_url" varchar,
      "image_alt" varchar,
      "website_url" varchar,
      "social_links" jsonb DEFAULT '[]'::jsonb,
      "publication_status" "public"."enum_authors_publication_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "articles"
      ADD COLUMN "content_type" "public"."enum_articles_content_type" DEFAULT 'guide' NOT NULL,
      ADD COLUMN "rich_content" jsonb,
      ADD COLUMN "image_alt" varchar,
      ADD COLUMN "image_caption" varchar,
      ADD COLUMN "author_profile_id" integer,
      ADD COLUMN "related_tours" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "related_places" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "related_experiences" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "related_articles" jsonb DEFAULT '[]'::jsonb;

    CREATE TABLE "articles_tags" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "tag" varchar NOT NULL
    );

    ALTER TABLE "articles_tags"
      ADD CONSTRAINT "articles_tags_parent_id_articles_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "articles"
      ADD CONSTRAINT "articles_author_profile_id_authors_id_fk"
      FOREIGN KEY ("author_profile_id") REFERENCES "public"."authors"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
    CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
    CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
    CREATE INDEX "articles_content_type_idx" ON "articles" USING btree ("content_type");
    CREATE INDEX "articles_author_profile_id_idx" ON "articles" USING btree ("author_profile_id");
    CREATE INDEX "articles_tags_order_idx" ON "articles_tags" USING btree ("_order");
    CREATE INDEX "articles_tags_parent_id_idx" ON "articles_tags" USING btree ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP CONSTRAINT "articles_author_profile_id_authors_id_fk";
    ALTER TABLE "articles_tags" DROP CONSTRAINT "articles_tags_parent_id_articles_id_fk";
    DROP INDEX "articles_tags_order_idx";
    DROP INDEX "articles_tags_parent_id_idx";
    DROP TABLE "articles_tags";
    DROP INDEX "articles_content_type_idx";
    DROP INDEX "articles_author_profile_id_idx";
    DROP INDEX "authors_slug_idx";
    DROP INDEX "authors_updated_at_idx";
    DROP INDEX "authors_created_at_idx";
    ALTER TABLE "articles"
      DROP COLUMN "content_type",
      DROP COLUMN "rich_content",
      DROP COLUMN "image_alt",
      DROP COLUMN "image_caption",
      DROP COLUMN "author_profile_id",
      DROP COLUMN "related_tours",
      DROP COLUMN "related_places",
      DROP COLUMN "related_experiences",
      DROP COLUMN "related_articles";
    DROP TABLE "authors" CASCADE;
    DROP TYPE "public"."enum_articles_content_type";
    DROP TYPE "public"."enum_authors_publication_status";
  `);
}
