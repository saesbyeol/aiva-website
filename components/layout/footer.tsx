import * as React from "react";
import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import { t } from "@/lib/i18n";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary" role="contentinfo">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight"
              aria-label="Aiva — home"
            >
              <span className="gradient-text">Aiva</span>
            </Link>
            <p className="text-fg-secondary text-sm max-w-xs leading-relaxed">
              {SITE.description}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-fg-secondary hover:text-accent transition-colors link-underline"
            >
              {SITE.email}
            </a>
          </div>

          {/* Company links */}
          <div>
            <p className="text-label mb-4">{t("footer.company")}</p>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-secondary hover:text-fg transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <p className="text-label mb-4">{t("footer.social")}</p>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-fg-secondary hover:text-fg transition-colors group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-label mb-4">{t("footer.legal")}</p>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-secondary hover:text-fg transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-fg-muted">
            © {year} {SITE.name}. {t("footer.rights")}
          </p>
          <p className="text-xs text-fg-muted">
            {t("footer.builtWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
