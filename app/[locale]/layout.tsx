import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { constructMetadata, organizationSchema, websiteSchema } from "@/lib/seo";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ConsentProvider } from "@/components/privacy/consent-provider";
import { ChatbaseWidget } from "@/components/privacy/chatbase-widget";

// ─── Fonts ──────────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display-family",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

// ─── Metadata ────────────────────────────────────────────────────────────────
// HR keeps the exact defaults from lib/constants.ts (SITE.tagline / SITE.description)
// so the / (HR) homepage metadata stays byte-identical to before this change —
// messages/hr.json's site.tagline/site.description already diverge from those
// constants (used elsewhere, e.g. the footer), so they are only applied for "en".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return constructMetadata({
    description: locale === "en" ? t("site.description") : undefined,
    locale,
  });
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Allow on-demand (ISR) rendering of dynamic child routes not enumerated at
// build time — e.g. case-study `[slug]` pages for Sanity documents added after
// the last deploy. Invalid locales are still rejected by the explicit
// `hasLocale(...) notFound()` guard in the layout below, so this stays safe.
export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Cookiebot must be the first script in <head> and must NOT be async:
            auto-blocking works by installing interceptors before any other
            script runs, and async forfeits that ordering guarantee. */}
        {cookiebotId && (
          <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            data-culture={locale.toUpperCase()}
            type="text/javascript"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`${syne.variable} ${inter.variable}`}>
        <ConsentProvider>
          {plausibleDomain && (
            <Script
              defer
              data-domain={plausibleDomain}
              src="https://plausible.io/js/script.js"
              strategy="afterInteractive"
            />
          )}
          <ChatbaseWidget />
          <NextIntlClientProvider messages={messages}>
            <SiteShell>{children}</SiteShell>
          </NextIntlClientProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
