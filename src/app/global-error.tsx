"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#e5e5e5",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 480 }}>
          <p
            style={{
              fontSize: "clamp(4rem, 12vw, 7rem)",
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            !
          </p>
          <h1
            style={{
              marginTop: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              marginTop: "1rem",
              color: "#a1a1aa",
              lineHeight: 1.6,
            }}
          >
            The app hit an unexpected error. You can try reloading, or go back
            to the home page.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: "#52525b",
                fontFamily: "monospace",
              }}
            >
              Error: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "9999px",
                border: "none",
                background: "#6366f1",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid #27272a",
                background: "transparent",
                color: "#e5e5e5",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
