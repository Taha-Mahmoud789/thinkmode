import type { Metadata } from "next";
import { ContactForm } from "@/components/blocks/contact-form";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the ThinkMode team — story tips, feedback, corrections, partnerships, and advertising inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-[72px]">
      <div className="tm-container grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl">
            Talk to us
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-secondary">
            Story tips, corrections, feedback, partnership ideas — we read
            everything and respond to anything that deserves a response.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary-light">
                <Icon name="mail" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-text">General &amp; editorial</h2>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-sm text-text-secondary underline-offset-4 transition hover:text-text hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/12 text-cyan">
                <Icon name="lightbulb" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-text">Story tips</h2>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Include “TIP” in the subject line. Anonymous is fine; detail helps.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning/12 text-warning">
                <Icon name="zap" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-text">Advertising</h2>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Sponsorships are clearly labeled and never influence editorial coverage.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
