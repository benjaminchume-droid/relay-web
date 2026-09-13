import { createClient } from "@supabase/supabase-js";

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gobwknacvpgysmgpvzqt.supabase.co";
const anon =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYndrbmFjdnBneXNtZ3B2enF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTk5MzUsImV4cCI6MjA5NjU5NTkzNX0.1PsVy5VJiTr2vp7Qfj4zBEfBWHYrR6mvfqTkcZl48N4";

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Notify native WebView / parent that auth succeeded */
export function notifyNativeSession(session: {
  access_token: string;
  refresh_token: string;
}) {
  try {
    (window as any).RelayNative?.onAuthSession?.(session);
  } catch {
    /* ignore */
  }
  try {
    window.parent?.postMessage({ type: "relay:auth", session }, "*");
  } catch {
    /* ignore */
  }
}

export function notifyNativeJoined(payload: {
  kind: "group" | "community" | "channel";
  id: string;
  name?: string;
}) {
  try {
    (window as any).RelayNative?.onJoined?.(payload);
  } catch {
    /* ignore */
  }
  try {
    window.parent?.postMessage({ type: "relay:joined", ...payload }, "*");
  } catch {
    /* ignore */
  }
}
