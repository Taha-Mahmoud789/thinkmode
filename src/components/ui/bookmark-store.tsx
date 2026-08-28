"use client";

import { useSyncExternalStore } from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

// Cached empty array to avoid infinite loop in useSyncExternalStore
const EMPTY_ARRAY: string[] = [];

const STORAGE_KEY = "thinkmode-bookmarks";

/* ---------- localStorage store (anonymous fallback) ---------- */

let localBookmarks: string[] | null = null;
const localListeners = new Set<() => void>();

function readLocal(): string[] {
  if (localBookmarks !== null) return localBookmarks;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    localBookmarks = raw ? (JSON.parse(raw) as string[]) : [];
    if (!Array.isArray(localBookmarks)) localBookmarks = [];
  } catch {
    localBookmarks = [];
  }
  return localBookmarks;
}

function writeLocal(next: string[]) {
  localBookmarks = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — keep in-memory only.
  }
  for (const listener of localListeners) listener();
}

function subscribeLocal(listener: () => void): () => void {
  localListeners.add(listener);
  return () => localListeners.delete(listener);
}

function getLocalSnapshot(): string[] {
  return readLocal();
}

function getLocalServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

/* ---------- Remote (DB) store for signed-in users ---------- */

let remoteBookmarks: string[] | null = null;
const remoteListeners = new Set<() => void>();
let remoteFetching = false;

async function fetchRemote(): Promise<string[]> {
  if (remoteBookmarks !== null) return remoteBookmarks;
  try {
    const res = await fetch("/api/bookmarks", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      remoteBookmarks = data.bookmarks ?? [];
    } else {
      remoteBookmarks = [];
    }
  } catch {
    remoteBookmarks = [];
  }
  return remoteBookmarks ?? [];
}

function writeRemote(next: string[]) {
  remoteBookmarks = next;
  for (const listener of remoteListeners) listener();
}

function subscribeRemote(listener: () => void): () => void {
  remoteListeners.add(listener);
  return () => remoteListeners.delete(listener);
}

function getRemoteSnapshot(): string[] {
  // Trigger fetch if not loaded yet
  if (remoteBookmarks === null && !remoteFetching) {
    remoteFetching = true;
    void fetchRemote().then(() => {
      remoteFetching = false;
      for (const listener of remoteListeners) listener();
    });
  }
  return remoteBookmarks ?? [];
}

function getRemoteServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

const FALLBACK_EMPTY_STORE = {
  subscribe: () => () => {},
  getSnapshot: () => EMPTY_ARRAY,
  getServerSnapshot: () => EMPTY_ARRAY,
};

/* ---------- Hook that picks the right store ---------- */

export function useBookmarks() {
  const { user, loading: authLoading } = useAuth();
  const [resolved, setResolved] = useState(false);

  // When auth state resolves (loading -> false), pick store
  useEffect(() => {
    if (!authLoading) requestAnimationFrame(() => setResolved(true));
  }, [authLoading]);

  const useStore = useMemo(() => {
    if (user) {
      return resolved
        ? {
            subscribe: subscribeRemote,
            getSnapshot: getRemoteSnapshot,
            getServerSnapshot: getRemoteServerSnapshot,
          }
        : FALLBACK_EMPTY_STORE;
    }
    return {
      subscribe: subscribeLocal,
      getSnapshot: getLocalSnapshot,
      getServerSnapshot: getLocalServerSnapshot,
    };
  }, [user, resolved]);

  const bookmarks = useSyncExternalStore(
    useStore.subscribe,
    useStore.getSnapshot,
    useStore.getServerSnapshot,
  );

  async function toggle(slug: string) {
    if (user) {
      // Optimistic UI
      const currentRemote = remoteBookmarks ?? [];
      const currently = currentRemote.includes(slug) ?? bookmarks.includes(slug);
      const next = currently
        ? currentRemote.filter((s) => s !== slug)
        : [...currentRemote, slug];
      writeRemote(next);
      try {
        await fetch("/api/bookmarks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      } catch {
        // Rollback on failure
        writeRemote(remoteBookmarks ?? []);
      }
    } else {
      const currently = bookmarks.includes(slug);
      const next = currently
        ? bookmarks.filter((s) => s !== slug)
        : [...bookmarks, slug];
      writeLocal(next);
    }
  }

  return { bookmarks, toggle, isBookmarked: (slug: string) => bookmarks.includes(slug) };
}

/* ---------- Convenience for non-React contexts ---------- */

export function isBookmarked(slug: string): boolean {
  // Only works synchronously for localStorage fallback
  return readLocal().includes(slug);
}