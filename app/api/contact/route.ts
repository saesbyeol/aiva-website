import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { t } from "@/lib/i18n";

// ─── Rate limiting (in-memory, resets on cold start) ──────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(20).max(2000),
  budget: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot
});

// ─── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP-based rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: t("form.errorRateLimit") },
      { status: 429 }
    );
  }

  // Parse + validate
  let data: z.infer<typeof schema>;
  try {
    const body = await req.json();
    data = schema.parse(body);
  } catch (e) {
    return NextResponse.json(
      { error: t("form.errorInvalid") },
      { status: 400 }
    );
  }

  // Honeypot check
  if (data.website) {
    return NextResponse.json({ ok: true }); // silently discard
  }

  // Email sending via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL ?? "automation.aiva@gmail.com";

  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: toEmail,
        replyTo: data.email,
        subject: `Nova poruka od ${data.name}${data.company ? ` (${data.company})` : ""}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <h2 style="color: #6366f1;">Nova poruka putem obrasca za kontakt</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 120px;">Ime</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
              ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Tvrtka</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 3px solid #6366f1;">
              <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="margin-top: 24px; color: #999; font-size: 12px;">Poslano putem aiva.agency obrasca &middot; IP: ${ip}</p>
          </div>
        `,
      });

      return NextResponse.json({ ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Resend error:", msg);
      return NextResponse.json(
        { error: t("form.errorSend"), detail: msg },
        { status: 500 }
      );
    }
  }

  // Fallback — log (RESEND_API_KEY not set)
  console.log("[contact] RESEND_API_KEY not set. Message:", {
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    note: "Poruka zabilježena (dostava e-pošte nije konfigurirana).",
  });
}
