import { useState, useRef } from 'react'
import Head from 'next/head'

const DESIGNS = [
  {
    id: 'botanical',
    name: 'White Botanical',
    desc: 'Soft florals, watercolour washes, garden wedding elegance.',
    palette: ['#7a9a6a', '#f0ece5', '#d8c8a8'],
  },
  {
    id: 'blue',
    name: 'Blue Floral',
    desc: 'Monochromatic navy, bold editorial type, graphic impact.',
    palette: ['#1e3060', '#d8e4f8', '#4a6aaa'],
  },
  {
    id: 'pressed',
    name: 'Pressed Wildflowers',
    desc: 'Scattered botanicals, ultra-thin type, pure white paper.',
    palette: ['#9a80b0', '#e8b820', '#5a7a48'],
  },
  {
    id: 'custom',
    name: 'Design your own',
    desc: 'Work with our team to create something completely bespoke.',
    palette: ['#555', '#888', '#bbb'],
    premium: true,
  },
]

const PLANS = [
  {
    id: 'esencial',
    name: 'Esencial',
    price: 49,
    guests: '100',
    features: ['1 design template', 'Personalised links per guest', 'RSVP tracking', 'Shareable link delivery'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    guests: '250',
    features: ['All 3 design templates', 'Guest personalisation', 'WhatsApp & email delivery', 'Live RSVP dashboard'],
    highlight: true,
  },
  {
    id: 'cinematica',
    name: 'Cinematica',
    price: 179,
    guests: 'Unlimited',
    features: ['Everything in Premium', 'Couple photo background', 'Ambient music', 'Priority support'],
  },
]

export default function Home() {
  const [selectedDesign, setSelectedDesign] = useState('botanical')
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [step, setStep] = useState(1) // 1=landing, 2=form
  const [photos, setPhotos] = useState([])
  const [guestText, setGuestText] = useState('')
  const [guestFile, setGuestFile] = useState(null)
  const [form, setForm] = useState({
    partner1: '', partner2: '', date: '', time: '',
    venue: '', city: '', rsvpDeadline: '', email: ''
  })
  const photoRef = useRef()
  const guestFileRef = useRef()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const guestCount = guestText.split('\n').filter(l => l.trim()).length
  const plan = PLANS.find(p => p.id === selectedPlan)
  const design = DESIGNS.find(d => d.id === selectedDesign)
  const totalPrice = plan.price + (selectedDesign === 'custom' ? 100 : 0)
  const isCinematica = selectedPlan === 'cinematica'

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const previews = files.slice(0, 5).map(f => URL.createObjectURL(f))
    setPhotos(prev => [...prev, ...previews].slice(0, 5))
  }

  const handleGuestFile = (e) => {
    const f = e.target.files[0]
    if (f) setGuestFile(f.name)
  }

  return (
    <>
      <Head>
        <title>Vitella — Luxury digital invitations</title>
        <meta name="description" content="Cinematic digital wedding invitations. A link. A wax seal. A moment they'll never forget." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black: #080808;
          --dark: #111111;
          --card: #181818;
          --border: #2a2a2a;
          --border-light: #333;
          --white: #ffffff;
          --off-white: #e8e8e6;
          --muted: #888;
          --accent: #c8a860;
          --accent-dim: #9a7a40;
          --danger: #e84040;
          --font: 'DM Sans', system-ui, sans-serif;
          --serif: 'DM Serif Display', Georgia, serif;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--black); color: var(--white); font-family: var(--font); line-height: 1.6; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
        .container-sm { max-width: 720px; margin: 0 auto; padding: 0 2rem; }

        /* NAV */
        nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(8,8,8,.92); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 1.1rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { font-family: var(--serif); font-size: 20px; color: var(--white); letter-spacing: .5px; }
        .nav-cta {
          padding: 8px 20px; background: var(--white); color: var(--black);
          border: none; border-radius: 6px; font-family: var(--font);
          font-size: 13px; font-weight: 500; cursor: pointer; letter-spacing: .3px;
          transition: opacity .2s;
        }
        .nav-cta:hover { opacity: .85; }

        /* HERO */
        .hero {
          padding: 140px 2rem 120px;
          text-align: center;
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,168,96,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-tag {
          display: inline-block; padding: 5px 14px;
          border: 1px solid var(--border-light); border-radius: 20px;
          font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 2.5rem;
        }
        .hero-h1 {
          font-family: var(--serif); font-size: clamp(52px, 8vw, 100px);
          font-weight: 400; line-height: 1.02; color: var(--white);
          letter-spacing: -1px; margin-bottom: 2rem;
        }
        .hero-h1 em { font-style: italic; color: var(--accent); }
        .hero-sub {
          font-size: clamp(16px, 2vw, 20px); color: var(--muted);
          font-weight: 300; max-width: 540px; margin: 0 auto 3rem;
          line-height: 1.7;
        }
        .hero-btn {
          padding: 16px 40px; background: var(--white); color: var(--black);
          border: none; border-radius: 8px; font-family: var(--font);
          font-size: 15px; font-weight: 500; cursor: pointer;
          transition: transform .2s, opacity .2s; letter-spacing: .3px;
        }
        .hero-btn:hover { transform: translateY(-2px); opacity: .9; }
        .hero-scroll {
          margin-top: 5rem; color: var(--border-light);
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
        }

        /* SECTION SHARED */
        .section { padding: 100px 0; border-bottom: 1px solid var(--border); }
        .section-label {
          font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 12px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); max-width: 60px; }
        .section-h2 {
          font-family: var(--serif); font-size: clamp(36px, 5vw, 60px);
          font-weight: 400; line-height: 1.1; color: var(--white);
          margin-bottom: 1rem; letter-spacing: -.5px;
        }
        .section-h2 em { font-style: italic; color: var(--accent); }
        .section-sub { font-size: 17px; color: var(--muted); font-weight: 300; max-width: 500px; margin-bottom: 3.5rem; }

        /* EXAMPLES */
        .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .example-card { background: var(--card); padding: 2.5rem 2rem; }
        .example-num { font-size: 11px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 1.5rem; }
        .example-preview {
          height: 200px; border-radius: 10px; margin-bottom: 1.5rem;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; border: 1px solid var(--border-light);
        }
        .example-name { font-family: var(--serif); font-size: 20px; color: var(--white); margin-bottom: .25rem; }
        .example-desc { font-size: 13px; color: var(--muted); }

        /* DESIGN PICKER */
        .designs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .design-card {
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 14px; padding: 1.5rem; cursor: pointer;
          transition: border-color .2s, transform .2s;
          position: relative;
        }
        .design-card:hover { border-color: var(--border-light); transform: translateY(-3px); }
        .design-card.selected { border-color: var(--accent); }
        .design-card.premium-card { border-style: dashed; }
        .design-swatch { height: 110px; border-radius: 8px; margin-bottom: 1.25rem; position: relative; overflow: hidden; }
        .design-name { font-size: 15px; font-weight: 500; color: var(--white); margin-bottom: .25rem; }
        .design-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .premium-badge {
          position: absolute; top: 12px; right: 12px;
          background: var(--accent); color: var(--black);
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          padding: 3px 8px; border-radius: 4px; text-transform: uppercase;
        }
        .extra-cost { font-size: 11px; color: var(--accent); margin-top: .5rem; font-weight: 500; }
        .selected-indicator {
          position: absolute; top: 12px; left: 12px;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--accent); display: flex; align-items: center; justify-content: center;
        }

        /* PLANS */
        .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .plan-card {
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 14px; padding: 2rem 1.5rem; cursor: pointer;
          transition: border-color .2s; position: relative;
        }
        .plan-card:hover { border-color: var(--border-light); }
        .plan-card.selected { border-color: var(--accent); }
        .plan-card.highlighted { border-color: var(--border-light); }
        .plan-badge {
          position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
          background: var(--accent); color: var(--black);
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          padding: 4px 14px; border-radius: 0 0 8px 8px; text-transform: uppercase;
          white-space: nowrap;
        }
        .plan-name { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
        .plan-price { font-family: var(--serif); font-size: 52px; color: var(--white); line-height: 1; margin-bottom: .25rem; }
        .plan-guests { font-size: 12px; color: var(--muted); margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
        .plan-features { list-style: none; }
        .plan-features li { font-size: 13px; color: var(--off-white); padding: .4rem 0; display: flex; align-items: center; gap: 8px; }
        .plan-features li::before { content: '✓'; color: var(--accent); font-weight: 700; font-size: 12px; }

        /* FORM SECTIONS */
        .form-section { padding: 80px 0; border-bottom: 1px solid var(--border); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: 1 / -1; }
        label { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-weight: 500; }
        input, select, textarea {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 8px; padding: 14px 16px;
          font-family: var(--font); font-size: 15px; color: var(--white);
          outline: none; width: 100%; transition: border-color .2s;
          -webkit-appearance: none;
        }
        input::placeholder, textarea::placeholder { color: #555; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent); }
        select option { background: var(--card); }
        textarea { min-height: 120px; resize: vertical; }

        /* UPLOAD */
        .upload-zone {
          border: 2px dashed var(--border-light); border-radius: 12px;
          padding: 2.5rem; text-align: center; cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .upload-zone:hover { border-color: var(--accent); background: rgba(200,168,96,.04); }
        .upload-icon { font-size: 28px; margin-bottom: 1rem; opacity: .5; }
        .upload-title { font-size: 15px; font-weight: 500; color: var(--white); margin-bottom: .25rem; }
        .upload-sub { font-size: 13px; color: var(--muted); }
        .photo-previews { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 1rem; }
        .photo-thumb { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); }
        .locked-note { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem; }
        .locked-note p { font-size: 14px; color: var(--muted); }
        .locked-note strong { color: var(--accent); }

        /* SUMMARY */
        .summary-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 2.5rem;
          position: sticky; top: 90px;
        }
        .summary-row { display: flex; justify-content: space-between; align-items: center; padding: .75rem 0; border-bottom: 1px solid var(--border); }
        .summary-row:last-of-type { border-bottom: none; }
        .summary-label { font-size: 13px; color: var(--muted); }
        .summary-value { font-size: 13px; color: var(--white); font-weight: 500; }
        .summary-total-label { font-size: 16px; font-weight: 600; color: var(--white); }
        .summary-total-value { font-family: var(--serif); font-size: 28px; color: var(--accent); }
        .submit-btn {
          width: 100%; padding: 16px; background: var(--white); color: var(--black);
          border: none; border-radius: 8px; font-family: var(--font);
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: opacity .2s, transform .2s; margin-top: 1.5rem;
          letter-spacing: .3px;
        }
        .submit-btn:hover { opacity: .9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        /* LAYOUT HELPER */
        .two-col { display: grid; grid-template-columns: 1fr 360px; gap: 4rem; align-items: start; }

        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr; }
          .summary-card { position: static; }
          .form-grid { grid-template-columns: 1fr; }
          .hero { padding: 100px 1.5rem 80px; }
        }
        @media (max-width: 600px) {
          .designs-grid, .plans-grid { grid-template-columns: 1fr 1fr; }
          .examples-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">Vitella</div>
        <button className="nav-cta" onClick={() => document.getElementById('design-section').scrollIntoView({ behavior: 'smooth' })}>
          Create invitation
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">Digital wedding invitations</div>
        <h1 className="hero-h1">
          Invitations that feel<br />
          like <em>opening a gift</em>
        </h1>
        <p className="hero-sub">
          A link. A wax seal. A moment your guests will remember.
          No app, no login — just beauty on any device.
        </p>
        <button className="hero-btn" onClick={() => document.getElementById('design-section').scrollIntoView({ behavior: 'smooth' })}>
          Create your invitation →
        </button>
        <div className="hero-scroll">↓ &nbsp; scroll to see examples</div>
      </section>

      {/* EXAMPLES */}
      <section className="section">
        <div className="container">
          <div className="section-label">01 &nbsp; How it works</div>
          <h2 className="section-h2">What your guests <em>receive</em></h2>
          <p className="section-sub">A personal link. They tap it, the wax seal breaks, an envelope opens, confetti fires, and your invitation card slides into view.</p>

          <div className="examples-grid">
            {[
              { num: '01', name: 'White Botanical', desc: 'Soft florals & watercolour', bg: 'linear-gradient(135deg, #f0ece5 0%, #e8dcc8 100%)', text: '#3a3028', accent: '#7a9a6a' },
              { num: '02', name: 'Blue Floral', desc: 'Monochromatic navy editorial', bg: 'linear-gradient(135deg, #d8e4f8 0%, #c0d0f0 100%)', text: '#1e3060', accent: '#1e3060' },
              { num: '03', name: 'Pressed Wildflowers', desc: 'Scattered botanicals, pure white', bg: 'linear-gradient(135deg, #fdfcf9 0%, #f5f3ee 100%)', text: '#1a1a16', accent: '#9a80b0' },
            ].map(ex => (
              <div className="example-card" key={ex.num}>
                <div className="example-num">{ex.num}</div>
                <div className="example-preview" style={{ background: ex.bg }}>
                  {/* Mini envelope illustration */}
                  <svg viewBox="0 0 160 110" width="140" height="96">
                    <rect x="5" y="15" width="150" height="90" rx="4" fill="white" stroke={ex.accent} strokeWidth="1" opacity=".9"/>
                    <path d={`M5 15 L80 70 L155 15`} fill="none" stroke={ex.accent} strokeWidth="1" opacity=".4"/>
                    <circle cx="80" cy="58" r="14" fill={ex.accent} opacity=".85"/>
                    <text x="80" y="63" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="10" fill="white">V</text>
                    <text x="80" y="92" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill={ex.text} opacity=".5">tap to open</text>
                  </svg>
                </div>
                <div className="example-name">{ex.name}</div>
                <div className="example-desc">{ex.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN PICKER */}
      <section className="section" id="design-section">
        <div className="container">
          <div className="section-label">02 &nbsp; Design</div>
          <h2 className="section-h2">Choose your <em>style</em></h2>
          <p className="section-sub">Select one of our curated collections — or go fully bespoke with your own custom design.</p>

          <div className="designs-grid">
            {DESIGNS.map(d => (
              <div
                key={d.id}
                className={`design-card ${selectedDesign === d.id ? 'selected' : ''} ${d.premium ? 'premium-card' : ''}`}
                onClick={() => setSelectedDesign(d.id)}
              >
                {selectedDesign === d.id && (
                  <div className="selected-indicator">
                    <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#1a1510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
                {d.premium && <span className="premium-badge">Bespoke</span>}
                <div className="design-swatch" style={{
                  background: d.premium
                    ? 'repeating-linear-gradient(-45deg, #1a1a1a, #1a1a1a 4px, #222 4px, #222 12px)'
                    : `linear-gradient(135deg, ${d.palette[0]}44 0%, ${d.palette[1]}44 50%, ${d.palette[2]}44 100%)`,
                  border: `1px solid ${d.premium ? '#333' : d.palette[0] + '66'}`,
                }}>
                  <svg viewBox="0 0 200 110" width="100%" height="100%">
                    <rect x="30" y="12" width="140" height="86" rx="4" fill={d.palette[1] || '#f0f0f0'} opacity=".6" stroke={d.palette[0]} strokeWidth="0.8"/>
                    <path d={`M30 12 L100 62 L170 12`} fill="none" stroke={d.palette[0]} strokeWidth="0.8" opacity=".5"/>
                    <circle cx="100" cy="52" r="14" fill={d.palette[0]} opacity=".8"/>
                    <text x="100" y="57" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="10" fill="white">V</text>
                  </svg>
                </div>
                <div className="design-name">{d.name}</div>
                <div className="design-desc">{d.desc}</div>
                {d.premium && <div className="extra-cost">+ €100 on any plan</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN SELECTOR */}
      <section className="section">
        <div className="container">
          <div className="section-label">03 &nbsp; Plan</div>
          <h2 className="section-h2">Simple, honest <em>pricing</em></h2>
          <p className="section-sub">One price per event. No subscriptions, no credits, no surprises.</p>

          <div className="plans-grid">
            {PLANS.map(p => (
              <div
                key={p.id}
                className={`plan-card ${selectedPlan === p.id ? 'selected' : ''} ${p.highlight ? 'highlighted' : ''}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                {p.highlight && <div className="plan-badge">Most popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">€{p.price}</div>
                <div className="plan-guests">Up to {p.guests} guests</div>
                <ul className="plan-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUPLE DETAILS + SUMMARY */}
      <section className="form-section">
        <div className="container">
          <div className="section-label">04 &nbsp; Your details</div>
          <h2 className="section-h2" style={{ fontSize: 'clamp(28px,4vw,44px)', marginBottom: '2.5rem' }}>Tell us about your <em>wedding</em></h2>

          <div className="two-col">
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Partner 1 name</label>
                  <input value={form.partner1} onChange={e => set('partner1', e.target.value)} placeholder="Gon" />
                </div>
                <div className="form-group">
                  <label>Partner 2 name</label>
                  <input value={form.partner2} onChange={e => set('partner2', e.target.value)} placeholder="Anna" />
                </div>
                <div className="form-group">
                  <label>Wedding date</label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Ceremony time</label>
                  <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="Four in the afternoon" />
                </div>
                <div className="form-group">
                  <label>Venue name</label>
                  <input value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Villa Rosales" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Toledo" />
                </div>
                <div className="form-group">
                  <label>RSVP deadline</label>
                  <input type="date" value={form.rsvpDeadline} onChange={e => set('rsvpDeadline', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Your email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div>
              <div className="summary-card">
                <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 500 }}>Your order</div>
                <div className="summary-row">
                  <span className="summary-label">Design</span>
                  <span className="summary-value">{design.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Plan</span>
                  <span className="summary-value">{plan.name} — up to {plan.guests} guests</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Guests added</span>
                  <span className="summary-value">{guestCount > 0 ? `${guestCount} guests` : '—'}</span>
                </div>
                {selectedDesign === 'custom' && (
                  <div className="summary-row">
                    <span className="summary-label">Bespoke design</span>
                    <span className="summary-value">+ €100</span>
                  </div>
                )}
                <div className="summary-row" style={{ paddingTop: '1rem' }}>
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-value">€{totalPrice}</span>
                </div>
                <button
                  className="submit-btn"
                  disabled={!form.partner1 || !form.partner2 || !form.date || !form.venue || !form.email}
                >
                  Create my invitation →
                </button>
                <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
                  Next step: secure payment via Stripe. Your invitation goes live instantly after payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO UPLOAD */}
      <section className="form-section">
        <div className="container-sm">
          <div className="section-label">05 &nbsp; Your photos</div>
          <h2 className="section-h2" style={{ fontSize: 'clamp(28px,4vw,44px)', marginBottom: '.75rem' }}>Add your <em>photos</em></h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: '2.5rem' }}>
            {isCinematica
              ? 'Your photos will appear as a softly animated background behind the invitation card. Guests will see you both as they open it.'
              : 'Photo backgrounds are available on the Cinematica plan.'}
          </p>

          {isCinematica ? (
            <>
              <div className="upload-zone" onClick={() => photoRef.current.click()}>
                <div className="upload-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="6" stroke="#555" strokeWidth="1.5"/><path d="M16 10v12M10 16h12" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="upload-title">Upload couple photos</div>
                <div className="upload-sub">Drag and drop or click — up to 5 photos · JPG, PNG, HEIC</div>
                <input ref={photoRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </div>
              {photos.length > 0 && (
                <div className="photo-previews">
                  {photos.map((src, i) => <img key={i} src={src} className="photo-thumb" alt="" />)}
                </div>
              )}
            </>
          ) : (
            <div className="locked-note">
              <p>Photo backgrounds are only available on the <strong>Cinematica</strong> plan (€179). Upgrade your plan above to unlock this feature.</p>
            </div>
          )}
        </div>
      </section>

      {/* GUEST LIST */}
      <section className="form-section" style={{ borderBottom: 'none' }}>
        <div className="container-sm">
          <div className="section-label">06 &nbsp; Guest list</div>
          <h2 className="section-h2" style={{ fontSize: 'clamp(28px,4vw,44px)', marginBottom: '.75rem' }}>Add your <em>guests</em></h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: '2.5rem' }}>
            We generate one personalised invitation link per guest — "Dear Borja" — automatically. Upload a file or paste names directly.
          </p>

          {/* File upload */}
          <div className="upload-zone" style={{ marginBottom: '1rem' }} onClick={() => guestFileRef.current.click()}>
            <div className="upload-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4v14M8 10l6-6 6 6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20v2a2 2 0 002 2h16a2 2 0 002-2v-2" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="upload-title">{guestFile || 'Upload guest list file'}</div>
            <div className="upload-sub">Excel (.xlsx), CSV, or plain text · One guest per row</div>
            <input ref={guestFileRef} type="file" accept=".xlsx,.csv,.txt" style={{ display: 'none' }} onChange={handleGuestFile} />
          </div>

          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, margin: '1rem 0', letterSpacing: 2, textTransform: 'uppercase' }}>or paste manually</div>

          <div className="form-group">
            <label>Guest names &amp; contacts</label>
            <textarea
              value={guestText}
              onChange={e => setGuestText(e.target.value)}
              placeholder={`Borja García, +34 612 345 678\nMaría López, maria@email.com\nAbuela Carmen`}
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
            <span style={{ fontSize: 12, color: guestCount > 0 ? 'var(--accent)' : 'var(--muted)' }}>
              {guestCount > 0 ? `${guestCount} guest${guestCount !== 1 ? 's' : ''} added` : 'One guest per line — Name, phone or email (optional)'}
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--white)', marginBottom: '.5rem' }}>Vitella</div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Luxury digital invitations · Made in Spain · GDPR compliant</p>
      </footer>
    </>
  )
}
