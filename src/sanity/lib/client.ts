import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Resilient fetcher: if Sanity Cloud is not configured or throws an error (e.g. invalid project ID during initial setup),
 * it returns fallback seed data safely rather than crashing the page.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  fallback,
}: {
  query: string;
  params?: Record<string, unknown>;
  fallback?: T;
}): Promise<T> {
  // If projectId is the default demo placeholder or empty, use fallback directly
  if (!projectId || projectId === "demo-hunza") {
    if (fallback !== undefined) {
      return fallback;
    }
  }

  try {
    const data = await client.fetch<T>(query, params);
    if (!data && fallback !== undefined) {
      return fallback;
    }
    return data;
  } catch (err) {
    console.warn("Sanity fetch failed, falling back to local dataset:", err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}
