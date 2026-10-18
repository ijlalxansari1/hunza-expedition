import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_enquiries_preferred_contact" AS ENUM('email', 'whatsapp', 'phone');
    CREATE TYPE "public"."enum_enquiries_date_flexibility" AS ENUM('exact', 'flexible_few_days', 'flexible_month');
    CREATE TYPE "public"."enum_enquiries_budget_currency" AS ENUM('USD', 'EUR', 'GBP', 'PKR');
    CREATE TYPE "public"."enum_enquiries_accommodation_style" AS ENUM('standard_guesthouse', 'comfort_hotels', 'heritage_boutique', 'flexible');
    CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'under_review', 'preparing_quotation', 'quotation_sent', 'confirmed_manual', 'closed', 'not_feasible');

    ALTER TABLE "enquiries"
      ADD COLUMN "reference_id" varchar,
      ADD COLUMN "full_name" varchar,
      ADD COLUMN "phone" varchar,
      ADD COLUMN "preferred_contact" "public"."enum_enquiries_preferred_contact" DEFAULT 'email',
      ADD COLUMN "country_of_residence" varchar,
      ADD COLUMN "start_date" varchar,
      ADD COLUMN "date_flexibility" "public"."enum_enquiries_date_flexibility" DEFAULT 'flexible_few_days',
      ADD COLUMN "duration_days" numeric DEFAULT 7,
      ADD COLUMN "adults_count" numeric DEFAULT 2,
      ADD COLUMN "children_count" numeric DEFAULT 0,
      ADD COLUMN "children_ages" varchar,
      ADD COLUMN "budget_per_person" varchar,
      ADD COLUMN "budget_currency" "public"."enum_enquiries_budget_currency" DEFAULT 'USD',
      ADD COLUMN "accommodation_style" "public"."enum_enquiries_accommodation_style" DEFAULT 'comfort_hotels',
      ADD COLUMN "selected_destinations" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "selected_interests" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN "special_requests" varchar,
      ADD COLUMN "privacy_consent" boolean DEFAULT false,
      ADD COLUMN "submitted_at" timestamp(3) with time zone,
      ADD COLUMN "status" "public"."enum_enquiries_status" DEFAULT 'new',
      ADD COLUMN "internal_notes" varchar;

    UPDATE "enquiries"
    SET
      "reference_id" = 'HX-LEGACY-' || "id"::text,
      "full_name" = "name",
      "special_requests" = "message",
      "submitted_at" = "created_at";

    ALTER TABLE "enquiries"
      ALTER COLUMN "reference_id" SET NOT NULL,
      ALTER COLUMN "full_name" SET NOT NULL,
      ALTER COLUMN "preferred_contact" SET NOT NULL,
      ALTER COLUMN "date_flexibility" SET NOT NULL,
      ALTER COLUMN "duration_days" SET NOT NULL,
      ALTER COLUMN "adults_count" SET NOT NULL,
      ALTER COLUMN "children_count" SET NOT NULL,
      ALTER COLUMN "budget_currency" SET NOT NULL,
      ALTER COLUMN "accommodation_style" SET NOT NULL,
      ALTER COLUMN "selected_destinations" SET NOT NULL,
      ALTER COLUMN "selected_interests" SET NOT NULL,
      ALTER COLUMN "privacy_consent" SET NOT NULL,
      ALTER COLUMN "submitted_at" SET NOT NULL,
      ALTER COLUMN "status" SET NOT NULL;

    ALTER TABLE "enquiries" DROP COLUMN "name", DROP COLUMN "message";

    CREATE UNIQUE INDEX "enquiries_reference_id_idx" ON "enquiries" USING btree ("reference_id");
    CREATE INDEX "enquiries_submitted_at_idx" ON "enquiries" USING btree ("submitted_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "enquiries"
      ADD COLUMN "name" varchar,
      ADD COLUMN "message" varchar;

    UPDATE "enquiries"
    SET
      "name" = "full_name",
      "message" = COALESCE("special_requests", '');

    ALTER TABLE "enquiries"
      ALTER COLUMN "name" SET NOT NULL,
      ALTER COLUMN "message" SET NOT NULL;

    ALTER TABLE "enquiries"
      DROP COLUMN "reference_id",
      DROP COLUMN "full_name",
      DROP COLUMN "phone",
      DROP COLUMN "preferred_contact",
      DROP COLUMN "country_of_residence",
      DROP COLUMN "start_date",
      DROP COLUMN "date_flexibility",
      DROP COLUMN "duration_days",
      DROP COLUMN "adults_count",
      DROP COLUMN "children_count",
      DROP COLUMN "children_ages",
      DROP COLUMN "budget_per_person",
      DROP COLUMN "budget_currency",
      DROP COLUMN "accommodation_style",
      DROP COLUMN "selected_destinations",
      DROP COLUMN "selected_interests",
      DROP COLUMN "special_requests",
      DROP COLUMN "privacy_consent",
      DROP COLUMN "submitted_at",
      DROP COLUMN "status",
      DROP COLUMN "internal_notes";

    DROP TYPE "public"."enum_enquiries_preferred_contact";
    DROP TYPE "public"."enum_enquiries_date_flexibility";
    DROP TYPE "public"."enum_enquiries_budget_currency";
    DROP TYPE "public"."enum_enquiries_accommodation_style";
    DROP TYPE "public"."enum_enquiries_status";
  `);
}
