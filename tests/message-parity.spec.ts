import { test, expect } from "@playwright/test";
import hr from "../messages/hr.json";
import en from "../messages/en.json";

/**
 * The two message catalogues must carry identical key sets.
 *
 * next-intl does not throw on a missing key — it falls back to rendering the
 * key path. So a key present in hr.json and missing from en.json does not
 * fail a build or a page load: it silently prints a string like
 * "privacy.s2Groups.5.desc" where the text should be. On the privacy policy,
 * which exists to disclose things accurately, that is the worst possible
 * place for a silent failure, and nothing else in this suite would catch it.
 *
 * Array lengths are checked too, because several privacy sections render
 * arrays of fixed-shape objects (processors, purposes, retention rows). A
 * locale missing one entry loses a disclosure rather than mangling one.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Every leaf path in the catalogue, e.g. "privacy.s5List[2].name". */
function paths(value: Json, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => paths(v, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      paths(v, prefix ? `${prefix}.${k}` : k)
    );
  }
  return [prefix];
}

test("hr and en message catalogues have identical key sets", () => {
  const hrPaths = new Set(paths(hr as Json));
  const enPaths = new Set(paths(en as Json));

  const missingFromEn = [...hrPaths].filter((p) => !enPaths.has(p)).sort();
  const missingFromHr = [...enPaths].filter((p) => !hrPaths.has(p)).sort();

  expect(
    missingFromEn,
    `Present in hr.json but missing from en.json — these would render as literal ` +
      `key paths on the English site:\n  ${missingFromEn.join("\n  ")}`
  ).toEqual([]);

  expect(
    missingFromHr,
    `Present in en.json but missing from hr.json:\n  ${missingFromHr.join("\n  ")}`
  ).toEqual([]);
});

test("privacy policy arrays have matching lengths across locales", () => {
  const sections = [
    "s2Groups",
    "s3Rows",
    "s4Rows",
    "s5List",
    "s7List",
    "s8Groups",
  ] as const;

  for (const section of sections) {
    const a = (hr.privacy as Record<string, unknown>)[section] as unknown[];
    const b = (en.privacy as Record<string, unknown>)[section] as unknown[];
    expect(
      b.length,
      `privacy.${section} has ${a.length} entries in hr and ${b.length} in en — ` +
        `one locale is missing a disclosure`
    ).toBe(a.length);
  }
});
