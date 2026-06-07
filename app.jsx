/* ============================================================
   FERRER SUNSHINE ESTATES — App
   ============================================================ */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ============================================================
// Photo manifest
// ============================================================
const P = "uploads/5343-6th-ave-n-st-petersburg-fl-33710/";
const photos = {
  heroDusk:    P + "1-1000023735.jpg",
  heroPatio:   P + "2-1000023736.jpg",
  extDay:      P + "5-Exteriors (3).jpg",
  porch:       P + "4-Exteriors (2).jpg",
  extWide:     P + "6-Exteriors (4).jpg",
  extSide:     P + "8-Exteriors (6).jpg",
  extFront:    P + "11-Exteriors (9).jpg",
  backWide:    P + "13-Exteriors (11).jpg",
  pool:        P + "14-Exteriors (12).jpg",
  poolPath:    P + "15-Exteriors (13).jpg",
  patio:       P + "16-Exteriors (14).jpg",
  patio2:      P + "17-Exteriors (15).jpg",
  masterBR:    P + "18-Interiors (1).jpg",
  bedroom2:    P + "19-Interiors (2).jpg",
  bedroom3:    P + "20-Interiors (3).jpg",
  bathMarble:  P + "21-Interiors (4).jpg",
  bathShower:  P + "22-Interiors (5).jpg",
  bathDouble:  P + "23-Interiors (6).jpg",
  closet:      P + "24-Interiors (7).jpg",
  bedroom4:    P + "25-Interiors (8).jpg",
  bedroom5:    P + "26-Interiors (9).jpg",
  bathSimple:  P + "27-Interiors (10).jpg",
  bathTub:     P + "28-Interiors (11).jpg",
  livingMain:  P + "29-Interiors (12).jpg",
  livingDoor:  P + "30-Interiors (13).jpg",
  livingTV:    P + "31-Interiors (14).jpg",
  kitchen1:    P + "32-Interiors (15).jpg",
  kitchen2:    P + "33-Interiors (16).jpg",
  kitchen3:    P + "34-Interiors (17).jpg",
  kitchen4:    P + "35-Interiors (18).jpg",
  kitchen5:    P + "36-Interiors (19).jpg",
  porchDine1:  P + "37-Interiors (20).jpg",
  porchDine2:  P + "38-Interiors (21).jpg",
  porchDine3:  P + "39-Interiors (22).jpg",
  porchDine4:  P + "40-Interiors (23).jpg",
  drone1:      P + "43-z Drone (1).jpg",
  drone2:      P + "44-z Drone (2).jpg",
  drone3:      P + "45-z Drone (3).jpg",
  drone4:      P + "46-z Drone (4).jpg",
  droneAerial: P + "47-z Drone (7).jpg",
  droneTop:    P + "50-z Drone (10).jpg",
};

