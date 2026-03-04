/**
 * i18n helper — simple dictionary approach.
 * Croatian is the default (and currently only) locale.
 *
 * To add English later:
 *   1. Create lib/i18n/en.ts with the same shape.
 *   2. Add "en" to the `locales` array below.
 *   3. Swap `dict` based on a locale param / cookie / header.
 */

import hr, { type Dictionary } from "./hr";

// Active dictionary (swap for future multi-locale support)
export const dict: Dictionary = hr;

// ─── Type-safe dot-path accessor ─────────────────────────────────────────────
// Supports up to 3 levels deep: "nav.services", "form.budgetOptions.under10k"
type DotPath<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : T extends readonly unknown[]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]: DotPath<T[K], `${Prefix}${Prefix extends "" ? "" : "."}${K}`>;
    }[keyof T & string]
  : never;

export type TranslationKey = DotPath<Dictionary>;

/**
 * `t(key)` — retrieve a translation string by dot-path key.
 *
 * Works in both Server and Client Components since it's a plain function
 * reading from a static import. No React context required.
 *
 * @example
 *   t("nav.services")       // "Usluge"
 *   t("form.submit")        // "Pošalji poruku"
 */
export function t(key: string): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = dict;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return key;
    node = node[part];
  }
  if (typeof node === "string") return node;
  // Fallback: return the key itself so missing keys are obvious in UI
  return key;
}

/**
 * `ta(key)` — retrieve a translation array.
 * Use for cases like animated word arrays, stats, cards, etc.
 */
export function ta<T = string[]>(key: string): T {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = dict;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return [] as unknown as T;
    node = node[part];
  }
  return (node ?? []) as T;
}

export type { Dictionary };
