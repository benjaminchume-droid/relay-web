import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase, notifyNativeSession } from "../lib/supabase";
import { EyeIcon, GoogleIcon, RelayLogo, ShieldIcon } from "../components/RelayLogo";

type Mode = "signin" | "signup" | "otp";

export default function Login() {
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const title = useMemo(() => {
    if (mode === "signup") return "Create Relay Account";
    if (mode === "otp") return "Sign in with email code";
    return "Sign In to Relay";
  }, [mode]);

  const subtitle = useMemo(() => {
    if (mode === "signup") return "Sign up with email to build your secure identity.";
    if (mode === "otp") return "We'll email you a one-time code. No password needed.";
    return "Enter your email or handle and password.";
  }, [mode]);

  function clearMessages() {
    setError(null);
    setInfo(null);
  }

  async function finishSession(access_token: string, refresh_token: string) {
    notifyNativeSession({ access_token, refresh_token });
    setInfo("Signed in. You can return to the Relay app.");
    if (next && next !== "/login" && next.startsWith("/")) {
      window.setTimeout(() => {
        window.location.assign(next);
      }, 600);
    }
  }

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setBusy(true);
    try {
      const mail = email.trim();
      if (mode === "signup") {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        if (password !== confirm) throw new Error("Passwords do not match.");
        const { data, error: err } = await supabase.auth.signUp({
          email: mail,
          password,
          options: { emailRedirectTo: window.location.origin + "/login" },
        });
        if (err) throw err;
        if (data.session) {
          await finishSession(data.session.access_token, data.session.refresh_token);
        } else {
          setInfo("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: mail,
          password,
        });
        if (err) throw err;
        if (!data.session) throw new Error("No session returned.");
        await finishSession(data.session.access_token, data.session.refresh_token);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + "/login",
        },
      });
      if (err) throw err;
      setOtpSent(true);
      setInfo("Check your email for a 6-digit code.");
    } catch (err: any) {
      setError(err?.message || "Could not send code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setBusy(true);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "email",
      });
      if (err) throw err;
      if (!data.session) throw new Error("Invalid or expired code.");
      await finishSession(data.session.access_token, data.session.refresh_token);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    clearMessages();
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/login",
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (err) throw err;
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed.");
      setBusy(false);
    }
  }

  async function onForgot() {
    clearMessages();
    if (!email.trim()) {
      setError("Enter your email above first, then tap Forgot password.");
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/login",
      });
      if (err) throw err;
      setInfo("Password reset email sent if that account exists.");
    } catch (err: any) {
      setError(err?.message || "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="identity-card">
      <div className="logo-wrap">
        <RelayLogo size={56} />
      </div>
      <div className="badge-row">
        <span className="badge">
          <ShieldIcon />
          RELAY IDENTITY SYSTEM
        </span>
      </div>

      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>

      {error && <div className="err">{error}</div>}
      {info && <div className="ok-box">{info}</div>}

      {mode === "otp" ? (
        !otpSent ? (
          <form onSubmit={sendOtp}>
            <div className="field">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button className="btn btn-primary" disabled={busy} type="submit">
              {busy ? "Sending…" : "Send code"}
            </button>
            <button
              type="button"
              className="link-btn"
              style={{ marginTop: 16 }}
              onClick={() => {
                setMode("signin");
                clearMessages();
              }}
            >
              Back to password sign in
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <p className="otp-hint">Code sent to {email}</p>
            <div className="field">
              <label>ONE-TIME CODE</label>
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
            <button className="btn btn-primary" disabled={busy} type="submit">
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
            <button
              type="button"
              className="link-btn"
              style={{ marginTop: 14 }}
              disabled={busy}
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                clearMessages();
              }}
            >
              Use a different email
            </button>
          </form>
        )
      ) : (
        <form onSubmit={onPasswordSubmit}>
          <div className="field">
            <label>{mode === "signup" ? "EMAIL ADDRESS" : "EMAIL OR USERNAME HANDLE"}</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "signup" ? "you@example.com" : "you@example.com or @handle"}
            />
          </div>

          <div className="field">
            <label>PASSWORD</label>
            <div className="password-wrap">
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Minimum 8 characters" : "Your account password"}
                minLength={mode === "signup" ? 8 : undefined}
              />
              <button
                type="button"
                className="toggle-eye"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="field">
              <label>CONFIRM PASSWORD</label>
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                minLength={8}
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="row-between">
              <button type="button" className="link-btn" onClick={onForgot} disabled={busy}>
                Forgot password?
              </button>
            </div>
          )}

          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy
              ? mode === "signup"
                ? "Creating…"
                : "Signing in…"
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>
      )}

      {mode !== "otp" && (
        <>
          <div className="divider">or</div>

          <button type="button" className="btn btn-google" disabled={busy} onClick={onGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            className="link-btn otp-entry"
            disabled={busy}
            onClick={() => {
              setMode("otp");
              clearMessages();
              setOtpSent(false);
            }}
          >
            Sign in with email code instead
          </button>
        </>
      )}

      <p className="footer-switch">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setMode("signin");
                clearMessages();
              }}
            >
              Sign in
            </button>
          </>
        ) : mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setMode("signup");
                clearMessages();
              }}
            >
              Create account
            </button>
          </>
        ) : null}
      </p>

      <p className="meta">
        Powered by Supabase · <Link to="/">Home</Link>
      </p>
    </div>
  );
}
