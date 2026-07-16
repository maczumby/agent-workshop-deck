// Cloudflare Worker: relays workshop deck signups to Filament as a message.
// Deploy free at dash.cloudflare.com (Workers > Create). Then set two secrets:
//   FILAMENT_TOKEN   an mct_ bot token (use a dedicated/limited bot, not your personal login)
//   FILAMENT_ROOM_ID the channel/room id to post signups into, e.g. !xxxx:api.filament.dm
// Finally paste this Worker's URL into SIGNUP_ENDPOINT in index.html.
export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('ok', { headers: cors });
    let b;
    try { b = await req.json(); } catch { return new Response('bad json', { status: 400, headers: cors }); }
    const name = String(b.name || '').slice(0, 120).replace(/[\r\n]+/g, ' ');
    const email = String(b.email || '').slice(0, 200).replace(/[\r\n]+/g, ' ');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return new Response('bad email', { status: 400, headers: cors });
    const text = `New workshop deck signup:\n• ${name}\n• ${email}`;
    const txn = Date.now() + '_' + Math.random().toString(36).slice(2);
    const url = `https://api.filament.dm/_matrix/client/v3/rooms/${encodeURIComponent(env.FILAMENT_ROOM_ID)}/send/m.room.message/${txn}`;
    const r = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${env.FILAMENT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ msgtype: 'm.text', body: text }),
    });
    return new Response(r.ok ? 'ok' : 'relay failed', { status: r.ok ? 200 : 502, headers: cors });
  },
};
