import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, notifyNativeJoined } from "../lib/supabase";
import {
  acceptInvite,
  resolveInvite,
  type InviteKind,
  type InvitePreview,
} from "../lib/invites";

export default function InvitePage({ kind }: { kind: InviteKind }) {
  const { token = "" } = useParams();
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!cancelled) setSignedIn(!!session);
      try {
        const p = await resolveInvite(kind, token);
        if (!cancelled) setPreview(p);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load invite");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, token]);

  async function onJoin() {
    if (!preview?.valid) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await acceptInvite(preview);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setSuccess(res.message);
      notifyNativeJoined({
        kind: preview.kind,
        id: preview.targetId,
        name: preview.name,
      });
    } catch (e: any) {
      setError(e?.message || "Could not join");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Loading invite…</p>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="card">
        <div className="err">{error || "Invite not found"}</div>
        <Link to="/" className="btn secondary" style={{ display: "block", textAlign: "center" }}>
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <span className="badge">{preview.kind} invite</span>
      {preview.avatarUrl ? (
        <img className="avatar" src={preview.avatarUrl} alt="" />
      ) : (
        <div className="avatar" style={{ display: "grid", placeItems: "center", fontWeight: 700 }}>
          {(preview.name || "?").slice(0, 1).toUpperCase()}
        </div>
      )}
      <h1>{preview.name}</h1>
      {preview.description && <p className="muted">{preview.description}</p>}
      {preview.memberCount != null && (
        <p className="muted">{preview.memberCount} members</p>
      )}
      {error && <div className="err">{error}</div>}
      {success && <div className="ok-box">{success}</div>}
      {!preview.valid && (
        <div className="err">{preview.error || "This invite is not valid."}</div>
      )}

      {preview.valid && !success && (
        <>
          {!signedIn ? (
            <>
              <p className="muted">Sign in to join this {preview.kind}.</p>
              <Link
                to={`/login?next=${encodeURIComponent(window.location.pathname)}`}
                className="btn"
                style={{ display: "block", textAlign: "center" }}
              >
                Sign in with OTP
              </Link>
            </>
          ) : (
            <button className="btn ok" disabled={busy} onClick={onJoin}>
              {busy ? "Joining…" : `Join ${preview.kind}`}
            </button>
          )}
        </>
      )}

      <p className="meta">
        Token: <code>{token}</code>
      </p>
    </div>
  );
}
