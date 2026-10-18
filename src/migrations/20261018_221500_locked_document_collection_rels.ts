import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN "authors_id" integer,
      ADD COLUMN "destinations_id" integer,
      ADD COLUMN "places_id" integer,
      ADD COLUMN "place_categories_id" integer,
      ADD COLUMN "official_designations_id" integer,
      ADD COLUMN "tours_id" integer,
      ADD COLUMN "experiences_id" integer,
      ADD COLUMN "articles_id" integer,
      ADD COLUMN "faqs_id" integer;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_authors_fk"
        FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk"
        FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_places_fk"
        FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_place_categories_fk"
        FOREIGN KEY ("place_categories_id") REFERENCES "public"."place_categories"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_official_designations_fk"
        FOREIGN KEY ("official_designations_id") REFERENCES "public"."official_designations"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_tours_fk"
        FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk"
        FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_articles_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action,
      ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk"
        FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "payload_locked_documents_rels_authors_id_idx"
      ON "payload_locked_documents_rels" USING btree ("authors_id");
    CREATE INDEX "payload_locked_documents_rels_destinations_id_idx"
      ON "payload_locked_documents_rels" USING btree ("destinations_id");
    CREATE INDEX "payload_locked_documents_rels_places_id_idx"
      ON "payload_locked_documents_rels" USING btree ("places_id");
    CREATE INDEX "payload_locked_documents_rels_place_categories_id_idx"
      ON "payload_locked_documents_rels" USING btree ("place_categories_id");
    CREATE INDEX "payload_locked_documents_rels_official_designations_id_idx"
      ON "payload_locked_documents_rels" USING btree ("official_designations_id");
    CREATE INDEX "payload_locked_documents_rels_tours_id_idx"
      ON "payload_locked_documents_rels" USING btree ("tours_id");
    CREATE INDEX "payload_locked_documents_rels_experiences_id_idx"
      ON "payload_locked_documents_rels" USING btree ("experiences_id");
    CREATE INDEX "payload_locked_documents_rels_articles_id_idx"
      ON "payload_locked_documents_rels" USING btree ("articles_id");
    CREATE INDEX "payload_locked_documents_rels_faqs_id_idx"
      ON "payload_locked_documents_rels" USING btree ("faqs_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT "payload_locked_documents_rels_authors_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_destinations_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_places_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_place_categories_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_official_designations_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_tours_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_experiences_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_articles_fk",
      DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";

    DROP INDEX "payload_locked_documents_rels_authors_id_idx";
    DROP INDEX "payload_locked_documents_rels_destinations_id_idx";
    DROP INDEX "payload_locked_documents_rels_places_id_idx";
    DROP INDEX "payload_locked_documents_rels_place_categories_id_idx";
    DROP INDEX "payload_locked_documents_rels_official_designations_id_idx";
    DROP INDEX "payload_locked_documents_rels_tours_id_idx";
    DROP INDEX "payload_locked_documents_rels_experiences_id_idx";
    DROP INDEX "payload_locked_documents_rels_articles_id_idx";
    DROP INDEX "payload_locked_documents_rels_faqs_id_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN "authors_id",
      DROP COLUMN "destinations_id",
      DROP COLUMN "places_id",
      DROP COLUMN "place_categories_id",
      DROP COLUMN "official_designations_id",
      DROP COLUMN "tours_id",
      DROP COLUMN "experiences_id",
      DROP COLUMN "articles_id",
      DROP COLUMN "faqs_id";
  `);
}
