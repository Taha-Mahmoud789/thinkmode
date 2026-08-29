import { siteConfig } from "@/config/site";

/**
 * Hero Banner — Clean, centered headline section
 * Inspired by MAGZIN editorial design
 */
export function HeroBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="tm-container text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl">
          Your Gateway to{" "}
          <span className="text-primary">{siteConfig.name} News</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
          {siteConfig.tagline}
        </p>
      </div>
    </section>
  );
}
