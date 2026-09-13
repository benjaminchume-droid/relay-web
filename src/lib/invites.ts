import { supabase } from "./supabase";

export type InviteKind = "group" | "community" | "channel";

export type InvitePreview = {
  kind: InviteKind;
  token: string;
  targetId: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount?: number;
  expiresAt?: string | null;
  valid: boolean;
  error?: string;
};

function looksLikeUuid(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

export async function resolveInvite(
  kind: InviteKind,
  tokenOrId: string
): Promise<InvitePreview> {
  const token = tokenOrId.trim();

  try {
    const { data: inv, error } = await supabase
      .from("invite_tokens")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (!error && inv) {
      const expired =
        inv.expires_at && new Date(inv.expires_at).getTime() < Date.now();
      if (expired || inv.revoked) {
        return {
          kind,
          token,
          targetId: inv.target_id,
          name: inv.target_name || "Invite",
          valid: false,
          error: expired ? "This invite has expired." : "This invite was revoked.",
        };
      }
      return {
        kind: (inv.kind as InviteKind) || kind,
        token,
        targetId: inv.target_id,
        name: inv.target_name || "Invite",
        description: inv.description || undefined,
        avatarUrl: inv.avatar_url || undefined,
        memberCount: inv.member_count ?? undefined,
        expiresAt: inv.expires_at,
        valid: true,
      };
    }
  } catch {
    /* table may not exist yet */
  }

  if (kind === "group") {
    let q = supabase
      .from("conversations")
      .select("id, name, description, avatar_url, conversation_type")
      .eq("conversation_type", "group");
    q = looksLikeUuid(token) ? q.eq("id", token) : q.eq("invite_code", token);
    const { data } = await q.maybeSingle();
    if (data) {
      return {
        kind: "group",
        token,
        targetId: data.id,
        name: data.name || "Group",
        description: data.description || undefined,
        avatarUrl: data.avatar_url || undefined,
        valid: true,
      };
    }
  }

  if (kind === "community") {
    let q = supabase
      .from("communities")
      .select("id, name, description, avatar_url, handle, member_count");
    q = looksLikeUuid(token)
      ? q.eq("id", token)
      : q.or(`handle.eq.${token},invite_code.eq.${token}`);
    const { data } = await q.maybeSingle();
    if (data) {
      return {
        kind: "community",
        token,
        targetId: data.id,
        name: data.name || data.handle || "Community",
        description: data.description || undefined,
        avatarUrl: data.avatar_url || undefined,
        memberCount: data.member_count ?? undefined,
        valid: true,
      };
    }
  }

  if (kind === "channel") {
    const { data } = await supabase
      .from("community_channels")
      .select("id, name, description, community_id")
      .eq("id", token)
      .maybeSingle();
    if (data) {
      return {
        kind: "channel",
        token,
        targetId: data.id,
        name: data.name || "Channel",
        description: data.description || undefined,
        valid: true,
      };
    }
  }

  return {
    kind,
    token,
    targetId: token,
    name: "Unknown invite",
    valid: false,
    error: "Invite not found or link is invalid.",
  };
}

export async function acceptInvite(
  preview: InvitePreview
): Promise<{ ok: boolean; message: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in first to join." };

  try {
    const { data, error } = await supabase.rpc("accept_invite", {
      p_token: preview.token,
      p_kind: preview.kind,
    });
    if (!error) {
      return { ok: true, message: (data as any)?.message || "Joined successfully." };
    }
  } catch {
    /* fall through */
  }

  if (preview.kind === "group") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .or(`auth_user_id.eq.${user.id},id.eq.${user.id}`)
      .maybeSingle();
    if (!profile) return { ok: false, message: "Profile not found. Finish setup in the app." };
    const { error } = await supabase.from("conversation_members").upsert(
      {
        conversation_id: preview.targetId,
        profile_id: profile.id,
        role: "member",
      },
      { onConflict: "conversation_id,profile_id" }
    );
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: `You joined ${preview.name}.` };
  }

  if (preview.kind === "community") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .or(`auth_user_id.eq.${user.id},id.eq.${user.id}`)
      .maybeSingle();
    if (!profile) return { ok: false, message: "Profile not found. Finish setup in the app." };
    const { error } = await supabase.from("community_members").upsert(
      {
        community_id: preview.targetId,
        profile_id: profile.id,
        role: "member",
      },
      { onConflict: "community_id,profile_id" }
    );
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: `You joined ${preview.name}.` };
  }

  return { ok: true, message: "Invite accepted. Open the Relay app to continue." };
}
