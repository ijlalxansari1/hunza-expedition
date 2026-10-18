import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "places_rels"
      RENAME COLUMN "_order" TO "order";
    ALTER TABLE "places_rels"
      RENAME COLUMN "_parent_id" TO "parent_id";
    ALTER TABLE "official_designations_rels"
      RENAME COLUMN "_order" TO "order";
    ALTER TABLE "official_designations_rels"
      RENAME COLUMN "_parent_id" TO "parent_id";

    ALTER INDEX "places_rels_categories_idx" RENAME TO "places_rels_place_categories_id_idx";
    ALTER INDEX "places_rels_designations_idx" RENAME TO "places_rels_official_designations_id_idx";
    ALTER INDEX "places_rels_experiences_idx" RENAME TO "places_rels_experiences_id_idx";
    ALTER INDEX "places_rels_tours_idx" RENAME TO "places_rels_tours_id_idx";
    ALTER INDEX "places_rels_articles_idx" RENAME TO "places_rels_articles_id_idx";
    ALTER INDEX "official_designations_rels_places_idx" RENAME TO "official_designations_rels_places_id_idx";
    ALTER INDEX "official_designations_rels_experiences_idx" RENAME TO "official_designations_rels_experiences_id_idx";
    ALTER INDEX "official_designations_rels_articles_idx" RENAME TO "official_designations_rels_articles_id_idx";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER INDEX "places_rels_place_categories_id_idx" RENAME TO "places_rels_categories_idx";
    ALTER INDEX "places_rels_official_designations_id_idx" RENAME TO "places_rels_designations_idx";
    ALTER INDEX "places_rels_experiences_id_idx" RENAME TO "places_rels_experiences_idx";
    ALTER INDEX "places_rels_tours_id_idx" RENAME TO "places_rels_tours_idx";
    ALTER INDEX "places_rels_articles_id_idx" RENAME TO "places_rels_articles_idx";
    ALTER INDEX "official_designations_rels_places_id_idx" RENAME TO "official_designations_rels_places_idx";
    ALTER INDEX "official_designations_rels_experiences_id_idx" RENAME TO "official_designations_rels_experiences_idx";
    ALTER INDEX "official_designations_rels_articles_id_idx" RENAME TO "official_designations_rels_articles_idx";

    ALTER TABLE "official_designations_rels"
      RENAME COLUMN "parent_id" TO "_parent_id";
    ALTER TABLE "official_designations_rels"
      RENAME COLUMN "order" TO "_order";
    ALTER TABLE "places_rels"
      RENAME COLUMN "parent_id" TO "_parent_id";
    ALTER TABLE "places_rels"
      RENAME COLUMN "order" TO "_order";
  `);
}
