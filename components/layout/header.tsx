"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sun, Moon, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { t } from "@/lib/i18n";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

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

      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <nav
          className="container-wide h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-fg hover:text-accent transition-colors"
            aria-label="Aiva — home"
          >
            <span className="gradient-text">Aiva</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
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
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
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
                className="w-9 h-9 hidden md:flex items-center justify-center rounded-lg text-fg-muted opacity-40 cursor-not-allowed"
                aria-disabled="true"
                aria-label={t("nav.backHome")}
              >
                <Home className="w-4 h-4" />
              </span>
            ) : (
              <Link
                href="/"
                className="w-9 h-9 hidden md:flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
                aria-label={t("nav.backHome")}
              >
                <Home className="w-4 h-4" />
              </Link>
            )}

            <Button
              asChild
              variant="primary"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Link href="/kontakt">{t("nav.bookCall")}</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              className="flex md:hidden w-9 h-9 items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-bg-elevated transition-all"
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
      </motion.header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
}
