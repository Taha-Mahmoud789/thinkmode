import React from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { codeToHtml } from "shiki";
import { Callout, type CalloutProps } from "@/components/content/callout";
import { Caption } from "@/components/content/caption";
import { YouTubeEmbed } from "@/components/content/youtube-embed";
import { slugify } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Text extraction helpers (MDX gives us React nodes, we need strings) */
/* ------------------------------------------------------------------ */

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

function Heading({
  level,
  children,
}: {
  level: 2 | 3;
  children: React.ReactNode;
}) {
  const id = slugify(extractText(children));
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id}>
      <a href={`#${id}`} aria-label="Link to this section" className="group">
        {children}
      </a>
    </Tag>
  );
}

function ArticleImage({
  alt = "",
  src,
  width,
  height,
}: {
  alt?: string;
  src?: string;
  width?: number | string;
  height?: number | string;
}) {
  if (!src) return null;
  const w = typeof width === "string" ? Number(width) : (width ?? 1200);
  const h = typeof height === "string" ? Number(height) : (height ?? 675);
  return (
    <span className="tm-article-figure">
      <Image
        src={src}
        alt={alt}
        width={w || 1200}
        height={h || 675}
        sizes="(max-width: 768px) 100vw, 800px"
        className="rounded-xl border border-border"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Shiki-powered code block                                            */
/* ------------------------------------------------------------------ */

async function CodeBlock({ children }: { children?: React.ReactNode }) {
  // <pre><code class="language-ts">…</code></pre> shape from MDX.
  let code = extractText(children);
  if (code.endsWith("\n")) code = code.slice(0, -1);

  let lang = "text";
  if (React.isValidElement(children)) {
    const props = children.props as { className?: string };
    const match = /language-([\w+-]+)/.exec(props.className ?? "");
    if (match) lang = match[1];
  }

  let html: string;
  try {
    html = await codeToHtml(code, {
      lang,
      themes: { light: "one-light", dark: "vesper" },
      defaultColor: false,
      transformers: [
        transformerNotationHighlight(),
        transformerNotationDiff(),
        transformerNotationWordHighlight(),
        transformerNotationErrorLevel(),
      ],
    });
  } catch {
    // Unknown language — fall back to plain rendering rather than crashing.
    html = await codeToHtml(code, {
      lang: "text",
      themes: { light: "one-light", dark: "vesper" },
      defaultColor: false,
    });
  }

  return (
    <div className="tm-codeblock">
      <div className="tm-codeblock-header" aria-hidden="true">
        <span className="tm-codeblock-lang">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-cyan" />
          {lang}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8l4 4-4 4" />
          <path d="M12 16h6" />
        </svg>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component map exposed to MDX authors                                */
/* ------------------------------------------------------------------ */

export const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h2 {...props} style={{ fontSize: "1.9rem" }} />
  ),
  h2: (props: React.ComponentProps<"h2">) => <Heading level={2}>{props.children}</Heading>,
  h3: (props: React.ComponentProps<"h3">) => <Heading level={3}>{props.children}</Heading>,
  pre: (props: React.ComponentProps<"pre">) => <CodeBlock>{props.children}</CodeBlock>,
  img: ArticleImage,
  a: ({ href = "", children, ...rest }: React.ComponentProps<"a">) => {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  },
  table: (props: React.ComponentProps<"table">) => (
    <div className="tm-table-wrap">
      <table {...props} />
    </div>
  ),
  Callout,
  Caption,
  YouTubeEmbed,
};

export type MdxCalloutProps = CalloutProps;

/** Render an article's MDX body on the server (syntax highlighting included). */
export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={mdxComponents} />;
}
