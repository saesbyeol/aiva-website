import { createClient } from "next-sanity";

export function isSanityConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}

// Lazy singleton — only created when projectId is present
let _client: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (!isSanityConfigured()) return null;
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    });
  }
  return _client;
}
