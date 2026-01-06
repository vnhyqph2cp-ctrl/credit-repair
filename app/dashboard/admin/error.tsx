"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="surface card col" style={{ maxWidth: 480, margin: "80px auto" }}>
      <h2>Something went wrong</h2>
      <p className="text-muted">
        We couldn't load the admin dashboard right now.
      </p>
      <button className="btn glow-soft" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