const HERO_SLIDES = [photos.heroDusk, photos.droneAerial, photos.heroPatio, photos.extDay];

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
          <a href="#residence">The Residence</a>
          <a href="the-suite.html">The Suite</a>
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
        <div className="hero-eyebrow">A Private Residence · St. Petersburg, Florida</div>
        <h1 className="hero-title">
          Your home <em>away</em><br />from home on the<br />Gulf&nbsp;Coast.
        </h1>
        <p className="hero-sub">
          Sun-drenched, fully-furnished retreats moments from Treasure Island, downtown St. Pete,
          and the Dalí Museum. Designed for extended stays, snowbirds, traveling professionals,
          and anyone in search of slow Florida mornings.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={onBookClick}>
            <Icon name="calendar-check" size={16} stroke={2} /> Check Availability
          </button>
          <a href="#gallery" className="btn btn-outline">
            <Icon name="image" size={16} stroke={2} /> Tour the Estate
          </a>
        </div>
      </div>

      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <div key={i} className={`hero-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} role="button" aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
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
        <div className="stat"><div className="stat-num">2<em>/2</em></div><div className="stat-label">Bedrooms / Baths</div></div>
        <div className="stat"><div className="stat-num">4</div><div className="stat-label">Guests, Comfortably</div></div>
        <div className="stat"><div className="stat-num">5.0<em>★</em></div><div className="stat-label">Guest Rated</div></div>
        <div className="stat"><div className="stat-num">1<em>mo</em></div><div className="stat-label">Minimum Stay</div></div>
      </div>
    </div>
  );
}

// ============================================================
// About / Welcome split
// ============================================================
function Welcome() {
  return (
    <section className="section" id="residence">
      <div className="container">
        <div className="split">
          <div>
            <div className="eb left">— The Residence —</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.022em',
              margin: '0 0 28px',
              color: 'var(--color-green-900)'
            }}>
              A quiet bungalow,<br /><em style={{ fontStyle: 'italic', color: 'var(--color-gold-600)' }}>polished to perfection.</em>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 20, fontWeight: 300 }}>
              Tucked beneath a century-old oak in the Disston Heights neighborhood, this
              fully-renovated coastal bungalow is light, airy, and quietly comfortable — fresh
              tile baths, wide-plank floors, designer lighting, and a screened lanai built
              for long Florida evenings.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 36, fontWeight: 300 }}>
              Two bedrooms. Two full bathrooms. A galley kitchen stocked for the home chef.
              A private backyard with above-ground pool, fire pit, and string-lit pergola.
              Ten minutes to the beach. Five to downtown. Yours to settle into.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#book" className="btn btn-primary"><Icon name="key-round" size={16} stroke={2} /> Check Dates</a>
              <a href="#amenities" className="btn btn-outline-dark"><Icon name="sparkles" size={16} stroke={2} /> The Details</a>
            </div>
          </div>
          <div>
            <div className="editorial-img">
              <img src={photos.livingDoor} alt="Sunlit living room with shiplap walls" />
              <div className="caption">The Living Room · Morning Light</div>
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
  { icon: 'waves', name: 'Private Pool', desc: 'Above-ground pool in a fully fenced backyard.' },
  { icon: 'wifi', name: 'High-Speed Wi-Fi', desc: 'Reliable connection throughout, ideal for remote work.' },
  { icon: 'chef-hat', name: 'Full Kitchen', desc: 'Stainless appliances, full-size range, dishwasher, cookware.' },
  { icon: 'tv', name: 'Smart TVs', desc: 'TVs in living room, bedrooms, and screened lanai.' },
  { icon: 'wind', name: 'Central A/C', desc: 'Central air conditioning plus designer ceiling fans.' },
  { icon: 'washing-machine', name: 'In-Unit Laundry', desc: 'Full-size washer & dryer inside the home.' },
  { icon: 'car', name: 'Private Parking', desc: 'Private driveway with off-street parking.' },
  { icon: 'dog', name: 'Pet Friendly', desc: 'Well-behaved dogs welcome. Fully fenced yard.' },
  { icon: 'flame', name: 'Fire Pit & Lounge', desc: 'Outdoor fire pit with adirondack chairs.' },
  { icon: 'sun', name: 'Screened Lanai', desc: 'Covered, screened outdoor dining & lounge area.' },
  { icon: 'shield-check', name: 'Smart Locks', desc: 'Keyless entry. Self check-in, 24/7.' },
  { icon: 'trees', name: 'Private Backyard', desc: 'Fenced yard with pergola, string lights, and lawn space.' },
];

function Amenities() {
  return (
    <section className="section cream" id="amenities">
      <div className="container">
        <div className="sec-head">
          <div className="eb left">— Considered details —</div>
          <h2>Every <em>creature comfort,</em><br /> thoughtfully provided.</h2>
          <p className="lede">Every detail of the home was thought through with long stays in mind — so the first morning feels as settled as the tenth.</p>
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
  { src: photos.heroDusk, tag: 'Twilight · Front Facade', cls: 'g-1' },
  { src: photos.masterBR, tag: 'Master Bedroom', cls: 'g-2' },
  { src: photos.kitchen5, tag: 'Galley Kitchen', cls: 'g-3' },
  { src: photos.bathMarble, tag: 'Primary Bath', cls: 'g-4' },
  { src: photos.poolPath, tag: 'Pool & Garden', cls: 'g-5' },
  { src: photos.porchDine3, tag: 'Screened Lanai', cls: 'g-6' },
  { src: photos.droneAerial, tag: 'Aerial · Disston Heights', cls: 'g-7' },
  { src: photos.bedroom2, tag: 'Guest Suite', cls: 'g-3' },
  { src: photos.livingTV, tag: 'Living Room', cls: 'g-4' },
];

function Gallery({ onOpen }) {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="sec-head">
          <div className="eb left">— Tour the residence —</div>
          <h2>Welcome <em>inside.</em></h2>
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
// ----- EDIT THESE TO MATCH YOUR ACTUAL RATES -----
const NIGHTLY_BASE = 159;   // nightly rate (USD, tax-inclusive)
const CLEANING    = 200;    // cleaning fee (USD)
const TAXES_PCT   = 0;      // taxes collected by Airbnb / at booking
// -------------------------------------------------

// ============================================================
// Live Airbnb calendar sync (iCal)
// ============================================================
const LISTING_KEY = 'residence';
const ICAL_URL = 'https://www.airbnb.com/calendar/ical/1448873183102250785.ics?t=a82ba9aa46d04528a592f07bb65d7999';

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
      // check no booked nights fall inside the range
      const tmp = new Date(start);
      let hasBlock = false;
      while (tmp < date) {
        tmp.setDate(tmp.getDate() + 1);
        if (tmp < date && isDayBlocked(tmp)) { hasBlock = true; break; }
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
    const cls = [];
    const isToday = date.getTime() === today.getTime();
    if (isToday) cls.push('today');
    if (start && date.getTime() === start.getTime()) cls.push('range-start');
    if (end && date.getTime() === end.getTime()) cls.push('range-end');
    const hoverEnd = hover && !end && start && hover > start ? hover : null;
    const effEnd = end || hoverEnd;
    if (start && effEnd && date > start && date < effEnd) cls.push('in-range');
    return cls.join(' ');
  }

  const nights = nightsBetween(start, end);
  const subtotal = nights * NIGHTLY_BASE;
  const stayDiscount = nights >= 28 ? subtotal * 0.18 : (nights >= 7 ? subtotal * 0.08 : 0);
  const total = subtotal - stayDiscount + CLEANING;

  const canPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());

  return (
    <section className="section cream" id="book">
      <div className="container">
        <div className="sec-head centered">
          <div className="eb">— Live availability —</div>
          <h2>Check dates. <em>Get a price.</em></h2>
          <p className="lede">Our calendar is updated in real time — the open dates you see are the real ones.
            Choose your nights for an instant, transparent quote. Book direct for our best rate.</p>
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
            <div style={{ marginTop: 16, fontFamily: 'var(--font-sc)', fontSize: 11, letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-cream-700)' }}>
              {syncState === 'loading' && <>Syncing availability…</>}
              {syncState === 'live' && <><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2E9E5B', display: 'inline-block' }} /> Live availability · updated in real time</>}
              {syncState === 'error' && <span style={{ color: '#B07A3C', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-sans)', fontSize: 13 }}>Live sync is briefly unavailable — we&rsquo;ll confirm exact availability when you inquire.</span>}
            </div>
          </div>

          <div className="book-side">
            <h3>Estimated from</h3>
            <div className="price-now">${NIGHTLY_BASE}<em>/night</em></div>
            <div className="price-note">Final rate confirmed by Amanda</div>

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
                  <button onClick={() => setGuests(g => Math.min(6, g + 1))} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(250,247,240,0.3)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>+</button>
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
              with us directly. Free cancellation up to 14 days before arrival.
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
          A quiet bungalow under a hundred-year-old oak.<br/>
          The Gulf is ten minutes west.<br/>
          <em style={{ color:'var(--color-gold-600)' }}>Downtown St. Pete, five minutes east.</em>
        </blockquote>
        <cite>— St. Petersburg, Florida</cite>
      </div>
    </section>
  );
}

// ============================================================
// Boat experiences
// ============================================================
function BoatExperiences() {
  return (
    <section className="section" id="experiences">
      <div className="container">
        <div className="sec-head">
          <div className="eb left">— Exclusive to our guests —</div>
          <h2>Charter the <em>Gulf,</em><br />by the half day or the whole.</h2>
          <p className="lede">Available only to Ferrer Sunshine Estates guests, our private boat experiences
            unlock the coast — dolphin watching, island hopping, and the kind of sun-drenched Florida
            day you can only have from the water.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="boat-grid-responsive">
          <div className="boat-card">
            <div className="duration">5<em>hr</em></div>
            <h3>Coastal Half-Day</h3>
            <p>A relaxed afternoon weaving the barrier islands of Tampa Bay. Visit an island, look for dolphin pods, and soak in the Gulf Coast scenery before heading back.</p>
            <div className="boat-incl">
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Captain, fuel & marina fees</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Island stop & dolphin watching</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Customized to your interests</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Inquire for pricing & group size</div>
            </div>
          </div>

          <div className="boat-card">
            <div className="duration">8<em>hr</em></div>
            <h3>Premium Full-Day</h3>
            <p>A full day on the Gulf. Hop between multiple islands, watch for dolphin pods along the way, and dock briefly at a waterfront spot to grab food before heading back out on the water.</p>
            <div className="boat-incl">
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Multiple island stops</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Dolphin watching throughout</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Optional dock-stop to pick up food</div>
              <div className="boat-incl-item"><Icon name="check" size={16} stroke={2} /> Inquire for pricing & group size</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width:880px){ .boat-grid-responsive { grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

// ============================================================
// Reviews
// ============================================================
// External listing & review URLs — replace placeholders with your real links
const REVIEW_LINKS = {
  airbnb:    'https://www.airbnb.com/users/show/YOUR_AIRBNB_HOST_ID',
  google:    'https://www.google.com/search?q=Ferrer+Sunshine+Estates+St+Petersburg+reviews',
  vrbo:      'https://www.vrbo.com/YOUR_VRBO_LISTING',
  furnished: 'https://www.furnishedfinder.com/members/profile/YOUR_FF_ID',
};

function Reviews() {
  const platforms = [
    { name: 'Airbnb', href: REVIEW_LINKS.airbnb, icon: 'home' },
    { name: 'Google', href: REVIEW_LINKS.google, icon: 'globe' },
  ];
  return (
    <section className="section blush">
      <div className="container">
        <div className="sec-head centered">
          <div className="eb">— What guests are saying —</div>
          <h2>Five stars on <em>Airbnb &amp; Google.</em></h2>
          <p className="lede">We don&rsquo;t curate or rewrite our reviews. Read every word from every guest, directly on the platform of your choice.</p>
        </div>
        <div className="rev-platform-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18, maxWidth:680, margin:'0 auto' }}>
          {platforms.map((p, i) => (
            <a key={i} href={p.href} target="_blank" rel="noopener" style={{
              background:'var(--color-cream-50)',
              border:'1px solid var(--color-cream-200)',
              padding:'36px 28px',
              borderRadius:'var(--radius-sm)',
              textDecoration:'none',
              display:'flex', flexDirection:'column', gap:14,
              transition:'all var(--transition-luxury)',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='var(--color-gold-400)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--color-cream-200)'; }}
            >
              <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--color-green-800)', color:'var(--color-gold-400)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name={p.icon} size={20} stroke={1.6} />
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:24, color:'var(--color-green-900)', fontWeight:500, lineHeight:1.1 }}>{p.name}</div>
              <div style={{ color:'var(--color-gold-500)', fontSize:16, letterSpacing:'3px' }}>★★★★★</div>
              <div style={{ fontFamily:'var(--font-sc)', fontSize:10, letterSpacing:'var(--ls-widest)', color:'var(--color-cream-700)', textTransform:'uppercase' }}>
                Read reviews →
              </div>
            </a>
          ))}
        </div>
        <style>{`@media (max-width: 880px){ .rev-platform-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
      </div>
    </section>
  );
}

