const { useState, useRef, useEffect, useCallback } = React;

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdqdeyl';
const MAIL_FUNCTION = '/.netlify/functions/lease-submit';

// ── PAYMENT LINKS ──────────────────────────────────────────
// Chase invoice URLs. Leave a value as '' to hide that button.
const PAYMENT_LINK = 'https://payments.chase.com/?invid=KMRPYR46YYYH';        // 50% deposit
const PAYMENT_LINK_BALANCE = 'https://payments.chase.com/?invid=KMRPYR46YYZ2'; // final balance
const PAYMENT_LABEL = 'Pay Deposit';
const BALANCE_DUE_LABEL = 'August 23, 2026';
// ─────────────────────────────────────────────────────────────


const TERMS = {
  start: '2026-08-23', end: '2026-10-05',
  startLabel: 'August 23, 2026', endLabel: 'October 5, 2026',
  rent: 7450, cleaning: 350, deposit: 1000, petFee: 250, carDay: 100,
  config: '3 Bedroom / 3 Bath', maxOccupants: 3,
};
const usd = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const uid = () => Math.random().toString(36).slice(2, 9);

const blankOccupant = () => ({ id: uid(), name: '', dob: '', email: '', phone: '', address: '', moveIn: TERMS.start, role: '' });
const blankPet = () => ({ id: uid(), owner: '', type: '', breed: '', weight: '', bite: '', biteDetail: '', vax: '' });

