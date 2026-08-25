"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLink } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function isActive(item: { href: string; matchPrefix?: string }) {
    if (item.href === "/") return pathname === "/";
    const prefix = item.matchPrefix ?? item.href;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="tm-container flex h-[72px] items-center justify-between gap-6">
        <LogoLink />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-text" : "text-text-secondary hover:text-text",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3.5 -bottom-px h-px bg-gradient-to-r from-primary to-cyan transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            aria-label="Search articles"
            className="grid h-9 w-9 place-items-center rounded-full text-text-secondary transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="search" size={17} />
          </Link>
          <ThemeToggle />
          <Link href="/newsletter" className="btn btn-primary btn-sm ml-1.5 hidden sm:inline-flex">
            Subscribe
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid h-9 w-9 place-items-center rounded-full text-text-secondary transition hover:bg-surface-2 hover:text-text lg:hidden"
          >
            <Icon name="menu" size={19} />
          </button>
        </div>
      </div>

      {/* ------------------------------ mobile nav ------------------------------ */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* scrim */}
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        {/* slide-out panel */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
            <LogoLink size={30} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="grid h-9 w-9 place-items-center rounded-full text-text-secondary transition hover:bg-surface-2 hover:text-text"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {siteConfig.nav.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                        active
                          ? "bg-surface-2 text-text"
                          : "text-text-secondary hover:bg-surface-2 hover:text-text",
                      )}
                    >
                      {item.label}
                      <Icon name="chevron-right" size={16} className="text-text-tertiary" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <Link
                href="/search"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text"
              >
                <Icon name="search" size={18} />
                Search
              </Link>
              <Link
                href="/newsletter"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-full"
              >
                Subscribe to the newsletter
              </Link>
            </div>
          </nav>

          <p className="shrink-0 border-t border-border px-6 py-5 text-xs text-text-tertiary">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
