import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except /studio, /api, Next internals, and files with a dot.
  matcher: ["/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
