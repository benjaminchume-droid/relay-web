import { Link } from "react-router-dom";
import { RelayLogo, ShieldIcon } from "../components/RelayLogo";

export default function Home() {
  return (
    <div className="identity-card">
      <div className="logo-wrap">
        <RelayLogo />
      </div>
      <div className="badge-row">
        <span className="badge">
          <ShieldIcon />
          Relay Identity System
        </span>
      </div>
      <h1>Welcome to Relay</h1>
      <p className="subtitle">
        Sign in, join groups, and open community or channel invites. Designed for the Relay
        app WebView and the browser.
      </p>
      <Link to="/login" className="btn btn-primary" style={{ display: "block" }}>
        Sign In to Relay
      </Link>
      <p className="meta" style={{ marginTop: 20 }}>
        Invite formats
        <br />
        <code>/invite/TOKEN</code> · <code>/g/CODE</code> · <code>/c/handle</code> ·{" "}
        <code>/channel/ID</code>
      </p>
    </div>
  );
}
