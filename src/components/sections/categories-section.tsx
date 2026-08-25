import { CategoryCard, SectionHeader } from "@/components/sections/section-header";
import { Reveal } from "@/components/ui/reveal";
import type { CategoryWithCount } from "@/types";

/** Explore-by-topic band: responsive grid of premium category tiles. */
export function CategoriesSection({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="tm-section relative" aria-labelledby="categories-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[400px] bg-primary/5 blur-[120px]"
      />
      <div className="tm-container">
        <SectionHeader
          kicker="Explore by topic"
          title={<span id="categories-heading">Explore Categories</span>}
          description="Every piece is organized into focused tracks — pick your lane and go deep."
          linkHref="/categories"
          linkLabel="All categories"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 3) * 70}>
              <CategoryCard
                slug={category.slug}
                name={category.name}
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
