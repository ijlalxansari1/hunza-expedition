import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getPayload } from 'payload';
import configPromise from '../payload.config.ts';
import {
  storedEnquirySchema,
  toPayloadEnquiryData,
} from '../src/lib/enquiryData.ts';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const validateOnly = args.includes('--validate-only');
const allowedArgs = new Set(['--apply', '--dry-run', '--validate-only']);

if (
  args.some((arg) => !allowedArgs.has(arg)) ||
  args.length > 1 ||
  (apply && args.includes('--dry-run')) ||
  (validateOnly && (apply || args.includes('--dry-run')))
) {
  throw new Error('Use only one of --validate-only, --dry-run, or --apply.');
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined;

try {
  const raw = await readFile(resolve(process.cwd(), 'data', 'enquiries.json'), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  const records = storedEnquirySchema.array().parse(parsed);

  if (validateOnly) {
    console.log(`Validated ${records.length} enquiry record(s). No database was contacted.`);
  } else {
    payload = await getPayload({ config: configPromise });

    let imported = 0;
    let skipped = 0;

    for (const record of records) {
      const existing = await payload.find({
        collection: 'enquiries',
        where: { referenceId: { equals: record.referenceId } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      if (existing.docs.length > 0) {
        skipped += 1;
        continue;
      }

      if (apply) {
        await payload.create({
          collection: 'enquiries',
          data: toPayloadEnquiryData(record),
          context: { skipEnquiryOutbox: true },
          overrideAccess: true,
        });
      }
      imported += 1;
    }

    console.log(
      `${apply ? 'Imported' : 'Would import'} ${imported} enquiry record(s); skipped ${skipped} already present.`,
    );
    if (!apply) {
      console.log('No records were changed. Re-run with --apply after reviewing the target database.');
    }
  }
} catch (error) {
  console.error(
    error instanceof Error
      ? `Enquiry import failed: ${error.message}`
      : 'Enquiry import failed with an unknown error.',
  );
  process.exitCode = 1;
} finally {
  if (payload) {
    await payload.destroy();
    process.exit(process.exitCode ?? 0);
  }
}
