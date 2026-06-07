/* ============================================================
   FERRER SUNSHINE ESTATES — The Garden Suite (1BR/1BA)
   ============================================================ */

const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// Photo manifest
// ============================================================
const S = "";
const photos = {
  livingWide:    S + "01-living-wide.jpg",
  livingSofa:    S + "02-living-sofa.jpg",
  livingDoors:   S + "03-living-doors.jpg",
  kitchenLiving: S + "04-kitchen-living.jpg",
  kitchenSink:   S + "05-kitchen-sink.jpg",
  kitchenEntry:  S + "06-kitchen-entry.jpg",
  bedroomPalm:   S + "07-bedroom-palm.jpg",
  bedroomAngle:  S + "08-bedroom-angle.jpg",
  bedroomCloset: S + "09-bedroom-closet.jpg",
  bathVanity:    S + "10-bath-vanity.jpg",
  bathShower:    S + "11-bath-shower.jpg",
};

const HERO_SLIDES = [photos.bedroomPalm, photos.livingWide, photos.kitchenSink];

// ----- EDIT THESE TO MATCH YOUR ACTUAL RATES -----
const NIGHTLY_BASE = 100;   // nightly rate (USD, tax-inclusive)
const CLEANING     = 100;   // cleaning fee (USD)
const TAXES_PCT    = 0;     // taxes collected by Airbnb / at booking
// -------------------------------------------------

// External links (shared with main site)
const REVIEW_LINKS = {
  airbnb:    'https://www.airbnb.com/users/show/YOUR_AIRBNB_HOST_ID',
  google:    'https://www.google.com/search?q=Ferrer+Sunshine+Estates+St+Petersburg+reviews',
  vrbo:      'https://www.vrbo.com/YOUR_VRBO_LISTING',
  furnished: 'https://www.furnishedfinder.com/members/profile/YOUR_FF_ID',
};

// ============================================================
// Icon helper (Lucide)
// ============================================================
function Icon({ name, size = 20, stroke = 1.5, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': stroke } });
    }
  }, [name, size, stroke]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} />;
}

// ============================================================
// Nav
// ============================================================
function Nav({ onBookClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="logo" aria-label="Ferrer Sunshine Estates home">
          <span className="logo-mark">Ferrer</span>
          <span className="logo-sub">— Sunshine Estates —</span>
        </a>
        <div className="nav-links">
          <a href="index.html">The Residence</a>
          <a href="#suite">The Suite</a>
          <a href="#gallery">Gallery</a>
          <a href="#book">Availability</a>
          <a href="#location">St. Petersburg</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="nav-cta" onClick={onBookClick}>Book Direct</button>
        <button className="menu-btn" aria-label="Menu"><Icon name="menu" size={22} /></button>
      </div>
    </nav>
  );
}

