# Signup relay (deck → Filament)

The deck's name/email gate POSTs `{name, email, ts}` here; this Worker posts it
into a Filament channel so you get each signup as a message. The token lives as
a server secret, never in the public page.

## Deploy (free, ~5 min)
1. dash.cloudflare.com → Workers & Pages → Create → Worker. Paste `worker.js`, Deploy.
2. Settings → Variables → add two **secrets**:
   - `FILAMENT_TOKEN` — an `mct_` bot token (dedicated/limited bot, not your personal login)
   - `FILAMENT_ROOM_ID` — the channel to receive signups, e.g. `!xxxx:api.filament.dm`
3. Copy the Worker URL, paste it into `SIGNUP_ENDPOINT` in `index.html`, push.

Until `SIGNUP_ENDPOINT` is set, the gate still validates and reveals the deck; it
just doesn't send anything.
