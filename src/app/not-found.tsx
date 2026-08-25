import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden pt-[72px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="tm-container relative py-20 text-center">
        <p
          aria-hidden="true"
          className="text-gradient font-display text-[clamp(5rem,18vw,9rem)] font-extrabold leading-none tracking-tighter"
        >
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
          This page drifted out of memory
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-text-secondary">
          The address you followed doesn&apos;t exist — it may have been moved,
          renamed, or never compiled at all.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to home
            <Icon name="arrow-right" size={15} />
          </Link>
          <Link href="/articles" className="btn btn-secondary">
            Browse articles
          </Link>
        </div>
      </div>
    </div>
  );
}
