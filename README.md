# Relay Web

Public **Relay Identity System** — sign-in, sign-up, OTP, Google (Supabase Auth), and group / community / channel invites.

Opened inside the Relay Android app via WebView (`https://relayweb.vercel.app`) or in a browser.

## Stack

- Vite + React + TypeScript
- **Supabase only** (Auth + RPCs). No Firebase.
- Light glass UI matching the Relay identity screens

## Env (optional — anon key is public)

```
VITE_SUPABASE_URL=https://gobwknacvpgysmgpvzqt.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Fallbacks are embedded for the Relay Supabase project so the site works without env if needed.

## Routes

| Path | Purpose |
|------|---------|
| `/login` | Sign in / create account / OTP / Google |
| `/invite/:token` `/g/:code` | Group invites |
| `/c/:handle` `/community/:token` | Community invites |
| `/channel/:token` | Channel invites |

## Related

- Mobile app: [benjaminchume-droid/Relay](https://github.com/benjaminchume-droid/Relay)
- Glass Line admin: [benjaminchume-droid/admin.glassline](https://github.com/benjaminchume-droid/admin.glassline)
