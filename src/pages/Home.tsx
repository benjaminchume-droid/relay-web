import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="card">
      <span className="badge">Relay Web</span>
      <h1>Messages, groups & communities</h1>
      <p className="muted">
        Use this site for sign-in, group invites, community links, and channel
        invites. Open it in the Relay app WebView or in your browser.
      </p>
      <Link to="/login" className="btn" style={{ display: "block", textAlign: "center" }}>
        Sign in with email OTP
      </Link>
      <p className="meta">
        Invite formats:
        <br />
        <code>/invite/TOKEN</code> · <code>/g/CODE</code> · <code>/c/handle</code> ·{" "}
        <code>/channel/ID</code>
      </p>
    </div>
  );
}