// ============================================================
// Hero
// ============================================================
function Hero({ onBookClick }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="hero" id="top">
      {HERO_SLIDES.map((src, i) => (
        <div
          key={i}
          className={`hero-bg ${i === idx ? 'active' : 'inactive'}`}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="avail-pill"><span className="avail-dot" /> Now booking · Live availability</div>
        <div className="hero-eyebrow">A Private Guest Suite · St. Petersburg, Florida</div>
        <h1 className="hero-title">
          Your private St.&nbsp;Pete<br />retreat — <em>gate, garden,</em><br />and all.</h1>
        <p className="hero-sub">
          A self-contained one-bedroom suite with its own entrance and a fully fenced
          yard. Pet friendly. No minimum stay. Minutes from the beaches, shops, and downtown St.&nbsp;Pete.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={onBookClick}>
            <Icon name="key-round" size={16} stroke={2} /> See Open Dates
          </button>
          <a href="#suite" className="btn btn-outline">
            <Icon name="arrow-down" size={16} stroke={2} /> Take the Tour
          </a>
        </div>
      </div>

      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <div key={i} className={`hero-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Channel bar
// ============================================================
function ChannelBar() {
  return (
    <div className="channel-bar">
      <div className="container channel-inner">
        <div className="channel-label">Also listed on</div>
        <div className="channel-logos">
          <a className="ch" href={REVIEW_LINKS.airbnb} target="_blank" rel="noopener" style={{ textDecoration:'none' }}><span className="dot" /> Airbnb</a>
          <a className="ch" href={REVIEW_LINKS.vrbo} target="_blank" rel="noopener" style={{ textDecoration:'none' }}><span className="dot" /> Vrbo</a>
          <a className="ch" href={REVIEW_LINKS.furnished} target="_blank" rel="noopener" style={{ textDecoration:'none' }}><span className="dot" /> Furnished Finder</a>
          <a className="ch" href={REVIEW_LINKS.google} target="_blank" rel="noopener" style={{ textDecoration:'none' }}><span className="dot" /> Google</a>
        </div>
        <div className="channel-label" style={{ color: 'var(--color-green-800)' }}>Book direct & save</div>
      </div>
    </div>
  );
}

// ============================================================
// Stat row
// ============================================================
function StatRow() {
  return (
    <div className="container" style={{ marginTop: -1 }}>
      <div className="stat-row">
        <div className="stat"><div className="stat-num">1<em>/1</em></div><div className="stat-label">Bedroom / Bath</div></div>
        <div className="stat"><div className="stat-num">2</div><div className="stat-label">Guests, Comfortably</div></div>
        <div className="stat"><div className="stat-num">∞</div><div className="stat-label">No Minimum Stay</div></div>
        <div className="stat"><div className="stat-num">1</div><div className="stat-label">Private Entrance</div></div>
      </div>
    </div>
  );
}

// ============================================================
// Welcome split
// ============================================================
function Welcome() {
  return (
    <section className="section" id="suite">
      <div className="container">
        <div className="split">
          <div>
            <div className="eb left">— The Suite —</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.022em',
              margin: '0 0 28px',
              color: 'var(--color-green-900)'
            }}>
              Private, polished,<br /><em style={{ fontStyle: 'italic', color: 'var(--color-gold-600)' }}>and entirely yours.</em>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 20, fontWeight: 300 }}>
              A self-contained one-bedroom guest suite attached to a private home — but with
              its own separate entrance and a fully fenced backyard to call your own. Quiet,
              sun-filled, and freshly finished, with a queen bedroom, a full bath with a
              walk-in glass shower, and an open living-kitchen made for easy, unhurried stays.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 36, fontWeight: 300 }}>
              Bring the dog — the suite is pet friendly and the yard is fully fenced. Stay a
              single night or settle in for a season; there's no minimum. Under five minutes
              to shopping and dining, fifteen to the Gulf beaches, twenty to downtown St. Pete.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#book" className="btn btn-primary"><Icon name="key-round" size={16} stroke={2} /> Check Dates</a>
              <a href="#amenities" className="btn btn-outline-dark"><Icon name="sparkles" size={16} stroke={2} /> The Details</a>
            </div>
          </div>
          <div>
            <div className="editorial-img">
              <img src={photos.livingSofa} alt="Sunlit living room with private entrance" />
              <div className="caption">The Living Room · Private Entrance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Amenities
// ============================================================
const AMENITIES = [
  { icon: 'door-open', name: 'Private Entrance', desc: 'Your own separate door — no shared hallways, total independence.' },
  { icon: 'trees', name: 'Fully Fenced Backyard', desc: 'A private, fully fenced yard that belongs to the suite alone.' },
  { icon: 'dog', name: 'Pet Friendly', desc: 'Bring the dog. The fenced yard makes it easy and worry-free.' },
  { icon: 'calendar-check', name: 'No Minimum Stay', desc: 'Book one night or settle in for a season — your call.' },
  { icon: 'chef-hat', name: 'Full Kitchenette', desc: 'Fridge, cooktop, microwave, toaster oven, coffee maker & cookware.' },
  { icon: 'shower-head', name: 'Walk-In Glass Shower', desc: 'Fresh marble-tile bath with a frameless glass walk-in shower.' },
  { icon: 'tv', name: 'Smart TVs', desc: 'Wall-mounted smart TVs in the living room and bedroom.' },
  { icon: 'wind', name: 'Mini-Split A/C', desc: 'Quiet, efficient climate control plus modern ceiling fans.' },
  { icon: 'wifi', name: 'High-Speed Wi-Fi', desc: 'Reliable connection throughout — ideal for remote work.' },
  { icon: 'shield-check', name: 'Keyless Smart Lock', desc: 'Self check-in, 24/7, with a private keypad entry code.' },
  { icon: 'shopping-bag', name: 'Steps to Shopping', desc: 'Grocery, coffee, and dining under five minutes from the door.' },
  { icon: 'bed-double', name: 'Queen Bedroom', desc: 'A restful, private bedroom with a closet and garden-side window.' },
];

function Amenities() {
  return (
    <section className="section cream" id="amenities">
      <div className="container">
        <div className="sec-head">
          <div className="eb left">— Considered details —</div>
          <h2>Small footprint,<br /><em>every comfort.</em></h2>
          <p className="lede">Compact, private, and complete — the suite was finished with longer stays in mind, so the first morning feels as settled as the tenth.</p>
        </div>
        <div className="am-grid">
          {AMENITIES.map((a, i) => (
            <div className="am" key={i}>
              <div className="am-icon"><Icon name={a.icon} size={36} stroke={1.3} /></div>
              <h4>{a.name}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Gallery + Lightbox
// ============================================================
const GALLERY = [
  { src: photos.bedroomPalm,   tag: 'Queen Bedroom',          cls: 'g-1' },
  { src: photos.livingWide,    tag: 'Living & Kitchen',       cls: 'g-2' },
  { src: photos.bathVanity,    tag: 'Full Bath',              cls: 'g-3' },
  { src: photos.kitchenSink,   tag: 'Kitchenette',            cls: 'g-4' },
  { src: photos.livingSofa,    tag: 'Living Room',            cls: 'g-5' },
  { src: photos.bathShower,    tag: 'Walk-In Glass Shower',   cls: 'g-6' },
  { src: photos.kitchenEntry,  tag: 'Private Entrance',       cls: 'g-7' },
  { src: photos.bedroomCloset, tag: 'Bedroom & Closet',       cls: 'g-3' },
  { src: photos.bedroomAngle,  tag: 'Bedroom · Garden View',  cls: 'g-4' },
];

function Gallery({ onOpen }) {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="sec-head">
          <div className="eb left">— Tour the suite —</div>
          <h2>A private corner<br /><em>of the Sunshine City.</em></h2>
        </div>
        <div className="gallery">
          {GALLERY.map((g, i) => (
            <div className={`g ${g.cls}`} key={i} onClick={() => onOpen(i)}>
              <img src={g.src} alt={g.tag} loading="lazy" />
              <span className="tag">{g.tag}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <button className="btn btn-outline-dark" onClick={() => onOpen(0)}>
            <Icon name="images" size={16} stroke={2} /> View All Photos
          </button>
        </div>
      </div>
    </section>
  );
}

function Lightbox({ images, idx, onClose, onNav }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose, onNav]);
  return (
    <div className="lbx" onClick={onClose}>
      <button className="lbx-close" aria-label="Close"><Icon name="x" size={18} /></button>
      <button className="lbx-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onNav(-1); }}><Icon name="chevron-left" size={22} /></button>
      <img src={images[idx].src} alt={images[idx].tag} onClick={(e) => e.stopPropagation()} />
      <button className="lbx-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onNav(1); }}><Icon name="chevron-right" size={22} /></button>
      <div className="lbx-count">{String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} &nbsp;·&nbsp; {images[idx].tag}</div>
    </div>
  );
}

// ============================================================
// Booking Calendar
// ============================================================
// ============================================================
// Live Airbnb calendar sync (iCal)
// ============================================================
const LISTING_KEY = 'suite';
const ICAL_URL = 'https://www.airbnb.com/calendar/ical/1701614279495081800.ics?t=026d236e2b6a4f5f98bded722a045677';

function dKey(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

function parseICS(text) {
  const blocked = new Set();
  const events = text.split('BEGIN:VEVENT').slice(1);
  for (const ev of events) {
    const ds = ev.match(/DTSTART[^:\n]*:(\d{8})/);
    const de = ev.match(/DTEND[^:\n]*:(\d{8})/);
    if (!ds) continue;
    const s = ds[1], e = de ? de[1] : ds[1];
    const start = new Date(+s.slice(0,4), +s.slice(4,6) - 1, +s.slice(6,8));
    const end = new Date(+e.slice(0,4), +e.slice(4,6) - 1, +e.slice(6,8));
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) blocked.add(dKey(d));
  }
  return blocked;
}

async function fetchICS() {
  const attempts = [
    `/.netlify/functions/ical?listing=${LISTING_KEY}`,                     // production: server-side, reliable
    `https://corsproxy.io/?url=${encodeURIComponent(ICAL_URL)}`,           // preview/dev fallback
    `https://api.allorigins.win/raw?url=${encodeURIComponent(ICAL_URL)}`,  // secondary fallback
  ];
  for (const u of attempts) {
    try {
      const r = await fetch(u);
      if (r.ok) {
        const t = await r.text();
        if (t.includes('BEGIN:VCALENDAR')) return t;
      }
    } catch (e) { /* try next */ }
  }
  throw new Error('ical fetch failed');
}

function fmtDate(d) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000);
}

function Booking() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [hover, setHover] = useState(null);
  const [guests, setGuests] = useState(2);
  const [blockedSet, setBlockedSet] = useState(null);     // null = not yet loaded
  const [syncState, setSyncState] = useState('loading');  // loading | live | error

  useEffect(() => {
    let cancelled = false;
    fetchICS()
      .then(text => { if (!cancelled) { setBlockedSet(parseICS(text)); setSyncState('live'); } })
      .catch(() => { if (!cancelled) { setBlockedSet(new Set()); setSyncState('error'); } });
    return () => { cancelled = true; };
  }, []);

  const isDayBlocked = (date) => !!(blockedSet && blockedSet.has(dKey(date)));
  const hasBookings = !!(blockedSet && blockedSet.size > 0);

  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const monthName = new Date(view.y, view.m, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ empty: true, key: 'e' + i });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(view.y, view.m, d);
    cells.push({ d, date, key: d });
  }

  function clickDay(date, isBlocked) {
    if (isBlocked || date < today) return;
    if (!start || (start && end)) {
      setStart(date); setEnd(null);
    } else if (date > start) {
      const tmp = new Date(start);
      let hasBlock = false;
      while (tmp < date) {
        tmp.setDate(tmp.getDate() + 1);
        if (tmp < date && isDayBlocked(tmp)) hasBlock = true;
      }
      if (hasBlock) { setStart(date); setEnd(null); }
      else setEnd(date);
    } else {
      setStart(date); setEnd(null);
    }
  }

  function dayClass(date, isBlocked) {
    if (isBlocked) return 'blocked';
    if (date < today) return 'disabled';
    const inRange = start && end && date > start && date < end;
    const isStart = start && date.getTime() === start.getTime();
    const isEnd = end && date.getTime() === end.getTime();
    const isHoverRange = start && !end && hover && date > start && date <= hover;
    let cls = '';
    if (isStart || isEnd) cls += ' selected';
    if (inRange || isHoverRange) cls += ' inrange';
    return cls.trim();
  }

  const canPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());

  const nights = nightsBetween(start, end);
  const subtotal = nights * NIGHTLY_BASE;
  const stayDiscount = nights >= 28 ? subtotal * 0.18 : nights >= 7 ? subtotal * 0.08 : 0;
  const cleaning = nights > 0 ? CLEANING : 0;
  const total = subtotal - stayDiscount + cleaning;

  return (
    <section className="section cream" id="book">
      <div className="container">
        <div className="sec-head centered">
          <div className="eb">— Live availability —</div>
          <h2>{syncState === 'live' && !hasBookings ? <>The calendar&rsquo;s <em>wide open.</em></> : <>Check dates. <em>Get a price.</em></>}</h2>
          <p className="lede">Our calendar is updated in real time — the open dates you see are the real ones.
            Choose your nights for an instant, transparent quote. Book direct for our best rate.</p>
        </div>

        <div className="avail-banner">
          {syncState === 'loading' && <><span className="avail-dot" /><span>Syncing the latest availability…</span></>}
          {syncState === 'live' && !hasBookings && <><span className="avail-dot" /><span><strong>Every date is available right now.</strong> The Suite is brand-new to direct booking — be among the first to stay. Open calendars like this don&rsquo;t last long.</span></>}
          {syncState === 'live' && hasBookings && <><span className="avail-dot" /><span><strong>Live availability.</strong> The open dates below are real and up to the minute — book direct and enjoy our best rate.</span></>}
          {syncState === 'error' && <><span className="avail-dot" style={{ background: '#B07A3C' }} /><span>Live sync is briefly unavailable — pick your dates and we&rsquo;ll confirm exact availability when you inquire.</span></>}
        </div>

        <div className="book-wrap">
          <div className="book-cal">
            <div className="cal-header">
              <div className="cal-month">{monthName}</div>
              <div className="cal-nav">
                <button disabled={!canPrev} onClick={() => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })} aria-label="Previous month">
                  <Icon name="chevron-left" size={18} />
                </button>
                <button onClick={() => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })} aria-label="Next month">
                  <Icon name="chevron-right" size={18} />
                </button>
              </div>
            </div>
            <div className="cal-grid">
              {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
              {cells.map(c => {
                if (c.empty) return <div key={c.key} />;
                const isBlocked = isDayBlocked(c.date);
                return (
                  <button
                    key={c.key}
                    className={'cal-day ' + dayClass(c.date, isBlocked)}
                    onClick={() => clickDay(c.date, isBlocked)}
                    onMouseEnter={() => setHover(c.date)}
                    onMouseLeave={() => setHover(null)}
                    disabled={isBlocked || c.date < today}
                    aria-label={c.date.toDateString()}
                  >
                    {c.d}
                  </button>
                );
              })}
            </div>
            <div className="cal-legend">
              <div className="lg"><span className="lg-sw avail" /> Available</div>
              <div className="lg"><span className="lg-sw sel" /> Selected</div>
              <div className="lg"><span className="lg-sw blk" /> Booked (synced)</div>
            </div>
          </div>

          <div className="book-side">
            <h3>Estimated from</h3>
            <div className="price-now">${NIGHTLY_BASE}<em>/night</em></div>
            <div className="price-note">Final rate confirmed by Amanda</div>
            {syncState === 'loading' && <div className="avail-chip" style={{ color: '#C9A96E' }}>Syncing availability…</div>}
            {syncState === 'live' && !hasBookings && <div className="avail-chip"><span className="avail-dot" /> All dates currently available</div>}
            {syncState === 'live' && hasBookings && <div className="avail-chip"><span className="avail-dot" /> Live availability</div>}

            <div className="book-fields">
              <div className="book-field">
                <label>Check-in</label>
                <div className={'val ' + (!start ? 'empty' : '')}>{start ? fmtDate(start) : 'Select date'}</div>
              </div>
              <div className="book-field">
                <label>Check-out</label>
                <div className={'val ' + (!end ? 'empty' : '')}>{end ? fmtDate(end) : 'Select date'}</div>
              </div>
              <div className="book-field">
                <label>Guests</label>
                <div className="val" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(250,247,240,0.3)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>−</button>
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                  <button onClick={() => setGuests(g => Math.min(2, g + 1))} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(250,247,240,0.3)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="book-breakdown">
                <div className="book-line"><span>${NIGHTLY_BASE} × {nights} nights</span><span className="v">${subtotal.toFixed(0)}</span></div>
                {stayDiscount > 0 && (
                  <div className="book-line"><span>{nights >= 28 ? 'Monthly' : 'Weekly'} stay discount</span><span className="v" style={{ color: 'var(--color-gold-400)' }}>−${stayDiscount.toFixed(0)}</span></div>
                )}
                <div className="book-line"><span>Cleaning fee</span><span className="v">${CLEANING}</span></div>
                <div className="book-line tot"><span>Total</span><span className="v">${total.toFixed(0)}</span></div>
              </div>
            )}

            <button className="book-cta" disabled={!start || !end}>
              {start && end ? <>Request to Book <Icon name="arrow-right" size={16} stroke={2} /></> : 'Select Dates Above'}
            </button>

            <div className="book-trust">
              <strong>Best price, direct.</strong> No added booking fees when you book
              with us directly. No minimum stay. Free cancellation up to 14 days before arrival.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Pull quote
