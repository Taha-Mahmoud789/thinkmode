import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { VisitorCounter } from "@/components/layout/visitor-counter";
import { siteConfig } from "@/config/site";

/** Site-wide premium footer. Server component — zero JS. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-border bg-surface/40">
      {/* subtle top glow line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="tm-container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              {siteConfig.description}
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social links">
              {siteConfig.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    title={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition hover:border-border-strong hover:bg-surface-2 hover:text-text"
                  >
                    <Icon name={social.icon} size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* link columns */}
          <FooterColumn title="Quick Links" links={siteConfig.footer.quickLinks} />
          <FooterColumn title="Resources" links={siteConfig.footer.resources} />
          <FooterColumn title="Legal" links={siteConfig.footer.legal} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-6">
          <VisitorCounter />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-text-tertiary">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-tertiary">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
