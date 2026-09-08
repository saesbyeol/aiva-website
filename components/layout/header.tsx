"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, Sun, Moon, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { LocaleToggle } from "./locale-toggle";
import { PoweredBy } from "./powered-by";

export function Header() {
  const t = useTranslations();
  const navLinks = getNavLinks(t);
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  // Native passive scroll listener — no Framer Motion overhead
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("light", stored === "light");
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  // Close mobile nav on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[9999] -translate-y-20 focus:translate-y-0 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-transform"
      >
        {t("nav.skipToContent")}
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-[header-slide-down]",
          scrolled
            ? "bg-bg/95 lg:bg-bg/80 lg:backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav
          className="container-wide h-16 flex items-center justify-between gap-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex flex-col justify-center shrink-0">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-fg hover:text-accent transition-colors leading-tight"
              aria-label="Aiva, home"
            >
              <span className="gradient-text">Aiva</span>
            </Link>
            <PoweredBy className="mt-0.5 text-[11px] leading-none text-fg-secondary" />
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex flex-1 justify-center items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === link.href
                      ? "text-fg bg-bg-elevated"
                      : "text-fg-secondary hover:text-fg hover:bg-bg-elevated"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <LocaleToggle className="hidden lg:flex" />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 hidden lg:flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
              aria-label={`${t("nav.switchTo")} ${theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {pathname === "/" ? (
              <span
                className="w-9 h-9 hidden lg:flex items-center justify-center rounded-lg text-fg-muted opacity-40 cursor-not-allowed"
                aria-disabled="true"
                aria-label={t("nav.backHome")}
              >
                <Home className="w-4 h-4" />
              </span>
            ) : (
              <Link
                href="/"
                className="w-9 h-9 hidden lg:flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
                aria-label={t("nav.backHome")}
              >
                <Home className="w-4 h-4" />
              </Link>
            )}

            <Button
              asChild
              variant="primary"
              size="sm"
              className="hidden lg:inline-flex"
            >
              <Link href="/kontakt">{t("nav.bookCall")}</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              className="flex lg:hidden w-9 h-9 items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
}
