"use client";

/**
 * Theme toggle with zero hydration complexity: the server renders both icons
 * and CSS (globals.css) shows the one matching [data-theme]. Click handler
 * flips the attribute and persists it. No state, no effects, no flash.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("thinkmode-theme", next);
    } catch {
      // Storage unavailable — theme still applies for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark or light theme"
      title="Toggle theme"
      data-testid="theme-toggle"
      className="grid h-9 w-9 place-items-center rounded-full border border-transparent text-text-secondary transition hover:border-border hover:bg-surface-2 hover:text-text"
    >
      {/* Moon — visible in dark mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="17"
        height="17"
        aria-hidden="true"
        className="tm-icon-dark"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sun — visible in light mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="17"
        height="17"
        aria-hidden="true"
        className="tm-icon-light"
      >
        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
    </button>
  );
}

/** Runs before paint to restore the persisted theme (prevents FOUC). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("thinkmode-theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
