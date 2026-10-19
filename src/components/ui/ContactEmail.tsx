"use client";

import { useEffect, useRef, useState } from "react";

export function ContactEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const contactRef = useRef<HTMLDivElement>(null);
  useEffect(() => { contactRef.current?.setAttribute("data-interactive", "true"); }, []);

  const copyEmail = async () => {
    setStatus("");
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email berhasil disalin.");
    } catch {
      setStatus("Email tidak dapat disalin otomatis. Pilih alamat email untuk menyalin atau membuka aplikasi email.");
    }
  };

  return (
    <div className="contact-email-group" ref={contactRef}>
      <a className="contact-email" href={`mailto:${email}`}>{email} <span aria-hidden="true">↗</span></a>
      <button type="button" className="button button-secondary copy-email" onClick={copyEmail}>Salin email</button>
      <p className="copy-status" role="status">{status}</p>
    </div>
  );
}
