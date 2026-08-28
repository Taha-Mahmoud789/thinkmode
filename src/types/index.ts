/** Shared domain types for ThinkMode. Strict — no `any`. */

export type IconName =
  | "sparkles"
  | "globe"
  | "code"
  | "cloud"
  | "shield"
  | "tool"
  | "search"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "bookmark"
  | "arrow-right"
  | "arrow-up-right"
  | "calendar"
  | "clock"
  | "share"
  | "copy"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "mail"
  | "rss"
  | "github"
  | "linkedin"
  | "x-social"
  | "trending-up"
  | "zap"
  | "book-open"
  | "users"
  | "user"
  | "log-in"
  | "log-out"
  | "info"
  | "alert-triangle"
  | "lightbulb"
  | "layers"
  | "list"
  | "external"
  | "play"
  | "message"
  | "cpu"
  | "chip"
  | "app"
  | "phone"
  | "lock"
  | "database"
  | "car"
  | "watch";

export interface NavigationItem {
  label: string;
  href: string;
  /** Mark as active when the pathname starts with this prefix. Defaults to href. */
  matchPrefix?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  links: SocialLink[];
}

export interface Category {
  slug: string;
  name: string;
  /** Short label used on image chips. */
  shortName: string;
  description: string;
  icon: IconName;
  /** Hex accent color for tints/gradients. */
  accent: string;
}

export interface TagRef {
  name: string;
  slug: string;
}

/** Parsed straight from MDX frontmatter (all strings/dates unparsed). */
export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime?: number;
  featured?: boolean;
  editorsPick?: boolean;
  trending?: number;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date string. */
  date: string;
  updatedAt?: string;
  author: Author;
  category: Category;
  tags: TagRef[];
  /** Explicit image override; otherwise a generated cover route URL. */
  image?: string;
  cover: string;
  readingMinutes: number;
  featured: boolean;
  editorsPick: boolean;
  trending?: number;
  url: string;
}

export interface Article extends ArticleMeta {
  /** Raw MDX body (frontmatter stripped). */
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface SearchResult {
  article: ArticleMeta;
  score: number;
  matchedOn: string[];
}

export interface CategoryWithCount extends Category {
  count: number;
}

export interface TagWithCount extends TagRef {
  count: number;
}

export interface AdjacentArticles {
  newer: ArticleMeta | null;
  older: ArticleMeta | null;
}
