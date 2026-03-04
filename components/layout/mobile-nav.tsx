"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}: MobileNavProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.openMenu")}
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-bg/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.nav
            className="absolute inset-x-0 top-16 bottom-0 flex flex-col p-6 bg-bg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <ul className="flex flex-col gap-1 flex-1" role="list">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 text-2xl font-semibold text-fg hover:text-accent transition-colors border-b border-border group"
                  >
                    {link.label}
                    <ArrowRight className="w-5 h-5 text-fg-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 text-sm text-fg-secondary hover:text-fg transition-colors"
                aria-label={`${t("nav.switchTo")} ${theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
              </button>

              <Link
                href="/kontakt"
                onClick={onClose}
                className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors"
              >
                {t("nav.bookCall")}
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
