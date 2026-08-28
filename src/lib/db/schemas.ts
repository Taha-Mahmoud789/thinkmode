import { z } from "zod";

/** Shared domain schemas for the Mongo-backed features. */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128);

export const usernameSchema = z
  .string()
  .trim()
  .min(2, "Display name must be at least 2 characters")
  .max(50);

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Invalid slug")
  .min(1)
  .max(200);

export const commentBodySchema = z
  .string()
  .trim()
  .min(1, "Comment cannot be empty")
  .max(2000, "Comment is too long (max 2000 characters)");

/** Zod-inferred domain types. */
export type Email = z.infer<typeof emailSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type Username = z.infer<typeof usernameSchema>;
export type CommentBody = z.infer<typeof commentBodySchema>;

/* ----------------------------- Mongo documents ----------------------------- */

export interface UserDoc {
  _id: import("mongodb").ObjectId;
  username: string;
  email: string;
  /** Argon2id-ish hash. Never store plaintext. */
  passwordHash: string;
  /** Email verification status */
  emailVerified: boolean;
  /** Admin access for moderation */
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDoc {
  _id: import("mongodb").ObjectId;
  userId: import("mongodb").ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface BookmarkDoc {
  _id: import("mongodb").ObjectId;
  userId: import("mongodb").ObjectId;
  articleSlug: string;
  createdAt: Date;
}

export interface CommentDoc {
  _id: import("mongodb").ObjectId;
  articleSlug: string;
  author: {
    userId: import("mongodb").ObjectId;
    username: string;
  };
  body: string;
  hidden: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/** Password reset token document */
export interface PasswordResetDoc {
  _id: import("mongodb").ObjectId;
  userId: import("mongodb").ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

/** Email verification token document */
export interface EmailVerificationDoc {
  _id: import("mongodb").ObjectId;
  userId: import("mongodb").ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

/** Comment report document */
export interface CommentReportDoc {
  _id: import("mongodb").ObjectId;
  commentId: import("mongodb").ObjectId;
  reporterId: import("mongodb").ObjectId;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  createdAt: Date;
}