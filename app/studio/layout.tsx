/**
 * Studio layout — self-contained html/body.
 * Now that the root layout is a passthrough, Studio needs its own html/body.
 * No marketing fonts, Cookiebot, Plausible, Chatbase, or SiteShell needed here.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
