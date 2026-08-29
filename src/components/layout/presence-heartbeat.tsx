"use client";

import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds
const STORAGE_KEY = "tm_presence_id";

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

/**
 * Sends periodic heartbeats to /api/presence so the server can count
 * how many users are currently online. Renders nothing.
 */
export function PresenceHeartbeat() {
  useEffect(() => {
    const userId = getOrCreateUserId();
    if (!userId) return;

    let cancelled = false;

    const send = async () => {
      if (cancelled) return;
      try {
        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
          keepalive: true,
        });
      } catch {
        // Ignore — next heartbeat will retry.
      }
    };

    // Send immediately on mount
    void send();
    const interval = window.setInterval(send, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
