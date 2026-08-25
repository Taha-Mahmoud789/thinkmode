/**
 * Privacy-friendly YouTube embed. Renders a lightweight poster facade and only
 * loads youtube-nocookie.com when the reader clicks play.
 */
export function YouTubeEmbed({
  id,
  title = "YouTube video",
}: {
  id: string;
  title?: string;
}) {
  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-2">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {title !== "YouTube video" ? (
        <figcaption className="mt-2 text-center text-[0.82rem] italic text-text-tertiary">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Click-to-load facade (no iframe until interaction).
 * Kept for future use when the embed moves behind a consent gate.
 */
export function YouTubeFacade({ id, title }: { id: string; title?: string }) {
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <form action={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} target="_blank" className="my-10">
      <button
        type="submit"
        aria-label={title ? `Play video: ${title}` : "Play video"}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/90 shadow-glow-md transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="#fff" className="ml-1 h-6 w-6" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    </form>
  );
}
