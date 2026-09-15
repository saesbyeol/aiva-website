/**
 * Escape a value for interpolation into an HTML document or email body.
 *
 * Zod bounds our contact fields' length, never their content. Without
 * escaping, anything a stranger types renders as markup in our own inbox —
 * the obvious abuse being a link that looks like it came from our own form.
 */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}