// ============================================================
function PullQuote() {
  return (
    <section className="pull-quote">
      <div className="container">
        <blockquote>
          &ldquo;Your own door, your own garden, your own quiet.<br />
          <em>Boutique comfort — without the minimum stay.</em>&rdquo;
        </blockquote>
      </div>
    </section>
  );
}

// ============================================================
// Location
// ============================================================
const LOCATIONS = [
  { name: 'Shopping & Dining', meta: 'Under 5 min', desc: 'Grocery, coffee, restaurants, and everyday errands minutes from the door.' },
  { name: 'Gulf Beaches', meta: '≈ 15 min drive', desc: 'Sugar-sand Gulf beaches and sunset swims, a short drive west.' },
  { name: 'Downtown St. Pete', meta: '≈ 20 min', desc: 'Galleries, the Pier, Beach Drive dining, and the EDGE district.' },
  { name: 'The Dalí Museum', meta: '≈ 20 min', desc: 'The largest collection of Dalí works outside Spain.' },
  { name: 'Tampa Intl. Airport', meta: '≈ 30 min', desc: 'TPA — direct flights to most US hubs and Europe.' },
  { name: 'Fort De Soto Park', meta: '≈ 25 min', desc: 'Ranked among America\u2019s best beaches. Kayak the inland waterway.' },
];

