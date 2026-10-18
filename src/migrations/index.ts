import * as migration_20231016_create_outbox from './20231016-create-outbox.ts';
import * as migration_20231015_155342_baseline_payload_schema from './20231015_155342_baseline_payload_schema.ts';
import * as migration_20261018_114900_enquiry_workflow from './20261018_114900_enquiry_workflow.ts';
import * as migration_20261018_150600_payload_catalog from './20261018_150600_payload_catalog.ts';
import * as migration_20261018_183000_editorial_content from './20261018_183000_editorial_content.ts';
import * as migration_20261018_201000_article_editorial_fields from './20261018_201000_article_editorial_fields.ts';
import * as migration_20261018_213000_place_taxonomy_designations from './20261018_213000_place_taxonomy_designations.ts';
import * as migration_20261018_220000_place_relationship_schema_fix from './20261018_220000_place_relationship_schema_fix.ts';
import * as migration_20261018_221500_locked_document_collection_rels from './20261018_221500_locked_document_collection_rels.ts';

export const migrations = [
  {
    up: migration_20231015_155342_baseline_payload_schema.up,
    down: migration_20231015_155342_baseline_payload_schema.down,
    name: '20231015_155342_baseline_payload_schema',
  },
  {
    up: migration_20231016_create_outbox.up,
    down: migration_20231016_create_outbox.down,
    name: '20231016-create-outbox',
  },
  {
    up: migration_20261018_114900_enquiry_workflow.up,
    down: migration_20261018_114900_enquiry_workflow.down,
    name: '20261018_114900_enquiry_workflow',
  },
  {
    up: migration_20261018_150600_payload_catalog.up,
    down: migration_20261018_150600_payload_catalog.down,
    name: '20261018_150600_payload_catalog',
  },
  {
    up: migration_20261018_183000_editorial_content.up,
    down: migration_20261018_183000_editorial_content.down,
    name: '20261018_183000_editorial_content',
  },
  {
    up: migration_20261018_201000_article_editorial_fields.up,
    down: migration_20261018_201000_article_editorial_fields.down,
    name: '20261018_201000_article_editorial_fields',
  },
  {
    up: migration_20261018_213000_place_taxonomy_designations.up,
    down: migration_20261018_213000_place_taxonomy_designations.down,
    name: '20261018_213000_place_taxonomy_designations',
  },
  {
    up: migration_20261018_220000_place_relationship_schema_fix.up,
    down: migration_20261018_220000_place_relationship_schema_fix.down,
    name: '20261018_220000_place_relationship_schema_fix',
  },
  {
    up: migration_20261018_221500_locked_document_collection_rels.up,
    down: migration_20261018_221500_locked_document_collection_rels.down,
    name: '20261018_221500_locked_document_collection_rels',
  },
];
