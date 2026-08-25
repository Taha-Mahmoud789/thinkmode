import Script from "next/script";
import { monetizationConfig } from "@/config/site";

type AdVariant = "banner" | "rectangle" | "in-article";

interface AdSlotProps {
  /** Stable slot id from your ad network dashboard. */
  slotId?: string;
  /** Accessible label describing what the space is reserved for. */
  label?: string;
  variant?: AdVariant;
  className?: string;
}

const VARIANT_CLASS: Record<AdVariant, string> = {
  banner: "min-h-[90px]",
  rectangle: "min-h-[250px]",
  "in-article": "min-h-[120px]",
};

/**
 * Ad architecture — deliberately inert until configured.
 *
 * Renders NOTHING visible until NEXT_PUBLIC_ADSENSE_CLIENT_ID is set
 * (Vercel env var). When it is, the AdSense loader script is injected once
 * per page and slots render real <ins class="adsbygoogle"> units. No fake
 * ads, no layout shift for readers while unconfigured.
 *
 * Keep editorial content visually separated from these containers.
 */
export function AdSlot({
  slotId,
  label = "Advertisement",
  variant = "banner",
  className = "",
}: AdSlotProps) {
  const clientId = monetizationConfig.adsenseClientId;

  if (!clientId || !slotId) return null;

  return (
    <aside
      aria-label={label}
      data-ad-slot={slotId}
      className={`tm-ad not-prose mx-auto w-full max-w-3xl overflow-hidden ${VARIANT_CLASS[variant]} ${className}`}
    >
      <Script
        id="adsbygoogle-init"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

/** Horizontal leaderboard-style placement (header/footer zones). */
export function AdBanner(props: Omit<AdSlotProps, "variant">) {
  return <AdSlot {...props} variant="banner" />;
}

/** 300×250-class rectangle for sidebar placements. */
export function AdRectangle(props: Omit<AdSlotProps, "variant">) {
  return <AdSlot {...props} variant="rectangle" />;
}

/** Between-sections unit inside article bodies. */
export function AdInArticle(props: Omit<AdSlotProps, "variant">) {
  return <AdSlot {...props} variant="in-article" />;
}
