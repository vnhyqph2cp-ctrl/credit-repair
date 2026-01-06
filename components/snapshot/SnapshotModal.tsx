"use client";

export function SnapshotModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-top">
          <h2 className="modal-title">Free Credit Snapshot</h2>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="modal-sub">
          See what’s hurting your credit and what’s enforceable — no guesswork.
        </p>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <input className="modal-input" placeholder="Full Name" />
          <input className="modal-input" placeholder="Email" />
          <button className="btn btn-large glow-neon btn-3d w-full" type="submit">
            Run Snapshot
          </button>
        </form>

        <div className="modal-foot">
          <span className="text-xs opacity-60">
            By continuing, you agree to receive snapshot results by email.
          </span>
        </div>
      </div>
    </div>
  );
}
