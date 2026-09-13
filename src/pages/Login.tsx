import { useState } from "react";
import { supabase, notifyNativeSession } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + "/login",
        },
      });
      if (err) throw err;
      setStep("otp");
      setInfo("Check your email for a 6-digit code.");
    } catch (err: any) {
      setError(err?.message || "Could not send code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "email",
      });
      if (err) throw err;
      if (data.session) {
        notifyNativeSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setInfo("Signed in. You can return to the Relay app.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <span className="badge">Email OTP</span>
      <h1>Sign in to Relay</h1>
      <p className="muted">
        We email you a one-time code. No password required for this flow.
      </p>
      {error && <div className="err">{error}</div>}
      {info && <div className="ok-box">{info}</div>}

      {step === "email" ? (
        <form onSubmit={sendOtp}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button className="btn" disabled={busy} type="submit">
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <div className="field">
            <label>Code sent to {email}</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
            />
          </div>
          <button className="btn" disabled={busy} type="submit">
            {busy ? "Verifying…" : "Verify & continue"}
          </button>
          <button
            type="button"
            className="btn secondary"
            disabled={busy}
            onClick={() => {
              setStep("email");
              setOtp("");
              setInfo(null);
            }}
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
