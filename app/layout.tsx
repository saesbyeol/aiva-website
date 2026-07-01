/**
 * Minimal passthrough root layout — required by Next.js.
 * The actual <html>/<body> are rendered by each sub-tree's own layout:
 *   - app/[locale]/layout.tsx  (all marketing pages)
 *   - app/studio/layout.tsx    (Sanity Studio)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
