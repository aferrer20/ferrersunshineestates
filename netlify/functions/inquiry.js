// Netlify Function: guest inquiry handler
//
// POST /.netlify/functions/inquiry
// Body: FormData or JSON — any field names. Reserved keys:
//   _subject   email subject line
//   email      guest's email (used as reply-to and for the guest auto-reply)
//   Property   which listing the inquiry came from
//
// Sends via Resend:
//   1. Owner notification — all submitted fields, reply-to the guest
//   2. Guest auto-reply — warm confirmation (skipped if no valid email)
//
// Env vars: RESEND_API_KEY, MAIL_FROM, MAIL_TO, and optionally MAIL_CC.

const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function send(payload, key) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

const shell = (inner) => `<!doctype html><html><body style="margin:0;padding:0;background:#F2EAD3">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EAD3;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FAF7F0;border:1px solid #D4C5B0;border-top:3px solid #C9A96E">
<tr><td style="background:#2C4A3E;padding:30px 24px;text-align:center">
<div style="font-family:Georgia,serif;font-size:28px;color:#FAF7F0;letter-spacing:.03em">Ferrer</div>
<div style="font-family:Georgia,serif;font-size:12px;color:#C9A96E;letter-spacing:.22em;margin-top:5px">— SUNSHINE ESTATES —</div>
</td></tr>
<tr><td style="padding:32px 32px 38px;font-family:Helvetica,Arial,sans-serif;color:#2A2A2A">${inner}</td></tr>
<tr><td style="padding:16px 24px;background:#F2EAD3;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.08em;color:#8C7B68">
ST. PETERSBURG, FL · (727) 504-9949
</td></tr>
</table></td></tr></table></body></html>`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.MAIL_FROM;
  const TO = process.env.MAIL_TO;
  if (!KEY || !FROM || !TO) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Mail not configured' }) };
  }

  // Accept JSON or urlencoded form bodies.
  let fields = {};
  const ct = (event.headers['content-type'] || event.headers['Content-Type'] || '').toLowerCase();
  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
  try {
    if (ct.includes('application/json')) fields = JSON.parse(raw || '{}');
    else new URLSearchParams(raw).forEach((v, k) => { fields[k] = v; });
  } catch (e) {
    return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Bad body' }) };
  }

  const subject = fields._subject || 'New inquiry — Ferrer Sunshine Estates';
  const guestEmail = (fields.email || '').trim();
  const property = fields.Property || '';
  const first = fields['First name'] || '';
  const ccOwner = (process.env.MAIL_CC || '').split(',').map((s) => s.trim()).filter(Boolean);

  // Honeypot: silently accept obvious bots without emailing.
  if (fields._gotcha) return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };

  const rows = Object.keys(fields)
    .filter((k) => k[0] !== '_' && String(fields[k]).trim() !== '')
    .map((k) => `<tr><td style="padding:9px 14px 9px 0;border-bottom:1px solid #E8DECA;font-size:13px;color:#8C7B68;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid #E8DECA;font-size:14px;color:#2A2A2A">${esc(fields[k]).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');

  const ownerHtml = shell(
    `<h1 style="font-family:Georgia,serif;font-size:24px;font-weight:600;margin:0 0 6px;color:#2C4A3E">New Inquiry</h1>
${property ? `<p style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#8C7B68;margin:0 0 22px">${esc(property)}</p>` : ''}
<table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
${guestEmail ? `<p style="margin:26px 0 0"><a href="mailto:${esc(guestEmail)}" style="display:inline-block;padding:13px 26px;background:#2C4A3E;color:#FAF7F0;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border-radius:4px">Reply to Guest</a></p>` : ''}`
  );

  const guestHtml = shell(
    `<h1 style="font-family:Georgia,serif;font-size:26px;font-weight:600;margin:0 0 18px;color:#2C4A3E">Thank you${first ? ', ' + esc(first) : ''}.</h1>
<p style="font-size:15px;line-height:1.7;color:#6B5C4E;margin:0 0 16px">We have your inquiry${property ? ` about <strong>${esc(property)}</strong>` : ''} and we're glad you reached out.</p>
<p style="font-size:15px;line-height:1.7;color:#6B5C4E;margin:0 0 16px">Amanda personally replies to every inquiry — usually within the hour during business hours. If your dates are time-sensitive, call or text <strong>(727) 504-9949</strong> and we'll sort it out faster.</p>
<p style="font-size:15px;line-height:1.7;color:#6B5C4E;margin:0">Talk soon.<br><span style="font-family:Georgia,serif;font-size:19px;color:#2C4A3E">Ferrer Sunshine Estates</span></p>`
  );

  try {
    await send({ from: FROM, to: [TO], ...(ccOwner.length ? { cc: ccOwner } : {}), ...(guestEmail ? { reply_to: guestEmail } : {}), subject, html: ownerHtml }, KEY);
  } catch (e) {
    return { statusCode: 502, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Send failed', detail: String(e.message) }) };
  }

  let guestSent = false;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)) {
    try { await send({ from: FROM, to: [guestEmail], reply_to: TO, subject: 'We received your inquiry — Ferrer Sunshine Estates', html: guestHtml }, KEY); guestSent = true; } catch (e) { /* non-fatal */ }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, guestSent }),
  };
};
