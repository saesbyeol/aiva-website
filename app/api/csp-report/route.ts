import { NextRequest, NextResponse } from "next/server";

/**
 * CSP violation collector.
 *
 * This is the entire point of running the policy in report-only mode: without
 * somewhere for the browser to send violations, they only ever reach each
 * visitor's own devtools console, and the observation window would run its
 * course and produce "no violations" that actually means "nothing was ever
 * collected." See middleware.ts's `report-uri` / `report-to` directives and
 * the `Reporting-Endpoints` header, which both point here.
 *
 * Browsers send two different shapes depending on which reporting mechanism
 * fired:
 *  - `report-uri` (legacy, still the widest supported): POSTs a single object
 *    with `content-type: application/csp-report`, body shaped like
 *    `{ "csp-report": { "blocked-uri": ..., "document-uri": ..., ... } }`.
 *  - `report-to` (Reporting API): POSTs an array with
 *    `content-type: application/reports+json`, each entry shaped like
 *    `{ type: "csp-violation", url, body: { blockedURL, documentURL, ... } }`.
 *
 * The middleware's matcher excludes /api, so this route is reachable
 * unauthenticated and un-rewritten — which is required for the browser to
 * be able to hit it at all, and is not a gap.
 *
 * This handler must never throw: a hostile or malformed body is expected
 * traffic here, not an error condition, and the route has no dependency to
 * rate-limit with — it just has to stay cheap enough that a burst of
 * violation reports (a browser can send a lot of these) can't do anything
 * more expensive than a `console.error` per request.
 */

type NormalizedViolation = {
  violatedDirective: string;
  blockedUri: string;
  documentUri: string;
};

function normalizeLegacyReport(body: unknown): NormalizedViolation | null {
  if (typeof body !== "object" || body === null) return null;
  const report = (body as Record<string, unknown>)["csp-report"];
  if (typeof report !== "object" || report === null) return null;
  const r = report as Record<string, unknown>;
  return {
    violatedDirective:
      pickString(r["violated-directive"]) ??
      pickString(r["effective-directive"]) ??
      "unknown",
    blockedUri: pickString(r["blocked-uri"]) ?? "unknown",
    documentUri: pickString(r["document-uri"]) ?? "unknown",
  };
}

function normalizeReportingApiEntries(body: unknown): NormalizedViolation[] {
  if (!Array.isArray(body)) return [];
  const out: NormalizedViolation[] = [];
  for (const entry of body) {
    if (typeof entry !== "object" || entry === null) continue;
    const e = entry as Record<string, unknown>;
    if (e.type !== "csp-violation") continue;
    const b = e.body;
    if (typeof b !== "object" || b === null) continue;
    const rb = b as Record<string, unknown>;
    out.push({
      violatedDirective: pickString(rb["effectiveDirective"]) ?? "unknown",
      blockedUri: pickString(rb["blockedURL"]) ?? "unknown",
      documentUri: pickString(rb["documentURL"]) ?? pickString(e["url"]) ?? "unknown",
    });
  }
  return out;
}

function pickString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw) return new NextResponse(null, { status: 204 });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Not JSON — log a truncated raw body and move on rather than throwing.
      console.error(`[csp-report] non-JSON body: ${raw.slice(0, 200)}`);
      return new NextResponse(null, { status: 204 });
    }

    const violations = Array.isArray(parsed)
      ? normalizeReportingApiEntries(parsed)
      : [normalizeLegacyReport(parsed)];

    for (const v of violations) {
      if (!v) continue;
      console.error(
        `[csp-report] directive="${v.violatedDirective}" blocked="${v.blockedUri}" document="${v.documentUri}"`
      );
    }
  } catch (err) {
    // Defensive: this route must never throw back a 500 for a malformed or
    // hostile report body.
    console.error("[csp-report] failed to process report", err);
  }

  return new NextResponse(null, { status: 204 });
}
