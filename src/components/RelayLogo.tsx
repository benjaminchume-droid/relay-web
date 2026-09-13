/** Official Relay mark — blue rounded square with play shape + dot */
export function RelayLogo({ size = 56 }: { size?: number }) {
  return (
    <div className="logo-mark" style={{ width: size, height: size, borderRadius: size * 0.28 }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M8 7.5C8 6.12 9.12 5 10.5 5H18.2C22.4 5 25.5 8.2 25.5 12.2C25.5 16.2 22.4 19.4 18.2 19.4H13.5V24.5C13.5 25.88 12.38 27 11 27H10.5C9.12 27 8 25.88 8 24.5V7.5Z"
          fill="#E0ECFF"
        />
        <circle cx="22.5" cy="22.5" r="4.2" fill="#FFFFFF" />
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

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M5.3 14.3l-.8.6-2.5 1.9C3.6 20 7.5 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-6-4.4z" />
      <path fill="#4A90E2" d="M3.9 7.2C3.3 8.4 3 9.7 3 11.1c0 1.4.3 2.7.9 3.9l3.4-2.6c-.2-.6-.3-1.2-.3-1.9 0-.6.1-1.2.3-1.8L3.9 7.2z" />
      <path fill="#FBBC05" d="M12 5.5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 2.4 14.7 1.5 12 1.5 7.5 1.5 3.6 4 1.9 8.1l3.4 2.6C6.9 7.4 9.2 5.5 12 5.5z" />
    </svg>
  );
}
