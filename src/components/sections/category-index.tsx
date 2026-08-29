import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { CategoryCard } from "@/components/sections/section-header";
import type { CategoryWithCount } from "@/types";

interface CategoryIndexProps {
  categories: CategoryWithCount[];
}

/**
 * Visual category explorer: icon-driven cards with accent colors,
 * article counts, and hover gradient overlays.
 */
export function CategoryIndex({ categories }: CategoryIndexProps) {
  if (categories.length === 0) return null;

  return (
    <section className="tm-section" aria-labelledby="sections-heading">
      <div className="tm-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Browse by topic</p>
            <h2
              id="sections-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
            >
              Explore Topics
            </h2>
          </div>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-text-secondary transition hover:text-text"
          >
            All categories
            <Icon
              name="arrow-right"
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 50}>
              <CategoryCard
                slug={category.slug}
                name={category.name}
                description={category.description}
                icon={category.icon}
                accent={category.accent}
                count={category.count}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
