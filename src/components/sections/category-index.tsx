import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import type { CategoryWithCount } from "@/types";

interface CategoryIndexProps {
  categories: CategoryWithCount[];
}

/**
 * Editorial "Sections" index: hairline tiles with an accent rule, a short
 * descriptor, and the number of stories. Text-led, no glow chrome.
 */
export function CategoryIndex({ categories }: CategoryIndexProps) {
  if (categories.length === 0) return null;

  return (
    <section className="tm-section" aria-labelledby="sections-heading">
      <div className="tm-container">
        <div className="mb-8 flex items-baseline justify-between border-b-2 border-text pb-3">
          <h2
            id="sections-heading"
            className="font-display text-2xl font-bold tracking-tight text-text"
          >
            Sections
          </h2>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
          >
            Browse all
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 3) * 70}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex flex-col border-t border-border pb-7 pt-5"
              >
                <span
                  aria-hidden="true"
                  className="h-[3px] w-10 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: category.accent }}
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-text transition-colors group-hover:text-primary-light">
                    {category.name}
                  </h3>
                  <Icon
                    name="arrow-up-right"
                    size={18}
                    className="text-text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-light"
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {category.description}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-text-tertiary">
                  {category.count} {category.count === 1 ? "story" : "stories"}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}