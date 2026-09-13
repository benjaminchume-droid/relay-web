/** Official Relay mark — blue rounded square with soft triangle + white dot */
export function RelayLogo({ size = 56 }: { size?: number }) {
  const r = Math.round(size * 0.28);
  return (
    <div
      className="logo-mark"
      style={{ width: size, height: size, borderRadius: r }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="18" fill="#2563EB" />
        <path
          d="M16 14C16 11.7909 17.7909 10 20 10H36.5C44.5081 10 51 16.4919 51 24.5C51 32.5081 44.5081 39 36.5 39H27V50C27 52.2091 25.2091 54 23 54H20C17.7909 54 16 52.2091 16 50V14Z"
          fill="#E8F0FF"
        />
        <circle cx="46" cy="46" r="9" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M5.3 14.3l-.8.6-2.5 1.9C3.6 20 7.5 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-6-4.4z" />
      <path fill="#4A90E2" d="M3.9 7.2C3.3 8.4 3 9.7 3 11.1c0 1.4.3 2.7.9 3.9l3.4-2.6c-.2-.6-.3-1.2-.3-1.9 0-.6.1-1.2.3-1.8L3.9 7.2z" />
      <path fill="#FBBC05" d="M12 5.5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 2.4 14.7 1.5 12 1.5 7.5 1.5 3.6 4 1.9 8.1l3.4 2.6C6.9 7.4 9.2 5.5 12 5.5z" />
    </svg>
  );
}
