import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { CategoryWithCount } from "@/types";

interface CategoryPillsProps {
  categories: CategoryWithCount[];
}

/**
 * Category Pills — Horizontal scrollable filter matching MAGZIN style
 */
export function CategoryPills({ categories }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  return (
    <section className="tm-section" aria-labelledby="categories-heading">
      <div className="tm-container">
        <Reveal>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {category.shortName}
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-text-tertiary">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
