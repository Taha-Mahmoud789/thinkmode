"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, loading, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-text"
      >
        <Icon name="log-in" size={15} />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-text"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:inline">{user.username}</span>
        <Icon name="chevron-down" size={14} className="text-text-tertiary" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-border bg-surface py-2 shadow-card animate-in fade-in-0 zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-text">{user.username}</p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>
          <Link
            href="/bookmarks"
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Icon name="bookmark" size={15} />
            Bookmarks
          </Link>
          <Link
            href="/account"
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Icon name="user" size={15} />
            Account
          </Link>
          {user.isAdmin && (
            <Link
              href="/admin/moderation"
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Icon name="shield" size={15} />
              Moderation
            </Link>
          )}
          <hr className="my-1 border-border" />
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              await refresh();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-2"
            role="menuitem"
          >
            <Icon name="log-out" size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}