function Location() {
  return (
    <section className="section dark" id="location">
      <div className="container">
        <div className="sec-head">
          <div className="eb left" style={{ color: 'var(--color-gold-400)' }}>— The Neighborhood —</div>
          <h2 style={{ color: 'var(--color-cream-50)' }}>Close to all of it.<br /><em style={{ color: 'var(--color-gold-400)' }}>Steps from the everyday.</em></h2>
          <p className="lede" style={{ color: 'rgba(250,247,240,0.72)' }}>Shopping and dining within walking distance, the Gulf beaches a quick drive west,
            and downtown St. Pete just beyond. Errands in five minutes, sand in fifteen.</p>
        </div>

        <div className="loc-grid">
          <div className="loc-list">
            {LOCATIONS.map((l, i) => (
              <div className="loc-item" key={i}>
                <div className="loc-name">{l.name}</div>
                <div className="loc-meta">{l.meta}</div>
                <div className="loc-desc">{l.desc}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="map-wrap">
              <svg className="map-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(250,247,240,0.04)" strokeWidth="1"/>
                  </pattern>
                  <radialGradient id="glow">
                    <stop offset="0%" stopColor="var(--color-gold-400)" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="var(--color-gold-400)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="800" height="450" fill="var(--color-green-900)" />
                <rect width="800" height="450" fill="url(#grid)" />

                <path d="M 540 0 Q 580 100 540 180 Q 500 240 560 320 Q 600 400 540 450 L 800 450 L 800 0 Z" fill="rgba(122,154,138,0.15)" stroke="rgba(122,154,138,0.4)" strokeWidth="1"/>
                <text x="660" y="240" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="rgba(201,169,110,0.5)">Tampa Bay</text>

                <path d="M 0 0 Q 30 100 0 200 L 0 450 L 0 0 Z" fill="rgba(122,154,138,0.18)"/>
                <text x="20" y="80" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="rgba(201,169,110,0.5)">Gulf of Mexico</text>

                <path d="M 0 220 L 540 220" stroke="rgba(201,169,110,0.25)" strokeWidth="1.5" fill="none"/>
                <path d="M 220 0 L 220 450" stroke="rgba(201,169,110,0.25)" strokeWidth="1.5" fill="none"/>
                <path d="M 380 0 L 380 450" stroke="rgba(201,169,110,0.15)" strokeWidth="1" fill="none"/>
                <path d="M 0 320 L 540 320" stroke="rgba(201,169,110,0.15)" strokeWidth="1" fill="none"/>

                <circle cx="220" cy="220" r="60" fill="url(#glow)" />
                <circle cx="220" cy="220" r="9" fill="var(--color-gold-500)" />
                <circle cx="220" cy="220" r="14" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5" opacity="0.5"/>
                <text x="220" y="200" textAnchor="middle" fontFamily="Cormorant SC" fontSize="11" letterSpacing="2" fill="var(--color-gold-400)">— THE SUITE —</text>

                <circle cx="80" cy="200" r="4" fill="var(--color-cream-50)" opacity="0.7"/>
                <text x="80" y="190" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.6)" letterSpacing="1">BEACHES</text>

                <circle cx="430" cy="280" r="4" fill="var(--color-cream-50)" opacity="0.7"/>
                <text x="430" y="300" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.6)" letterSpacing="1">DOWNTOWN</text>

                <circle cx="280" cy="180" r="4" fill="var(--color-cream-50)" opacity="0.7"/>
                <text x="280" y="168" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.6)" letterSpacing="1">SHOPPING</text>

                <circle cx="640" cy="80" r="4" fill="var(--color-cream-50)" opacity="0.5"/>
                <text x="640" y="70" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.5)" letterSpacing="1">TPA AIRPORT</text>

                <text x="40" y="430" fontFamily="Cormorant SC" fontSize="10" fill="rgba(250,247,240,0.35)" letterSpacing="2">ST. PETERSBURG, FLORIDA</text>
              </svg>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-sc)', fontSize: 11, letterSpacing: 'var(--ls-wider)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>
                A Private Guest Suite · St. Petersburg, FL
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=St+Petersburg+FL" target="_blank" rel="noopener" className="btn btn-outline" style={{ padding: '10px 18px' }}>
                <Icon name="map-pin" size={14} stroke={2} /> Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Other property cross-link
