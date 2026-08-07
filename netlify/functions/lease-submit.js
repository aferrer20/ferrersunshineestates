// Netlify Function: lease registration handler
//
// POST /.netlify/functions/lease-submit
// Body: JSON { org, prop, occupants, pets, car, charges, payUrl, summary }
//
// Sends two emails via Resend:
//   1. Owner copy — full signed record, reply-to the signer
//   2. Client copy — confirmation + link to the payment page
//
// Required Netlify environment variables:
//   RESEND_API_KEY   your Resend API key (re_...)
//   MAIL_FROM        verified sender, e.g. "Ferrer Sunshine Estates <bookings@ferrersunshineestates.com>"
//   MAIL_TO          owner inbox, e.g. "Amanda@bpestatemgmt.com"
//   SITE_URL         optional, e.g. "https://www.ferrersunshineestates.com"
//   MAIL_CC          optional — extra OWNER-SIDE recipients, comma separated.
//                    Do NOT put a client address here; the client gets their own
//                    email automatically. This copy contains the internal record.
//   MAIL_CC_CLIENT   optional — comma separated, copied on the CLIENT email only
//                    (e.g. a producer who should see the payment link).

const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function send(payload, key) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`);
  return JSON.parse(body);
}

const shell = (title, inner) => `<!doctype html><html><body style="margin:0;padding:0;background:#F2EAD3">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EAD3;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#FAF7F0;border:1px solid #D4C5B0;border-top:3px solid #C9A96E">
<tr><td style="background:#2C4A3E;padding:32px 24px;text-align:center">
<div style="font-family:Georgia,serif;font-size:30px;color:#FAF7F0;letter-spacing:.03em">Ferrer</div>
<div style="font-family:Georgia,serif;font-size:13px;color:#C9A96E;letter-spacing:.22em;margin-top:6px">— SUNSHINE ESTATES —</div>
</td></tr>
<tr><td style="padding:34px 34px 40px;font-family:Helvetica,Arial,sans-serif;color:#2A2A2A">
<h1 style="font-family:Georgia,serif;font-size:26px;font-weight:600;margin:0 0 20px;color:#2C4A3E">${esc(title)}</h1>
${inner}
</td></tr>
<tr><td style="padding:18px 24px;background:#F2EAD3;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.08em;color:#8C7B68">
FERRER SUNSHINE ESTATES · ST. PETERSBURG, FL · (727) 504-9949
</td></tr>
</table></td></tr></table></body></html>`;

const btn = (href, label, solid) =>
  `<a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border-radius:4px;${
    solid ? 'background:#2C4A3E;color:#FAF7F0;border:1px solid #2C4A3E' : 'background:transparent;color:#2C4A3E;border:1px solid #2C4A3E'
  }">${esc(label)}</a>`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.MAIL_FROM;
  const TO = process.env.MAIL_TO;
  if (!KEY || !FROM || !TO) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Mail not configured. Set RESEND_API_KEY, MAIL_FROM and MAIL_TO in Netlify.' }) };
  }

  let d;
  try { d = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Bad JSON' }) }; }

  const org = d.org || {};
  const prop = d.prop || {};
  const occs = Array.isArray(d.occupants) ? d.occupants : [];
  const charges = d.charges || {};
  const site = (process.env.SITE_URL || '').replace(/\/$/, '');
  const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ccOwner = list(process.env.MAIL_CC);
  const ccClient = list(process.env.MAIL_CC_CLIENT);
  const payUrl = d.payUrl ? (d.payUrl.startsWith('http') ? d.payUrl : `${site}/${d.payUrl.replace(/^\//, '')}`) : '';

  if (!org.email || !org.company || !org.signer) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing signer details' }) };
  }

  const deposit = Math.round(Number(charges.total || 0) * 50) / 100;
  const balance = Number(charges.total || 0) - deposit;

  const row = (l, r) =>
    `<tr><td style="padding:9px 0;border-bottom:1px solid #E8DECA;font-size:14px;color:#8C7B68">${esc(l)}</td><td style="padding:9px 0;border-bottom:1px solid #E8DECA;font-size:14px;color:#2A2A2A;text-align:right">${esc(r)}</td></tr>`;

  // ── 1. Owner copy ────────────────────────────────────────────
  const ownerHtml = shell(
    'Signed Lease Registration',
    `<p style="font-size:15px;line-height:1.6;color:#6B5C4E;margin:0 0 22px"><strong>${esc(org.company)}</strong> submitted a signed registration for ${esc(prop.address || 'the property')}.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
${row('Signer', `${org.signer}${org.title ? ', ' + org.title : ''}`)}
${row('Email', org.email)}
${row('Phone', org.phone || '—')}
${row('Entity', org.entity || '—')}
${row('Occupants', String(occs.length))}
${row('Contract total', usd(charges.total || 0))}
${row('Deposit due now', usd(deposit))}
</table>
${payUrl ? `<p style="margin:0 0 24px">${btn(payUrl, 'Open Their Payment Page', false)}</p>` : ''}
<pre style="font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.65;white-space:pre-wrap;background:#F2EAD3;border:1px solid #D4C5B0;border-radius:4px;padding:18px;color:#3D3530;margin:0">${esc(d.summary || '')}</pre>`
  );

  // ── 2. Client copy ───────────────────────────────────────────
  const clientHtml = shell(
    'Your Registration Is Received',
    `<p style="font-size:15px;line-height:1.7;color:#6B5C4E;margin:0 0 20px">Thank you, ${esc(org.signer)}. We have your signed lease registration for <strong>${esc(org.company)}</strong> at ${esc(prop.address || 'our St. Petersburg residence')}, for the term of ${esc(charges.term || 'August 23 – October 5, 2026')}.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px">
${row('Contract total', usd(charges.total || 0))}
${row('Due now — 50% deposit', usd(deposit))}
${row(`Balance — due ${charges.balanceDue || 'August 23, 2026'}`, usd(balance))}
</table>
${payUrl ? `<p style="margin:0 0 26px">${btn(payUrl, 'Make a Payment', true)}</p>` : ''}
<p style="font-size:14px;line-height:1.7;color:#6B5C4E;margin:0 0 8px">Your dates are held once the deposit clears. Keys are released when the balance is paid in full. A countersigned copy of the agreement follows within one business day.</p>
<p style="font-size:14px;line-height:1.7;color:#6B5C4E;margin:0">Questions — reply to this email or call (727) 504-9949.</p>`
  );

  try {
    await send({ from: FROM, to: [TO], ...(ccOwner.length ? { cc: ccOwner } : {}), reply_to: org.email, subject: `Signed Registration — ${org.company} — ${occs.length} occupants`, html: ownerHtml }, KEY);
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: 'Owner notification failed', detail: String(e.message) }) };
  }

  let clientSent = true;
  try {
    const clientTo = [org.email, ...ccClient.filter((a) => a.toLowerCase() !== org.email.toLowerCase())];
    await send({ from: FROM, to: clientTo, reply_to: TO, subject: 'Your reservation with Ferrer Sunshine Estates', html: clientHtml }, KEY);
  } catch (e) {
    clientSent = false;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, clientSent }),
  };
};
