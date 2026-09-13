import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import InvitePage from "./pages/InvitePage";

export default function App() {
  return (
    <div className="shell">
      <Link to="/" className="logo">
        <span className="logo-mark">R</span>
        RELAY
      </Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/invite/:token" element={<InvitePage kind="group" />} />
        <Route path="/g/:token" element={<InvitePage kind="group" />} />
        <Route path="/group/:token" element={<InvitePage kind="group" />} />
        <Route path="/c/:token" element={<InvitePage kind="community" />} />
        <Route path="/community/:token" element={<InvitePage kind="community" />} />
        <Route path="/channel/:token" element={<InvitePage kind="channel" />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