// ============================================================
function OtherProperty() {
  return (
    <section className="section">
      <div className="container">
        <div className="split reverse">
          <div>
            <div className="eb left">— Also from Ferrer Sunshine Estates —</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.022em', margin: '0 0 24px', color: 'var(--color-green-900)' }}>
              Need a little more room?<br /><em style={{ fontStyle: 'italic', color: 'var(--color-gold-600)' }}>Meet the Residence.</em>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 28, fontWeight: 300 }}>
              Our fully-renovated two-bedroom, two-bath coastal bungalow — with a private pool,
              fire pit, and screened lanai — sleeps four in comfort just minutes away. Same honest,
              direct booking. Same real Florida hospitality.
            </p>
            <a href="index.html" className="btn btn-primary"><Icon name="home" size={16} stroke={2} /> Explore the Residence</a>
          </div>
          <div>
            <a href="index.html" style={{ display: 'block' }}>
              <div className="editorial-img">
                <img src="14-Exteriors (12).jpg" alt="The Residence — pool & bungalow" />
                <div className="caption">The Residence · 2 BR · Private Pool</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Contact
// ============================================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdqdeyl';

function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const sent = status === 'sent';
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setStatus('sent'); form.reset(); } else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  }
  return (
    <section className="section dark" id="contact">
      <div className="container">
        <div className="split">
          <div>
            <div className="eb left" style={{ color: 'var(--color-gold-400)' }}>— Start a conversation —</div>
            <h2 style={{ color: 'var(--color-cream-50)', fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 400, lineHeight: 1.04, letterSpacing: '-0.022em', margin: '0 0 28px' }}>
              We can&rsquo;t wait<br /><em style={{ fontStyle: 'italic', color: 'var(--color-gold-400)' }}>to host you.</em>
            </h2>
            <p style={{ color: 'rgba(250,247,240,0.72)', fontSize: 17, lineHeight: 1.7, fontWeight: 300, marginBottom: 36 }}>
              Tell us a little about your visit — dates, the kind of trip, whether the dog is
              coming along. Amanda personally replies to every inquiry, usually within an hour
              during business hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <a href="tel:7275049949" style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--color-cream-50)', textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--color-gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-400)' }}>
                  <Icon name="phone" size={18} stroke={1.6} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-widest)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>Call or Text</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>(727) 504-9949</div>
                </div>
              </a>
              <a href="mailto:Amanda@bpestatemgmt.com" style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--color-cream-50)', textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--color-gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-400)' }}>
                  <Icon name="mail" size={18} stroke={1.6} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-widest)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>Email</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Amanda@bpestatemgmt.com</div>
                </div>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--color-cream-50)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--color-gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-400)' }}>
                  <Icon name="dog" size={18} stroke={1.6} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-widest)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>Good to know</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Pet friendly · No minimum stay</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid" style={{ background: 'rgba(250,247,240,0.03)', padding: 40, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(250,247,240,0.08)' }}>
            {sent ? (
              <div className="full" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-gold-500)', color: 'var(--color-green-900)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Icon name="check" size={28} stroke={2} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-cream-50)', marginBottom: 12 }}>Thank you.</div>
                <p style={{ color: 'rgba(250,247,240,0.7)', maxWidth: 360, margin: '0 auto' }}>Your inquiry is in. Amanda will be in touch shortly, usually within the hour.</p>
              </div>
            ) : (
              <>
                <input type="hidden" name="_subject" value="New inquiry — The Suite" />
                <input type="hidden" name="Property" value="The Suite · 1BR guest suite" />
                <div className="field"><label>First name</label><input type="text" name="First name" required placeholder="Jane" /></div>
                <div className="field"><label>Last name</label><input type="text" name="Last name" required placeholder="Doe" /></div>
                <div className="field"><label>Email</label><input type="email" name="email" required placeholder="you@email.com" /></div>
                <div className="field"><label>Phone</label><input type="tel" name="Phone" placeholder="(555) 123-4567" /></div>
                <div className="field"><label>Check-in</label><input type="date" name="Check-in" /></div>
                <div className="field"><label>Check-out</label><input type="date" name="Check-out" /></div>
                <div className="field full">
                  <label>Tell us about your stay</label>
                  <textarea name="message" placeholder="Number of guests, traveling with a pet, occasion, any questions..." />
                </div>
                <div className="full">
                  <button type="submit" disabled={status === 'sending'} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '18px', opacity: status === 'sending' ? 0.7 : 1 }}>
                    {status === 'sending' ? 'Sending…' : <>Send Inquiry <Icon name="arrow-right" size={16} stroke={2} /></>}
                  </button>
                  {status === 'error' && (
                    <p style={{ marginTop: 14, color: '#E8B4A0', fontSize: 13, textAlign: 'center' }}>
                      Something went wrong. Please email <a href="mailto:Amanda@bpestatemgmt.com" style={{ color: 'var(--color-gold-400)' }}>Amanda@bpestatemgmt.com</a> directly.
                    </p>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-mark" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, letterSpacing: '0.03em', display: 'block', color: 'var(--color-cream-50)', opacity: 0.85 }}>Ferrer</div>
            <div className="logo-sub" style={{ fontFamily: 'var(--font-sc)', fontSize: 20, fontWeight: 600, letterSpacing: '0.18em', color: 'var(--color-gold-400)', marginTop: 6 }}>— Sunshine Estates —</div>
            <p>Boutique short-term & monthly vacation rentals in St. Petersburg, Florida. Locally managed by the Baez-Perez family. Direct booking. Honest pricing. Real Florida hospitality.</p>
          </div>
          <div className="foot-col">
            <h5>Our Properties</h5>
            <a href="index.html">The Residence · 2 BR</a>
            <a href="the-suite.html">The Suite · 1 BR</a>
          </div>
          <div className="foot-col">
            <h5>The Suite</h5>
            <a href="#suite">Overview</a>
            <a href="#gallery">Gallery</a>
            <a href="#amenities">Amenities</a>
            <a href="#book">Check Availability</a>
            <a href="#location">The Neighborhood</a>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a href="tel:7275049949">(727) 504-9949</a>
            <a href="mailto:Amanda@bpestatemgmt.com">Amanda@bpestatemgmt.com</a>
            <p>St. Petersburg, Florida</p>
          </div>
        </div>

        <div className="foot-bottom">
          <div>© 2026 Ferrer Sunshine Estates · Operated by Baez Perez Estate Management LLC</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
            <a href="#">House Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Marketing styles (scoped)
// ============================================================
function MarketingStyles() {
  return (
    <style>{`
      .avail-pill {
        display:inline-flex; align-items:center; gap:10px; align-self:flex-start;
        white-space:nowrap;
        font-family:var(--font-sc); font-size:12px; letter-spacing:var(--ls-wider);
        text-transform:uppercase; color:var(--color-cream-50);
        background:rgba(18,38,28,0.42); border:1px solid rgba(201,169,110,0.55);
        padding:9px 16px 8px; border-radius:var(--radius-full);
        margin-bottom:24px; backdrop-filter:blur(6px);
      }
      .avail-dot {
        width:8px; height:8px; border-radius:50%; background:#5FC98A; flex:none;
        box-shadow:0 0 0 0 rgba(95,201,138,0.7); animation:availPulse 2.2s infinite;
      }
      @keyframes availPulse {
        0%{ box-shadow:0 0 0 0 rgba(95,201,138,0.6); }
        70%{ box-shadow:0 0 0 9px rgba(95,201,138,0); }
        100%{ box-shadow:0 0 0 0 rgba(95,201,138,0); }
      }
      .avail-banner {
        display:flex; align-items:center; gap:14px;
        max-width:780px; margin:0 auto 52px; padding:16px 24px;
        background:#fff; border:1px solid var(--color-cream-200);
        border-left:3px solid #2E9E5B; border-radius:var(--radius-md);
        box-shadow:var(--shadow-sm);
        font-family:var(--font-sans); font-size:15px; line-height:1.55;
        color:var(--color-cream-700); font-weight:300;
      }
      .avail-banner strong { color:var(--color-green-900); font-weight:500; }
      .avail-chip {
        display:inline-flex; align-items:center; gap:8px; margin-top:16px;
        font-family:var(--font-sc); font-size:11px; letter-spacing:var(--ls-wider);
        text-transform:uppercase; color:#9FE3BC;
      }
      .gtee-row {
        display:grid; grid-template-columns:repeat(4,1fr); gap:28px;
        padding:40px 44px; background:var(--color-cream-100);
        border:1px solid var(--color-cream-200); border-radius:var(--radius-md);
      }
      @media (max-width:860px){ .gtee-row { grid-template-columns:repeat(2,1fr); gap:34px 20px; padding:34px 28px; } }
      @media (max-width:460px){ .gtee-row { grid-template-columns:1fr; } }
      .gtee { text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px; }
      .gtee-ic {
        width:54px; height:54px; border-radius:50%; background:#fff;
        border:1px solid var(--color-gold-400); color:var(--color-green-800);
        display:flex; align-items:center; justify-content:center;
      }
      .gtee h4 {
        font-family:var(--font-display); font-size:21px; font-weight:600;
        color:var(--color-green-900); margin:0; letter-spacing:-0.01em;
      }
      .gtee p {
        font-family:var(--font-sans); font-size:13.5px; line-height:1.55;
        color:var(--color-cream-700); margin:0; font-weight:300; max-width:210px;
      }
    `}</style>
  );
}

const GUARANTEES = [
  { icon:'badge-dollar-sign', t:'Best Price, Direct',   d:'Book here and skip every added booking fee.' },
  { icon:'calendar-check',    t:'No Minimum Stay',      d:'One night or one season — entirely your call.' },
  { icon:'shield-check',      t:'Free Cancellation',    d:'Cancel at no cost up to 14 days before arrival.' },
  { icon:'message-circle',    t:'Replies in ~1 Hour',   d:'A real local host, usually answering within the hour.' },
];

function Guarantees() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="gtee-row">
          {GUARANTEES.map((g, i) => (
            <div className="gtee" key={i}>
              <div className="gtee-ic"><Icon name={g.icon} size={26} stroke={1.5} /></div>
              <h4>{g.t}</h4>
              <p>{g.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// App
// ============================================================
function App() {
  const [lbx, setLbx] = useState(null);
  const onBookClick = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <MarketingStyles />
      <Nav onBookClick={onBookClick} />
      <Hero onBookClick={onBookClick} />
      <StatRow />
      <Welcome />
      <Amenities />
      <Gallery onOpen={(i) => setLbx(i)} />
      <PullQuote />
      <Guarantees />
      <Booking />
      <Location />
      <OtherProperty />
      <Contact />
      <Footer />

      {lbx !== null && (
        <Lightbox
          images={GALLERY}
          idx={lbx}
          onClose={() => setLbx(null)}
          onNav={(d) => setLbx(i => (i + d + GALLERY.length) % GALLERY.length)}
        />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
