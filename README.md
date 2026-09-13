# Relay Web

Public web surface for Relay:

- Email OTP sign-in (`/login`)
- Group invites (`/invite/:token`, `/g/:code`)
- Community links (`/c/:handle`)
- Channel invites (`/channel/:id`)

Designed to open inside the Relay Android WebView or in a browser.

## Env

Optional (defaults to the shared Supabase project):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Anon key is public; RLS protects data. Never add the service role key.

## Develop

```bash
npm install
npm run dev
```
