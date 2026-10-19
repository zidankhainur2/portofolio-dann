"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function DetailDisclosure({ title, label, eyebrow, closeLabel, actions, children }: {
  title: string; label: string; eyebrow: string; closeLabel: string; actions?: ReactNode; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const titleId = useId();

  // Without hydration the summary opens a native disclosure, not a dialog.
  useEffect(() => { summaryRef.current?.setAttribute("aria-haspopup", "dialog"); }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    return () => {
      dialog.close();
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <details className="detail-disclosure">
        <summary ref={summaryRef} onClick={(event) => { event.preventDefault(); setOpen(true); }}>{label}</summary>
        <div className="case-study-copy">{children}</div>
      </details>
      <dialog
        ref={dialogRef}
        className="detail-dialog"
        aria-labelledby={titleId}
        data-lenis-prevent
        onClose={(event) => { if (!event.currentTarget.open) setOpen(false); }}
      >
        <div className="detail-dialog-toolbar">
          <p className="eyebrow">{eyebrow}</p>
          <button type="button" className="button button-secondary" autoFocus onClick={() => setOpen(false)} aria-label={closeLabel}>Tutup <span aria-hidden="true">×</span></button>
        </div>
        <h2 id={titleId}>{title}</h2>
        <div className="detail-dialog-copy">{children}</div>
        {actions && <div className="project-actions">{actions}</div>}
      </dialog>
    </>
  );
}
