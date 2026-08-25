import type { Metadata } from "next";
import { CategoryCard, SectionHeader } from "@/components/sections/section-header";
import { getCategoriesWithCounts } from "@/lib/articles";
import { JsonLd, websiteSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore ThinkMode by topic — AI & machine learning, web development, programming, DevOps & cloud, cybersecurity, and developer tools.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();
  const totalArticles = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="pt-[72px]">
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />

      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
        </div>
        <div className="tm-container relative pb-14 pt-16 md:pt-24">
          <p className="kicker">Explore by topic</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl">
            Categories
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Focused tracks through the ideas and tools shaping modern software —
            pick a lane and go deep.
          </p>
          <p className="mt-6 text-sm text-text-tertiary">
            {categories.length} categories · {totalArticles} articles
          </p>
        </div>
      </header>

      <section className="tm-section">
        <div className="tm-container">
          <SectionHeader
            kicker="Browse"
            title="Every track we cover"
            description="Each category is curated — expect depth over volume."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                slug={category.slug}
                name={category.name}
                description={category.description}
                icon={category.icon}
                accent={category.accent}
                count={category.count}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