// ============================================================
// Location
// ============================================================
const LOCATIONS = [
  { name: 'Treasure Island Beach', meta: '4 miles · 9 min drive', desc: 'Sugar-white sand, calm Gulf swimming, beach bars open until sunset.' },
  { name: 'Downtown St. Pete', meta: '6 miles · 14 min', desc: 'Galleries, the EDGE district, Beach Drive dining, the Pier.' },
  { name: 'The Dalí Museum', meta: '6.5 miles · 15 min', desc: 'The largest collection of Dalí works outside Spain.' },
  { name: 'Tampa Intl. Airport', meta: '24 miles · 32 min', desc: 'TPA — direct flights to most US hubs and Europe.' },
  { name: 'Fort De Soto Park', meta: '14 miles · 24 min', desc: 'Ranked #1 beach in America. Kayak the inland waterway.' },
  { name: 'Tropicana Field', meta: '6 miles · 13 min', desc: 'Home of the Tampa Bay Rays, concerts, conventions.' },
];

function Location() {
  return (
    <section className="section dark" id="location">
      <div className="container">
        <div className="sec-head">
          <div className="eb left" style={{ color: 'var(--color-gold-400)' }}>— The Neighborhood —</div>
          <h2 style={{ color: 'var(--color-cream-50)' }}>Disston Heights.<br /><em style={{ color: 'var(--color-gold-400)' }}>The quiet middle</em> of the Sunshine City.</h2>
          <p className="lede" style={{ color: 'rgba(250,247,240,0.72)' }}>Equidistant to the beach and downtown, on a tree-lined block of mid-century bungalows.
            Walk to coffee, drive to anything.</p>
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

                {/* Tampa Bay water shape */}
                <path d="M 540 0 Q 580 100 540 180 Q 500 240 560 320 Q 600 400 540 450 L 800 450 L 800 0 Z" fill="rgba(122,154,138,0.15)" stroke="rgba(122,154,138,0.4)" strokeWidth="1"/>
                <text x="660" y="240" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="rgba(201,169,110,0.5)">Tampa Bay</text>

                {/* Gulf side */}
                <path d="M 0 0 Q 30 100 0 200 L 0 450 L 0 0 Z" fill="rgba(122,154,138,0.18)"/>
                <text x="20" y="80" fontFamily="Cormorant Garamond" fontSize="22" fontStyle="italic" fill="rgba(201,169,110,0.5)">Gulf of Mexico</text>

                {/* Roads */}
                <path d="M 0 220 L 540 220" stroke="rgba(201,169,110,0.25)" strokeWidth="1.5" fill="none"/>
                <path d="M 220 0 L 220 450" stroke="rgba(201,169,110,0.25)" strokeWidth="1.5" fill="none"/>
                <path d="M 380 0 L 380 450" stroke="rgba(201,169,110,0.15)" strokeWidth="1" fill="none"/>
                <path d="M 0 320 L 540 320" stroke="rgba(201,169,110,0.15)" strokeWidth="1" fill="none"/>

                {/* Pin at property */}
                <circle cx="220" cy="220" r="60" fill="url(#glow)" />
                <circle cx="220" cy="220" r="9" fill="var(--color-gold-500)" />
                <circle cx="220" cy="220" r="14" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5" opacity="0.5"/>
                <text x="220" y="200" textAnchor="middle" fontFamily="Cormorant SC" fontSize="11" letterSpacing="2" fill="var(--color-gold-400)">— THE ESTATE —</text>

                {/* Nearby pins */}
                <circle cx="80" cy="200" r="4" fill="var(--color-cream-50)" opacity="0.7"/>
                <text x="80" y="190" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.6)" letterSpacing="1">TREASURE IS.</text>

                <circle cx="430" cy="280" r="4" fill="var(--color-cream-50)" opacity="0.7"/>
                <text x="430" y="300" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.6)" letterSpacing="1">DOWNTOWN</text>

                <circle cx="430" cy="350" r="4" fill="var(--color-cream-50)" opacity="0.5"/>
                <text x="430" y="370" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.5)" letterSpacing="1">DALÍ MUSEUM</text>

                <circle cx="640" cy="80" r="4" fill="var(--color-cream-50)" opacity="0.5"/>
                <text x="640" y="70" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="rgba(250,247,240,0.5)" letterSpacing="1">TPA AIRPORT</text>

                <text x="40" y="430" fontFamily="Cormorant SC" fontSize="10" fill="rgba(250,247,240,0.35)" letterSpacing="2">ST. PETERSBURG · FLORIDA</text>
              </svg>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-sc)', fontSize: 11, letterSpacing: 'var(--ls-wider)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>
                St. Petersburg, Florida
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
// Channel sync (one calendar everywhere)
// ============================================================
function ChannelSync() {
  return (
    <section className="section">
      <div className="container">
        <div className="split reverse">
          <div>
            <div className="eb left">— One calendar. Every platform. —</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.022em', margin: '0 0 28px', color: 'var(--color-green-900)' }}>
              Synced in real time<br /><em style={{ fontStyle: 'italic', color: 'var(--color-gold-600)' }}>with where you book.</em>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-cream-700)', marginBottom: 22, fontWeight: 300 }}>
              The availability you see here mirrors every channel — Airbnb, Vrbo, and
              Furnished Finder. Pick your platform of choice, or book direct and skip
              the service fees.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginTop: 32 }}>
              {[
                { name: 'Airbnb',           meta: 'View listing →', icon: 'home',              href: REVIEW_LINKS.airbnb },
                { name: 'Vrbo',             meta: 'View listing →', icon: 'house',             href: REVIEW_LINKS.vrbo },
                { name: 'Google',           meta: 'Read reviews →', icon: 'globe',             href: REVIEW_LINKS.google },
                { name: 'Furnished Finder', meta: 'Pro listing →',  icon: 'briefcase-medical', href: REVIEW_LINKS.furnished },
              ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener" style={{
                  textDecoration:'none',
                  padding: '20px 22px',
                  background: 'var(--color-cream-100)',
                  border: '1px solid var(--color-cream-200)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--color-gold-400)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--color-cream-200)'; }}
                >
                  <div style={{ width: 36, height: 36, background: 'var(--color-green-800)', color: 'var(--color-gold-400)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={c.icon} size={18} stroke={1.6} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-green-900)', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-wider)', color: 'var(--color-gold-600)', textTransform: 'uppercase' }}>{c.meta}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="editorial-img" style={{ aspectRatio: '4/5' }}>
              <img src={photos.porchDine3} alt="Screened lanai with outdoor dining" />
              <div className="caption">The Lanai</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ
// ============================================================
const FAQS = [
  { q: 'What is the minimum stay?', a: 'Our minimum stay is one month (28 nights), which lets us offer the kind of slow, settled-in experience the home was designed for. Stays of 7+ nights may be considered seasonally — please inquire.' },
  { q: 'How does direct booking save me money?', a: 'Booking platforms typically add service fees on top of the nightly rate. Booking direct removes those fees entirely. You\u2019ll also have direct communication with Amanda, our property manager, for any custom requests.' },
  { q: 'Is the home pet-friendly?', a: 'Yes — we welcome well-behaved dogs (please mention your pet when inquiring; a small pet fee applies). The fully fenced backyard makes it especially comfortable for furry guests.' },
  { q: 'Is the property suitable for traveling nurses or remote workers?', a: 'Absolutely. We offer high-speed internet, a quiet dedicated workspace, and flexible 13-week+ contract options for traveling medical professionals.' },
  { q: 'What is included in the rate?', a: 'Everything but the cleaning fee — a full kitchen with cookware, linens, towels, basic toiletries, paper goods, dish soap, and laundry detergent. You arrive, unpack, and settle in.' },
  { q: 'Can you arrange airport transfers and the boat experiences?', a: 'Yes — concierge airport pickup, grocery pre-stocking, and our exclusive 5-hour and 8-hour Gulf Coast charters are all available. Mention them in your inquiry and we\u2019ll line everything up.' },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section cream">
      <div className="container" style={{ maxWidth: 920 }}>
        <div className="sec-head centered">
          <div className="eb">— Frequently asked —</div>
          <h2>The <em>fine print,</em> in plain English.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
              <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-icon"><Icon name="plus" size={18} stroke={2} /></span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Inquiry / Contact form
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
              Tell us a little about your visit — dates, the kind of trip, anything we should know.
              Amanda personally replies to every inquiry, usually within an hour during business hours.
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
                  <Icon name="clock" size={18} stroke={1.6} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-widest)', color: 'var(--color-gold-400)', textTransform: 'uppercase' }}>Response Time</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Within 1 hour, typically</div>
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
                <input type="hidden" name="_subject" value="New inquiry — The Residence" />
                <input type="hidden" name="Property" value="The Residence · St. Petersburg" />
                <div className="field"><label>First name</label><input type="text" name="First name" required placeholder="Jane" /></div>
                <div className="field"><label>Last name</label><input type="text" name="Last name" required placeholder="Doe" /></div>
                <div className="field"><label>Email</label><input type="email" name="email" required placeholder="you@email.com" /></div>
                <div className="field"><label>Phone</label><input type="tel" name="Phone" placeholder="(555) 123-4567" /></div>
                <div className="field"><label>Check-in</label><input type="date" name="Check-in" /></div>
                <div className="field"><label>Check-out</label><input type="date" name="Check-out" /></div>
                <div className="field full">
                  <label>Tell us about your stay</label>
                  <textarea name="message" placeholder="Number of guests, occasion, any questions or special requests..." />
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
            <h5>Explore</h5>
            <a href="#residence">The Residence</a>
            <a href="#gallery">Gallery</a>
            <a href="#amenities">Amenities</a>
            <a href="#experiences">Boat Charters</a>
            <a href="#location">The Neighborhood</a>
          </div>
          <div className="foot-col">
            <h5>Book</h5>
            <a href="#book">Check Availability</a>
            <a href="#contact">Direct Inquiry</a>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a href="tel:7275049949">(727) 504-9949</a>
            <a href="mailto:Amanda@bpestatemgmt.com">Amanda@bpestatemgmt.com</a>
            <p>St. Petersburg, Florida</p>
          </div>
        </div>

        {/* SEO long-tail keyword cluster */}
        <div style={{ padding: '40px 0', borderBottom: '1px solid rgba(250,247,240,0.08)', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'rgba(250,247,240,0.3)', lineHeight: 1.8 }}>
          <strong style={{ color: 'rgba(250,247,240,0.5)', fontFamily: 'var(--font-sc)', fontSize: 10, letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase' }}>Also serving:</strong>{' '}
          Monthly furnished rentals St. Petersburg FL · Traveling nurse housing Tampa Bay · Snowbird rentals Florida Gulf Coast · Treasure Island vacation rental ·
          Pass-a-Grille short term rental · Pet-friendly rental St. Pete · Corporate housing St. Petersburg · Long term rental near Tropicana Field ·
          Vacation home near Dalí Museum · 30-day rental Pinellas County · Beach getaway St. Petersburg FL · Furnished bungalow St. Pete · Mid-term rental Tampa Bay area
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
// Why book direct
// ============================================================
const WHY_DIRECT = [
  { icon:'badge-percent',  name:'No Service Fee',          desc:'Booking sites add a guest service fee (often 12–15%) on top of the rate. Book direct and it disappears.' },
  { icon:'receipt',        name:'One Simple Price',        desc:'No surprise fees — the nightly price you see is the price you pay.' },
  { icon:'message-circle', name:'A Real Local Host',       desc:'Deal directly with the family who cares for the home — fast, personal answers.' },
  { icon:'dog',            name:'Flexible & Pet-Friendly', desc:'No minimum stay and well-behaved dogs welcome. Stay a night or a season.' },
];

function WhyDirect() {
  return (
    <section className="section cream">
      <div className="container">
        <div className="sec-head centered">
          <div className="eb">— The case for booking direct —</div>
          <h2>Same home. <em>Better booked direct.</em></h2>
          <p className="lede">Everything you&rsquo;d get booking on a platform — without the guest service fee, and with the people who actually look after the home.</p>
        </div>
        <div className="am-grid">
          {WHY_DIRECT.map((a, i) => (
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
// App
// ============================================================
function App() {
  const [lbx, setLbx] = useState(null);
  const bookRef = useRef(null);
  const onBookClick = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll-in animations
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav onBookClick={onBookClick} />
      <Hero onBookClick={onBookClick} />
      <StatRow />
      <Welcome />
      <Amenities />
      <Gallery onOpen={(i) => setLbx(i)} />
      <PullQuote />
      <Booking />
      <WhyDirect />
      <BoatExperiences />
      <Location />
      <FAQ />
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