function Field({ label, required, hint, error, children }) {
  return (
    <div className="f">
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && <div className="hint">{hint}</div>}
      {error && <div className="emsg">{error}</div>}
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="toggle">
      {options.map(o => (
        <button type="button" key={o} className={value === o ? 'on' : ''} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function SignaturePad({ value, onChange, caption, missing }) {
  const cvs = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const valRef = useRef(value);
  useEffect(() => { valRef.current = value; }, [value]);

  const ctxOf = () => {
    const c = cvs.current;
    const ctx = c.getContext('2d');
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1A2E26';
    return ctx;
  };

  useEffect(() => {
    const c = cvs.current;
    if (!c) return;
    let t = null;
    const apply = () => {
      const r = c.getBoundingClientRect();
      if (!r.width) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (c.width === w && c.height === h) return;
      const prev = valRef.current || (c.width ? c.toDataURL('image/png') : '');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (prev) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height); img.src = prev; }
    };
    const resize = () => { if (drawing.current) return; clearTimeout(t); t = setTimeout(apply, 120); };
    apply();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    return () => { clearTimeout(t); window.removeEventListener('resize', resize); window.removeEventListener('orientationchange', resize); };
  }, []);

  const pos = e => {
    const r = cvs.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = e => { e.preventDefault(); drawing.current = true; last.current = pos(e); cvs.current.setPointerCapture(e.pointerId); };
  const move = e => {
    if (!drawing.current) return;
    const p = pos(e); const ctx = ctxOf();
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last.current = p;
  };
  const up = () => { if (!drawing.current) return; drawing.current = false; onChange(cvs.current.toDataURL('image/png')); };
  const clear = () => {
    const c = cvs.current; const ctx = c.getContext('2d');
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ctx.restore();
    onChange('');
  };

  return (
    <div className={'sig-wrap' + (missing ? ' miss' : '')}>
      <canvas ref={cvs} className="sig-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} />
      <div className="sig-bar">
        <em>{caption}</em>
        <button type="button" onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

function OccupantCard({ occ, index, onChange, onRemove, canRemove, errors }) {
  const set = (k, v) => onChange({ ...occ, [k]: v });
  const e = errors[occ.id] || {};
  return (
    <div className="card">
      <div className="card-top">
        <div className="card-title">Occupant {String(index + 1).padStart(2, '0')}</div>
        {canRemove && <button type="button" className="btn btn-ghost" onClick={onRemove}>Remove</button>}
      </div>
      <div className="grid">
        <Field label="Full legal name" required error={e.name}>
          <input className={e.name ? 'err' : ''} value={occ.name} onChange={ev => set('name', ev.target.value)} placeholder="As it appears on government ID" />
        </Field>
        <Field label="Role / production title">
          <input value={occ.role} onChange={ev => set('role', ev.target.value)} placeholder="e.g. Cast — Ensemble" />
        </Field>
        <Field label="Date of birth" required hint="Occupant must be 18 or older." error={e.dob}>
          <input type="date" className={e.dob ? 'err' : ''} value={occ.dob} onChange={ev => set('dob', ev.target.value)} />
        </Field>
        <Field label="Move-in date" required error={e.moveIn}>
          <input type="date" className={e.moveIn ? 'err' : ''} value={occ.moveIn} min={TERMS.start} max={TERMS.end} onChange={ev => set('moveIn', ev.target.value)} />
        </Field>
        <Field label="Email" required error={e.email}>
          <input type="email" className={e.email ? 'err' : ''} value={occ.email} onChange={ev => set('email', ev.target.value)} placeholder="name@email.com" />
        </Field>
        <Field label="Mobile phone" required error={e.phone}>
          <input type="tel" className={e.phone ? 'err' : ''} value={occ.phone} onChange={ev => set('phone', ev.target.value)} placeholder="(727) 555-0134" />
        </Field>
        <div className="span2">
          <Field label="Current home address" required hint="Street, city, state, ZIP — the address you are travelling from." error={e.address}>
            <input className={e.address ? 'err' : ''} value={occ.address} onChange={ev => set('address', ev.target.value)} placeholder="123 Main St, Brooklyn, NY 11201" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function PetCard({ pet, index, onChange, onRemove, occupants }) {
  const set = (k, v) => onChange({ ...pet, [k]: v });
  return (
    <div className="card">
      <div className="card-top">
        <div className="card-title">Animal {String(index + 1).padStart(2, '0')}</div>
        <button type="button" className="btn btn-ghost" onClick={onRemove}>Remove</button>
      </div>
      <div className="grid">
        <Field label="Responsible occupant" required>
          <select value={pet.owner} onChange={ev => set('owner', ev.target.value)}>
            <option value="">Select occupant…</option>
            {occupants.filter(o => o.name).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
          </select>
        </Field>
        <Field label="Animal type" required>
          <input value={pet.type} onChange={ev => set('type', ev.target.value)} placeholder="Dog, cat, etc." />
        </Field>
        <Field label="Breed" required>
          <input value={pet.breed} onChange={ev => set('breed', ev.target.value)} placeholder="e.g. Labrador mix" />
        </Field>
        <Field label="Weight (lbs)" required>
          <input type="number" min="0" value={pet.weight} onChange={ev => set('weight', ev.target.value)} placeholder="45" />
        </Field>
        <Field label="Vaccinations current, including rabies?" required>
          <Toggle value={pet.vax} onChange={v => set('vax', v)} options={['Yes', 'No']} />
        </Field>
        <Field label="Any history of biting or aggression?" required>
          <Toggle value={pet.bite} onChange={v => set('bite', v)} options={['No', 'Yes']} />
        </Field>
        {pet.bite === 'Yes' && (
          <div className="span2">
            <Field label="Describe the incident(s)" required hint="Date, circumstances, and outcome. Disclosure is required; non-disclosure is grounds for removal of the animal.">
              <textarea value={pet.biteDetail} onChange={ev => set('biteDetail', ev.target.value)} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

const ACKS = [
  { id: 'liability', text: <span><b>Limitation of liability.</b> Owner, Ferrer Sunshine Estates, and their agents are not liable for any injury, illness, death, loss, theft, or property damage sustained by Lessee, any Occupant, or any guest on or about the premises, except to the extent caused by Owner's gross negligence or willful misconduct. Occupants use the residence, yard, driveway, and all fixtures and equipment entirely at their own risk.</span> },
  { id: 'petliab', text: <span><b>Animal liability.</b> The occupant registering an animal assumes full and sole liability for that animal and shall indemnify and hold Owner harmless from any claim, damage, injury, or cost caused by it — including injury to any person, damage to the residence, and remediation of odor, stains, pests, or waste.</span> },
  { id: 'condition', text: <span><b>Condition and insurance.</b> The residence is accepted in its present, furnished condition. Lessee is responsible for the cost of repair or replacement of furnishings, appliances, and finishes damaged beyond ordinary wear. Owner's insurance does not cover Occupants' personal property; renter's insurance is strongly recommended.</span> },
  { id: 'conduct', text: <span><b>Occupancy and conduct.</b> Only the occupants registered on this form may reside at the residence. No smoking or vaping indoors, no subletting or re-listing on any short-term rental platform, and quiet hours are observed from 10:00 PM to 8:00 AM. Unregistered occupancy is a material breach.</span> },
  { id: 'schedule', text: <span><b>Payment schedule.</b> Fifty percent (50%) of the total is due upon execution of this registration to reserve the dates; the remaining balance is due in full on or before <b>{BALANCE_DUE_LABEL}</b>, the first day of the term. Dates are not held until the first payment clears, and keys will not be released until the balance is paid in full.</span> },
  { id: 'deposit', text: <span><b>Security deposit.</b> The $1,000.00 security deposit is refundable and will be held and returned in accordance with <b>Fla. Stat. § 83.49</b>. Cleaning and pet fees are separate from the deposit and are non-refundable.</span> },
  { id: 'accuracy', text: <span><b>Accuracy.</b> The undersigned certifies that all information provided — including occupant identities, dates of birth, and animal history — is true and complete. Material misstatement is grounds for termination of tenancy.</span> },
  { id: 'esign', text: <span><b>Electronic signature consent.</b> The undersigned consents to sign and transact electronically and agrees that signatures captured on this form are legally binding and enforceable under the federal E-SIGN Act and <b>Fla. Stat. ch. 668</b>.</span> },
];

function App() {
  const [prop, setProp] = useState({ address: '2801 65th Way N, Saint Petersburg, FL 33710', unit: '', notes: '' });
  const [org, setOrg] = useState({ company: 'freeFall Theatre', entity: '', ein: '', signer: '', title: '', email: '', phone: '(727) 498-5205', address: '6099 Central Avenue, St. Petersburg, FL 33710' });
  const [occs, setOccs] = useState([blankOccupant(), blankOccupant(), blankOccupant()]);
  const [hasPet, setHasPet] = useState('No');
  const [pets, setPets] = useState([]);
  const [car, setCar] = useState({ want: 'No', days: '', driver: '' });
  const [acks, setAcks] = useState({});
  const [orgSig, setOrgSig] = useState('');
  const [orgSigDate, setOrgSigDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState({});
  const [occErrors, setOccErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [summary, setSummary] = useState('');
  const [payUrl, setPayUrl] = useState('pay.html');
  const [clientEmailed, setClientEmailed] = useState(false);

  const petTotal = hasPet === 'Yes' ? pets.length * TERMS.petFee : 0;
  const carDays = car.want === 'Yes' ? (parseInt(car.days, 10) || 0) : 0;
  const carTotal = carDays * TERMS.carDay;
  const total = TERMS.rent + TERMS.cleaning + TERMS.deposit + petTotal + carTotal;

  const addOcc = () => setOccs(o => [...o, blankOccupant()]);
  const updOcc = (i, v) => setOccs(o => o.map((x, k) => (k === i ? v : x)));
  const rmOcc = i => setOccs(o => o.filter((_, k) => k !== i));

  const validate = () => {
    const e = {}; const oe = {};
    if (!prop.address.trim()) e.address = 'Required';
    if (!org.company.trim()) e.company = 'Required';
    if (!org.signer.trim()) e.signer = 'Required';
    if (!org.title.trim()) e.title = 'Required';
    if (!org.entity) e.entity = 'Required';
    if (!org.email.trim()) e.email = 'Required';
    if (!org.phone.trim()) e.phone = 'Required';
    if (!org.address.trim()) e.orgAddress = 'Required';
    occs.forEach(o => {
      const f = {};
      if (!o.name.trim()) f.name = 'Required';
      if (!o.dob) f.dob = 'Required';
      else if ((Date.now() - new Date(o.dob).getTime()) / 31557600000 < 18) f.dob = 'Occupant must be 18+';
      if (!o.email.trim()) f.email = 'Required';
      if (!o.phone.trim()) f.phone = 'Required';
      if (!o.address.trim()) f.address = 'Required';
      if (!o.moveIn) f.moveIn = 'Required';
      if (Object.keys(f).length) oe[o.id] = f;
    });
    if (hasPet === 'Yes') {
      if (!pets.length) e.pets = 'Add at least one animal or select “No”.';
      pets.forEach((p, i) => {
        if (!p.owner || !p.type || !p.breed || !p.weight || !p.vax || !p.bite || (p.bite === 'Yes' && !p.biteDetail.trim()))
          e.pets = 'Complete every field for each registered animal.';
      });
    }
    if (car.want === 'Yes') {
      if (!carDays) e.car = 'Enter the number of rental days.';
      if (!car.driver.trim()) e.car = 'Name the primary driver.';
    }
    const missingAck = ACKS.filter(a => !acks[a.id]).map(a => a.id);
    if (missingAck.length) e.acks = 'All acknowledgments must be initialed before signing.';
    if (!orgSig) e.orgSig = 'Authorized signature required.';
    setErrors(e); setOccErrors(oe);
    return { ok: !Object.keys(e).length && !Object.keys(oe).length, missingAck };
  };

  const submit = async () => {
    const { ok } = validate();
    if (!ok) {
      setStatus('invalid');
      const first = document.querySelector('.err, .sig-wrap.miss, .ack.miss');
      if (first) window.scrollTo({ top: first.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      return;
    }
    setStatus('sending');
    const lines = [
      `PROPERTY: ${prop.address}${prop.unit ? ' — ' + prop.unit : ''}`,
      `TERM: ${TERMS.startLabel} through ${TERMS.endLabel} (${TERMS.config})`,
      '',
      `LESSEE (CORPORATE): ${org.company} — ${org.entity}${org.ein ? ' — EIN ' + org.ein : ''}`,
      `AUTHORIZED SIGNER: ${org.signer}, ${org.title} — ${org.email} — ${org.phone}`,
      `BUSINESS ADDRESS: ${org.address}`,
      '',
      `OCCUPANTS (${occs.length}):`,
      ...occs.map((o, i) => `  ${i + 1}. ${o.name}${o.role ? ' (' + o.role + ')' : ''} — DOB ${o.dob} — ${o.email} — ${o.phone} — move-in ${o.moveIn} — from ${o.address}`),
      '',
      `ANIMALS: ${hasPet === 'Yes' ? pets.length : 'None declared'}`,
      ...(hasPet === 'Yes' ? pets.map((p, i) => `  ${i + 1}. ${p.type} / ${p.breed} / ${p.weight} lbs — owner ${p.owner} — vaccinations current: ${p.vax} — bite history: ${p.bite}${p.bite === 'Yes' ? ' — ' + p.biteDetail : ''}`) : []),
      '',
      `RENTAL CAR: ${car.want === 'Yes' ? `${carDays} day(s) @ $100/day — driver ${car.driver}` : 'Not requested'}`,
      '',
      'CHARGES:',
      `  Term rent (furnished, utilities included): ${usd(TERMS.rent)}`,
      `  One-time cleaning fee (non-refundable): ${usd(TERMS.cleaning)}`,
      `  Security deposit (refundable): ${usd(TERMS.deposit)}`,
      `  Pet fee (non-refundable): ${usd(petTotal)}`,
      `  Rental car: ${usd(carTotal)}`,
      `  CONTRACT TOTAL: ${usd(total)}`,
      `  SCHEDULE: 50% deposit ${usd(Math.round(total * 50) / 100)} at execution — balance ${usd(total - Math.round(total * 50) / 100)} due on or before ${BALANCE_DUE_LABEL}`,
      '',
      `ACKNOWLEDGMENTS: all ${ACKS.length} accepted (${ACKS.map(a => a.id).join(', ')})`,
      `EXECUTED: ${org.signer} on ${orgSigDate} — drawn signature captured on device.`,
      `TIMESTAMP: ${new Date().toISOString()}`,
    ].join('\n');
    setSummary(lines);
    const url = `pay.html?total=${total}&co=${encodeURIComponent(org.company)}`;
    setPayUrl(url);
    const fd = new FormData();
    fd.append('_subject', `Lease Registration — ${org.company || 'Corporate Lessee'} — ${occs.length} occupants`);
    fd.append('email', org.email);
    fd.append('Company', org.company);
    fd.append('Authorized signer', `${org.signer}, ${org.title}`);
    fd.append('Property', prop.address);
    fd.append('Occupants', String(occs.length));
    fd.append('Total due', usd(total));
    fd.append('Payment page to send', `${location.origin}${location.pathname.replace(/[^/]*$/, '')}${url}`);
    fd.append('Full registration', lines);
    if (prop.notes) fd.append('Notes', prop.notes);

    // Primary path: Netlify function — emails the owner AND the client (Resend).
    let sent = false;
    try {
      const res = await fetch(MAIL_FUNCTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org, prop, occupants: occs, pets: hasPet === 'Yes' ? pets : [], car,
          charges: {
            rent: TERMS.rent, cleaning: TERMS.cleaning, deposit: TERMS.deposit,
            petFee: petTotal, car: carTotal, total,
            term: `${TERMS.startLabel} – ${TERMS.endLabel}`, balanceDue: BALANCE_DUE_LABEL,
          },
          payUrl: url, summary: lines,
        }),
      });
      sent = res.ok;
      if (res.ok) { const j = await res.json().catch(() => ({})); setClientEmailed(j.clientSent !== false); }
    } catch (err) { sent = false; }

    // Fallback: Formspree, so a mail misconfiguration never loses a signed lease.
    if (!sent) {
      setClientEmailed(false);
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        sent = res.ok;
      } catch (err) { sent = false; }
    }
    setStatus(sent ? 'done' : 'error');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ackMiss = id => status === 'invalid' && !acks[id];

  if (status === 'done') {
    return (
      <React.Fragment>
        <Mast />
        <div className="lp-wrap">
          <div className="done">
            <h2>Registration Received</h2>
            <p>Thank you, {org.signer}. The signed lease registration for {org.company} has been transmitted to Ferrer Sunshine Estates.{clientEmailed ? <React.Fragment> A confirmation with your payment link is on its way to <b>{org.email}</b>.</React.Fragment> : <React.Fragment> A countersigned copy and invoice will follow at <b>{org.email}</b> within one business day.</React.Fragment>} The 50% deposit of <b>{usd(Math.round(total * 50) / 100)}</b> is due now; the balance of <b>{usd(total - Math.round(total * 50) / 100)}</b> is due on or before {BALANCE_DUE_LABEL}.</p>
            {PAYMENT_LINK ? (
              <div style={{ marginBottom: 26, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href={payUrl} style={{ textDecoration: 'none' }}>Continue to Payment — {usd(Math.round(total * 50) / 100)} due now</a>
                <button className="btn btn-outline" onClick={() => window.print()}>Print / Save a Copy</button>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => window.print()}>Print / Save a Copy</button>
            )}
          </div>
          <div className="sec" style={{ marginTop: 24 }}>
            <div className="sec-head"><span className="sec-num">RECORD</span><h2>Summary of Submission</h2></div>
            <pre style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--color-cream-700)', margin: 0 }}>{summary}</pre>
          </div>
        </div>
        <Foot />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Mast />
      <div className="lp-wrap">
        <div className="lp-intro">
          <p>This form registers a furnished residential occupancy with <b>Ferrer Sunshine Estates</b>. The company named below is the Lessee of record and is financially responsible for the full term; the individuals registered are Occupants under that lease.</p>
          <p>Every occupant must be listed. Use <b>Add Another Occupant</b> for each person who will reside at the property. Fields marked <span style={{ color: 'var(--color-pink-500)' }}>*</span> are required.</p>
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 01</span><h2>Property &amp; Term</h2></div>
          <div className="grid">
            <div className="span2">
              <Field label="Property address" required hint="Street, city, state, ZIP of the residence being leased." error={errors.address}>
                <input className={errors.address ? 'err' : ''} value={prop.address} onChange={e => setProp({ ...prop, address: e.target.value })} placeholder="2801 65th Way N, Saint Petersburg, FL 33710" />
              </Field>
            </div>
            <Field label="Unit / suite designation">
              <input value={prop.unit} onChange={e => setProp({ ...prop, unit: e.target.value })} placeholder="Main residence" />
            </Field>
            <Field label="Configuration">
              <input value={TERMS.config} readOnly style={{ background: 'var(--color-cream-100)' }} />
            </Field>
            <Field label="Lease begins">
              <input value={TERMS.startLabel} readOnly style={{ background: 'var(--color-cream-100)' }} />
            </Field>
            <Field label="Lease ends">
              <input value={TERMS.endLabel} readOnly style={{ background: 'var(--color-cream-100)' }} />
            </Field>
            <div className="span2">
              <Field label="Special requests or production notes" hint="Arrival times, parking needs, rehearsal schedule considerations.">
                <textarea value={prop.notes} onChange={e => setProp({ ...prop, notes: e.target.value })} />
              </Field>
            </div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 02</span><h2>Lessee of Record</h2></div>
          <p className="sec-note">The entity signing the lease and paying rent. This party is jointly and severally liable with its occupants for all obligations under the lease.</p>
          <div className="grid">
            <Field label="Legal company name" required error={errors.company}>
              <input className={errors.company ? 'err' : ''} value={org.company} onChange={e => setOrg({ ...org, company: e.target.value })} placeholder="e.g. freeFall Theatre" />
            </Field>
            <Field label="Entity type" required error={errors.entity}>
              <select className={errors.entity ? 'err' : ''} value={org.entity} onChange={e => setOrg({ ...org, entity: e.target.value })}>
                <option value="">Select…</option>
                {['Corporation', 'LLC', 'Non-profit / 501(c)(3)', 'Partnership', 'Sole proprietor', 'Other'].map(x => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="EIN / Tax ID" hint="Optional but expedites approval.">
              <input value={org.ein} onChange={e => setOrg({ ...org, ein: e.target.value })} placeholder="00-0000000" />
            </Field>
            <Field label="Authorized signer" required hint="Individual with authority to bind the entity." error={errors.signer}>
              <input className={errors.signer ? 'err' : ''} value={org.signer} onChange={e => setOrg({ ...org, signer: e.target.value })} />
            </Field>
            <Field label="Title" required error={errors.title}>
              <input className={errors.title ? 'err' : ''} value={org.title} onChange={e => setOrg({ ...org, title: e.target.value })} placeholder="Producing Director" />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" className={errors.email ? 'err' : ''} value={org.email} onChange={e => setOrg({ ...org, email: e.target.value })} />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input type="tel" className={errors.phone ? 'err' : ''} value={org.phone} onChange={e => setOrg({ ...org, phone: e.target.value })} />
            </Field>
            <div className="span2">
              <Field label="Business address" required error={errors.orgAddress}>
                <input className={errors.orgAddress ? 'err' : ''} value={org.address} onChange={e => setOrg({ ...org, address: e.target.value })} />
              </Field>
            </div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 03</span><h2>Registered Occupants</h2></div>
          <p className="sec-note">Every individual who will reside at the property, including those arriving mid-term. This residence is a {TERMS.config}; occupancy above {TERMS.maxOccupants} adults requires written approval from Owner.</p>
          {occs.map((o, i) => (
            <React.Fragment key={o.id}>
              <OccupantCard occ={o} index={i} onChange={v => updOcc(i, v)} onRemove={() => rmOcc(i)} canRemove={occs.length > 1} errors={occErrors} />
            </React.Fragment>
          ))}
          <button type="button" className="btn btn-add" onClick={addOcc}>+ Add Another Occupant</button>
          {occs.length > TERMS.maxOccupants && (
            <div className="errbox" style={{ marginTop: 16, background: 'var(--color-gold-100)', borderColor: 'var(--color-gold-500)', color: 'var(--color-cream-700)' }}>
              <b>Occupancy notice</b>{occs.length} occupants exceeds the {TERMS.maxOccupants}-person standard for this residence. Owner will review and confirm in writing before the lease is countersigned.
            </div>
          )}
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 04</span><h2>Animals</h2></div>
          <p className="sec-note">A non-refundable pet fee of {usd(TERMS.petFee)} applies per animal. Undisclosed animals are a material breach of the lease.</p>
          <Field label="Will any animal reside at the property?" required>
            <Toggle value={hasPet} onChange={v => { setHasPet(v); if (v === 'Yes' && !pets.length) setPets([blankPet()]); if (v === 'No') setPets([]); }} options={['No', 'Yes']} />
          </Field>
          {hasPet === 'Yes' && (
            <div style={{ marginTop: 24 }}>
              {pets.map((p, i) => (
                <React.Fragment key={p.id}>
                  <PetCard pet={p} index={i} occupants={occs} onChange={v => setPets(ps => ps.map((x, k) => (k === i ? v : x)))} onRemove={() => setPets(ps => ps.filter((_, k) => k !== i))} />
                </React.Fragment>
              ))}
              <button type="button" className="btn btn-add" onClick={() => setPets(ps => [...ps, blankPet()])}>+ Add Another Animal</button>
            </div>
          )}
          {errors.pets && <div className="errbox" style={{ marginTop: 16 }}><b>Incomplete</b>{errors.pets}</div>}
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 05</span><h2>Optional Add-Ons</h2></div>
          <p className="sec-note">Rental vehicle available at {usd(TERMS.carDay)} per day, subject to availability. Driver must hold a valid license and provide proof of insurance at pickup.</p>
          <Field label="Add a rental vehicle?" required>
            <Toggle value={car.want} onChange={v => setCar({ ...car, want: v, days: v === 'No' ? '' : car.days })} options={['No', 'Yes']} />
          </Field>
          {car.want === 'Yes' && (
            <div className="grid" style={{ marginTop: 22 }}>
              <Field label="Number of days" required hint={`${usd(TERMS.carDay)} per day`}>
                <input type="number" min="1" value={car.days} onChange={e => setCar({ ...car, days: e.target.value })} placeholder="14" />
              </Field>
              <Field label="Primary driver" required hint="Must be a registered occupant, 25 or older.">
                <input value={car.driver} onChange={e => setCar({ ...car, driver: e.target.value })} />
              </Field>
            </div>
          )}
          {errors.car && <div className="errbox" style={{ marginTop: 16 }}><b>Incomplete</b>{errors.car}</div>}
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 06</span><h2>Charges</h2></div>
          <div className="terms-box">
            <div className="tb-title">— {TERMS.startLabel} &nbsp;·&nbsp; {TERMS.endLabel} —</div>
            <div className="tline"><span className="tl-l">Term rent<small>Fully furnished · all utilities included</small></span><span className="tl-r">{usd(TERMS.rent)}</span></div>
            <div className="tline"><span className="tl-l">One-time cleaning fee<small>Non-refundable</small></span><span className="tl-r">{usd(TERMS.cleaning)}</span></div>
            <div className="tline"><span className="tl-l">Security deposit<small>Refundable per Fla. Stat. § 83.49</small></span><span className="tl-r">{usd(TERMS.deposit)}</span></div>
            <div className="tline"><span className="tl-l">Pet fee<small>{hasPet === 'Yes' && pets.length ? `${pets.length} animal(s) × ${usd(TERMS.petFee)} · non-refundable` : 'No animals declared'}</small></span><span className="tl-r">{usd(petTotal)}</span></div>
            <div className="tline"><span className="tl-l">Rental vehicle<small>{carDays ? `${carDays} day(s) × ${usd(TERMS.carDay)}` : 'Not requested'}</small></span><span className="tl-r">{usd(carTotal)}</span></div>
            <div className="ttotal"><span className="tt-l">Contract Total</span><span className="tt-r">{usd(total)}</span></div>
          </div>
          {(() => {
            const half = Math.round(total * 50) / 100;
            return (
              <div className="sched">
                <div className="sched-t">Payment Schedule</div>
                <div className="sline">
                  <span className="sl-l"><b>1 &nbsp;·&nbsp; Due at execution</b><small>50% deposit — reserves the dates</small></span>
                  <span className="sl-amt">
                    <span className="sl-r">{usd(half)}</span>
                    {PAYMENT_LINK ? <a className="btn btn-primary sl-btn" href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">Pay Deposit</a> : null}
                  </span>
                </div>
                <div className="sline">
                  <span className="sl-l"><b>2 &nbsp;·&nbsp; Final balance</b><small>Due on or before {BALANCE_DUE_LABEL} — first day of the term</small></span>
                  <span className="sl-amt">
                    <span className="sl-r">{usd(total - half)}</span>
                    {PAYMENT_LINK_BALANCE ? <a className="btn btn-outline sl-btn" href={PAYMENT_LINK_BALANCE} target="_blank" rel="noopener noreferrer">Pay Balance</a> : null}
                  </span>
                </div>
              </div>
            );
          })()}
          {PAYMENT_LINK ? (
            <div className="payrow">
              <div>
                <div className="pay-t">Payment</div>
                <p className="pay-p">Both invoices are issued through Chase and may be paid by card or bank transfer. The deposit secures the dates; the balance link becomes payable ahead of {BALANCE_DUE_LABEL}. An itemized invoice follows this submission by email.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 07</span><h2>Terms &amp; Acknowledgments</h2></div>
          <div className="legal">
            <h4>Parties &amp; Premises</h4>
            <p>This registration is entered into between Ferrer Sunshine Estates (“Owner”), the entity identified in Section 02 (“Lessee”), and the individuals identified in Section 03 (“Occupants”), for the furnished residence identified in Section 01, for the term of {TERMS.startLabel} through {TERMS.endLabel}.</p>
            <h4>Rent &amp; Fees</h4>
            <p>Lessee shall pay the total set out in Section 06 according to the payment schedule stated therein: fifty percent (50%) upon execution and the balance in full on or before {BALANCE_DUE_LABEL}, the first day of the term. The cleaning fee and any pet fee are non-refundable. The security deposit is refundable and administered under Fla. Stat. § 83.49. Utilities are included in the term rent for ordinary residential use. Reserved dates are released if the deposit is not received within five (5) business days of invoicing.</p>
            <h4>Use of the Premises</h4>
            <p>The residence is for private residential occupancy only. No commercial activity, public performance, rehearsal open to the public, filming, event, or re-rental of any kind is permitted without Owner's prior written consent. Occupants shall comply with all applicable municipal ordinances of the City of St. Petersburg and Pinellas County.</p>
            <h4>Liability &amp; Indemnity</h4>
            <p>Occupants and their guests use the premises and all amenities entirely at their own risk. Owner shall not be liable for personal injury, illness, death, or loss of or damage to personal property occurring on or about the premises, except where caused by Owner's gross negligence or willful misconduct. Lessee shall indemnify, defend, and hold Owner harmless from all claims arising out of the acts or omissions of Lessee, its Occupants, and their guests.</p>
            <h4>Animals</h4>
            <p>Only animals disclosed and approved on this registration may be kept at the residence. The registering occupant is strictly liable for all damage and injury caused by the animal. Owner may require removal of any animal that damages property, disturbs neighbors, or displays aggression.</p>
            <h4>Default &amp; Termination</h4>
            <p>Material misstatement on this registration, unregistered occupancy, undisclosed animals, or violation of the use restrictions above constitute default. Owner's remedies are governed by Fla. Stat. ch. 83, Part II (Residential Tenancies). Florida law governs; venue is Pinellas County, Florida.</p>
            <h4>Entire Agreement</h4>
            <p>This registration, once countersigned by Owner, together with any written lease executed by the parties, constitutes the entire agreement and supersedes all prior discussions. Amendments must be in writing and signed by both parties.</p>
          </div>
          {ACKS.map(a => (
            <label key={a.id} className={'ack' + (acks[a.id] ? ' on' : '') + (ackMiss(a.id) ? ' miss' : '')}>
              <input type="checkbox" checked={!!acks[a.id]} onChange={e => setAcks(s => ({ ...s, [a.id]: e.target.checked }))} />
              <span>{a.text}</span>
            </label>
          ))}
          {errors.acks && <div className="errbox" style={{ marginTop: 12 }}><b>Acknowledgment required</b>{errors.acks}</div>}
        </div>

        <div className="sec">
          <div className="sec-head"><span className="sec-num">SECTION 08</span><h2>Signature</h2></div>
          <p className="sec-note">Sign with a finger, stylus, or mouse. The authorized signer executes this registration on behalf of the Lessee entity and binds all registered occupants to the terms above.</p>
          <div className="card" style={{ borderLeftColor: 'var(--color-gold-500)' }}>
            <div className="card-top"><div className="card-title">Authorized signer — {org.company || 'Lessee entity'}</div></div>
            <SignaturePad value={orgSig} onChange={setOrgSig} missing={status === 'invalid' && !orgSig} caption={`${org.signer || 'Signature'}${org.title ? ', ' + org.title : ''}`} />
            <div className="grid" style={{ marginTop: 18 }}>
              <Field label="Date signed" required>
                <input type="date" value={orgSigDate} onChange={e => setOrgSigDate(e.target.value)} />
              </Field>
            </div>
          </div>
        </div>

        <div className="submit-row">
          {status === 'invalid' && <div className="errbox"><b>Please complete the highlighted items</b>Required fields, acknowledgments, and signatures must all be filled in before this registration can be submitted.</div>}
          {status === 'error' && <div className="errbox"><b>Submission failed</b>Something went wrong sending the form. Please try again, or email the details to <a href="mailto:Amanda@bpestatemgmt.com">Amanda@bpestatemgmt.com</a>.</div>}
          <button className="btn btn-primary" disabled={status === 'sending'} onClick={submit}>{status === 'sending' ? 'Submitting…' : 'Submit Signed Registration'}</button>
          <p style={{ fontSize: 12.5, color: 'var(--color-cream-600)', maxWidth: 520 }}>By submitting, the authorized signer certifies authority to bind {org.company || 'the Lessee'} and agrees to the terms in Section 07. Owner countersignature is required for the lease to take effect.</p>
        </div>
      </div>
      <Foot />
    </React.Fragment>
  );
}

function Mast() {
  return (
    <header className="lp-mast">
      <div className="lm-name">Ferrer</div>
      <div className="lm-sub">— Sunshine Estates —</div>
      <div className="lm-rule"></div>
      <h1>Lease Registration</h1>
      <div className="lm-meta">Corporate Occupancy · St. Petersburg, Florida</div>
    </header>
  );
}

function Foot() {
  return (
    <div className="foot">
      FERRER SUNSHINE ESTATES · ST. PETERSBURG, FL · <a href="mailto:Amanda@bpestatemgmt.com">Amanda@bpestatemgmt.com</a> · (727) 504-9949
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
