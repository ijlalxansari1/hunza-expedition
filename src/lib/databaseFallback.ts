import { lookup } from 'node:dns/promises';

const transientConnectionCodes = new Set([
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'ETIMEDOUT',
]);
const retryConnectionAfterMs = 10_000;
let connectionUnavailableUntil = 0;
let databaseHostResolvedUntil = 0;

async function checkDatabaseHostResolution(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || Date.now() < databaseHostResolvedUntil) return;

  await lookup(new URL(databaseUrl).hostname);
  databaseHostResolvedUntil = Date.now() + retryConnectionAfterMs;
}

function getTransientConnectionCode(error: unknown): string | undefined {
  const visited = new Set<object>();
  let current: unknown = error;

  while (typeof current === 'object' && current !== null && !visited.has(current)) {
    visited.add(current);
    if ('code' in current && typeof current.code === 'string' && transientConnectionCodes.has(current.code)) {
      return current.code;
    }

    if ('message' in current && typeof current.message === 'string') {
      const match = current.message.match(/\b(EAI_AGAIN|ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH|ENOTFOUND|ETIMEDOUT)\b/);
      if (match) return match[1];
    }

    current = 'cause' in current ? current.cause : undefined;
  }

  return undefined;
}

export async function withDatabaseFallback<T>(
  operation: string,
  read: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (Date.now() < connectionUnavailableUntil) {
    return fallback();
  }

  try {
    await checkDatabaseHostResolution();
    const result = await read();
    connectionUnavailableUntil = 0;
    return result;
  } catch (error) {
    const code = getTransientConnectionCode(error);
    if (!code) throw error;

    connectionUnavailableUntil = Date.now() + retryConnectionAfterMs;
    console.error(
      `[CMS] ${operation} could not reach PostgreSQL (${code}); serving seed content for this request.`,
    );
    return fallback();
  }
}
