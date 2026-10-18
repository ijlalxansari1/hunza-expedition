import 'server-only';
import { unstable_cache } from 'next/cache';

const publicContentRevalidateSeconds = 30;

export function cachePublicContent<Arguments extends unknown[], Result>(
  key: string,
  read: (...args: Arguments) => Promise<Result>,
): (...args: Arguments) => Promise<Result> {
  return unstable_cache(read, ['payload-public-content', key], {
    revalidate: publicContentRevalidateSeconds,
  });
}
