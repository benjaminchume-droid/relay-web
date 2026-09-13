import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import InvitePage from "./pages/InvitePage";
import { supabase, notifyNativeSession } from "./lib/supabase";

export default function App() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        notifyNativeSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="shell">
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
