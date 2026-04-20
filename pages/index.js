import { useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const DESIGNS = [
  { id: 'botanical', name: 'White Botanical', desc: 'Soft florals, watercolour washes, garden wedding elegance.', palette: ['#7a9a6a','#f0ece5','#d8c8a8'] },
  { id: 'blue', name: 'Blue Floral', desc: 'Monochromatic navy, bold editorial type, graphic impact.', palette: ['#1e3060','#d8e4f8','#4a6aaa'] },
  { id: 'pressed', name: 'Pressed Wildflowers', desc: 'Scattered botanicals, ultra-thin type, pure white paper.', palette: ['#9a80b0','#e8b820','#5a7a48'] },
  { id: 'custom', name: 'Design your own', desc: 'Work with our team to create something completely bespoke.', palette: ['#8a9e78','#c8d8c0','#6a8858'], premium: true },
]

const PLANS = [
  { id: 'esencial', name: 'Esencial', price: 49, guests: '100', features: ['1 design template','Personalised links per guest','RSVP tracking','Shareable link delivery'] },
  { id: 'premium', name: 'Premium', price: 99, guests: '250', features: ['All 3 design templates','Guest personalisation','WhatsApp & email delivery','Live RSVP dashboard'], highlight: true },
  { id: 'cinematica', name: 'Cinematica', price: 179, guests: 'Unlimited', features: ['Everything in Premium','Couple photo background','Ambient music','Priority support'] },
]

export default function Home() {
  const router = useRouter()
  const [selectedDesign, setSelectedDesign] = useState('botanical')
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [photos, setPhotos] = useState([])
  const [guestText, setGuestText] = useState('')
  const [guestFile, setGuestFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ partner1:'', partner2:'', date:'', time:'', venue:'', city:'', rsvpDeadline:'', email:'' })
  const photoRef = useRef()
  const guestFileRef = useRef()

  const setF = (k,v) => setForm(p=>({...p,[k]:v}))
  const parseGuests = (raw) => raw.split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{ const p=line.split(',').map(x=>x.trim()); return {name:p[0],contact:p[1]||''} })
  const guestCount = parseGuests(guestText).length
  const plan = PLANS.find(p=>p.id===selectedPlan)
  const design = DESIGNS.find(d=>d.id===selectedDesign)
  const totalPrice = plan.price + (selectedDesign==='custom'?100:0)
  const isCinematica = selectedPlan==='cinematica'
  const isValid = form.partner1 && form.partner2 && form.date && form.venue && form.email

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files||[])
    const previews = files.slice(0,5).map(f=>URL.createObjectURL(f))
    setPhotos(prev=>[...prev,...previews].slice(0,5))
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true); setError('')
    try {
      const { customAlphabet } = await import('nanoid')
      const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789',8)
      const slug = `${form.partner1.toLowerCase().replace(/\s+/g,'')}-${form.partner2.toLowerCase().replace(/\s+/g,'')}-${nanoid()}`
      const guests = parseGuests(guestText)
      const { error: err } = await supabase.from('invitations').insert({
        slug, tier: selectedPlan, partner1: form.partner1, partner2: form.partner2,
        date: form.date, venue_name: form.venue, venue_city: form.city,
        ceremony_time: form.time, rsvp_deadline: form.rsvpDeadline,
        design: selectedDesign, client_email: form.email, guests,
        created_at: new Date().toISOString(),
      })
      if (err) throw err
      router.push(`/dashboard?slug=${slug}`)
    } catch(e) { setError(e.message||'Something went wrong. Please try again.'); setLoading(false) }
  }

  return (
    <>
      <Head>
        <title>Vitella — Luxury digital invitations</title>
        <meta name="description" content="Cinematic digital wedding invitations. A link. A wax seal. A moment they will never forget." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#f7f4ee;--bg2:#f0ece2;--card:#faf8f3;
          --border:#e0d8cc;--border2:#ccc4b4;
          --text:#2a2820;--muted:#7a7468;--muted2:#a09888;
          --green:#6a8a58;--green2:#557848;
          --green-bg:#edf2e8;--green-lt:#dde8d5;
          --font:'DM Sans',system-ui,sans-serif;
          --serif:'DM Serif Display',Georgia,serif;
        }
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--text);font-family:var(--font);line-height:1.6;}
        .wrap{max-width:1100px;margin:0 auto;padding:0 2rem;}
        .wrap-sm{max-width:720px;margin:0 auto;padding:0 2rem;}
        nav{position:sticky;top:0;z-index:100;background:rgba(247,244,238,.93);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:1.1rem 2rem;display:flex;align-items:center;justify-content:space-between;}
        .logo{font-family:var(--serif);font-size:20px;color:var(--text);}
        .nav-btn{padding:8px 20px;background:var(--green);color:#fff;border:none;border-radius:6px;font-family:var(--font);font-size:13px;font-weight:500;cursor:pointer;transition:background .2s;}
        .nav-btn:hover{background:var(--green2);}
        .hero{padding:130px 2rem 110px;text-align:center;border-bottom:1px solid var(--border);background:linear-gradient(160deg,#f7f4ee 0%,#edf2e8 60%,#f0ece2 100%);position:relative;overflow:hidden;}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(106,138,88,.1) 0%,transparent 70%);pointer-events:none;}
        .hero-tag{display:inline-block;padding:5px 14px;border:1px solid var(--border2);border-radius:20px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:2.5rem;background:var(--card);}
        h1{font-family:var(--serif);font-size:clamp(46px,7vw,88px);font-weight:400;line-height:1.04;color:var(--text);letter-spacing:-.5px;margin-bottom:2rem;}
        h1 em{font-style:italic;color:var(--green);}
        .hero-sub{font-size:clamp(15px,2vw,19px);color:var(--muted);font-weight:300;max-width:520px;margin:0 auto 3rem;line-height:1.7;}
        .hero-btn{padding:16px 40px;background:var(--green);color:#fff;border:none;border-radius:8px;font-family:var(--font);font-size:15px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s;}
        .hero-btn:hover{background:var(--green2);transform:translateY(-2px);}
        .hero-scroll{margin-top:4rem;color:var(--muted2);font-size:11px;letter-spacing:3px;text-transform:uppercase;}
        .sec{padding:90px 0;border-bottom:1px solid var(--border);}
        .sec-lbl{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--muted2);margin-bottom:1.5rem;display:flex;align-items:center;gap:12px;}
        .sec-lbl::after{content:'';flex:1;height:1px;background:var(--border);max-width:60px;}
        h2{font-family:var(--serif);font-size:clamp(32px,5vw,56px);font-weight:400;line-height:1.1;color:var(--text);margin-bottom:1rem;letter-spacing:-.3px;}
        h2 em{font-style:italic;color:var(--green);}
        .sec-sub{font-size:17px;color:var(--muted);font-weight:300;max-width:500px;margin-bottom:3.5rem;}
        .ex-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
        .ex-card{background:var(--card);padding:2.5rem 2rem;}
        .ex-num{font-size:11px;letter-spacing:3px;color:var(--muted2);text-transform:uppercase;margin-bottom:1.5rem;}
        .ex-preview{height:185px;border-radius:10px;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);}
        .ex-name{font-family:var(--serif);font-size:20px;color:var(--text);margin-bottom:.25rem;}
        .ex-desc{font-size:13px;color:var(--muted);}
        .d-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;}
        .d-card{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:1.5rem;cursor:pointer;transition:border-color .2s,transform .2s,box-shadow .2s;position:relative;}
        .d-card:hover{border-color:var(--border2);transform:translateY(-3px);box-shadow:0 8px 24px rgba(106,138,88,.1);}
        .d-card.sel{border-color:var(--green);box-shadow:0 0 0 3px rgba(106,138,88,.12);}
        .d-card.bespoke{border-style:dashed;}
        .d-swatch{height:108px;border-radius:8px;margin-bottom:1.25rem;overflow:hidden;}
        .d-name{font-size:15px;font-weight:500;color:var(--text);margin-bottom:.25rem;}
        .d-desc{font-size:12px;color:var(--muted);line-height:1.5;}
        .d-badge{position:absolute;top:12px;right:12px;background:var(--green);color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase;}
        .d-extra{font-size:11px;color:var(--green);margin-top:.5rem;font-weight:500;}
        .d-check{position:absolute;top:12px;left:12px;width:20px;height:20px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;}
        .p-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;}
        .p-card{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:2rem 1.5rem;cursor:pointer;transition:border-color .2s,box-shadow .2s;position:relative;}
        .p-card:hover{border-color:var(--border2);}
        .p-card.sel{border-color:var(--green);box-shadow:0 0 0 3px rgba(106,138,88,.12);}
        .p-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;padding:4px 14px;border-radius:0 0 8px 8px;text-transform:uppercase;white-space:nowrap;}
        .p-name{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:1rem;}
        .p-price{font-family:var(--serif);font-size:50px;color:var(--text);line-height:1;margin-bottom:.25rem;}
        .p-guests{font-size:12px;color:var(--muted);margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border);}
        .p-feats{list-style:none;}
        .p-feats li{font-size:13px;color:var(--text);padding:.4rem 0;display:flex;align-items:center;gap:8px;}
        .p-feats li::before{content:'✓';color:var(--green);font-weight:700;font-size:12px;}
        .fsec{padding:80px 0;border-bottom:1px solid var(--border);}
        .f-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .fg{display:flex;flex-direction:column;gap:7px;}
        label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:500;}
        input,select,textarea{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:13px 15px;font-family:var(--font);font-size:15px;color:var(--text);outline:none;width:100%;transition:border-color .2s;-webkit-appearance:none;}
        input::placeholder,textarea::placeholder{color:var(--muted2);}
        input:focus,select:focus,textarea:focus{border-color:var(--green);}
        textarea{min-height:120px;resize:vertical;}
        .two-col{display:grid;grid-template-columns:1fr 340px;gap:4rem;align-items:start;}
        .sum-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:2.5rem;position:sticky;top:90px;}
        .sum-ttl{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:1.5rem;font-weight:500;}
        .sum-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--border);}
        .sum-lbl{font-size:13px;color:var(--muted);}
        .sum-val{font-size:13px;color:var(--text);font-weight:500;text-align:right;max-width:180px;}
        .sum-tot-l{font-size:16px;font-weight:600;color:var(--text);}
        .sum-tot-v{font-family:var(--serif);font-size:28px;color:var(--green2);}
        .sub-btn{width:100%;padding:16px;background:var(--green);color:#fff;border:none;border-radius:8px;font-family:var(--font);font-size:15px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s;margin-top:1.5rem;}
        .sub-btn:hover:not(:disabled){background:var(--green2);transform:translateY(-1px);}
        .sub-btn:disabled{opacity:.45;cursor:not-allowed;}
        .err{font-size:13px;color:#c04040;margin-top:.75rem;text-align:center;}
        .up-zone{border:2px dashed var(--border2);border-radius:12px;padding:2.5rem;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;background:var(--card);}
        .up-zone:hover{border-color:var(--green);background:var(--green-bg);}
        .up-title{font-size:15px;font-weight:500;color:var(--text);margin-bottom:.25rem;margin-top:.75rem;}
        .up-sub{font-size:13px;color:var(--muted);}
        .ph-wrap{display:flex;gap:8px;flex-wrap:wrap;margin-top:1rem;}
        .ph-thumb{width:72px;height:72px;border-radius:8px;object-fit:cover;border:1px solid var(--border);}
        .locked{background:var(--green-bg);border:1px solid var(--green-lt);border-radius:10px;padding:1.5rem;}
        .locked p{font-size:14px;color:var(--muted);}
        .locked strong{color:var(--green2);}
        @media(max-width:900px){.two-col{grid-template-columns:1fr;}.sum-card{position:static;}.f-grid{grid-template-columns:1fr;}.hero{padding:90px 1.5rem 70px;}}
        @media(max-width:600px){.d-grid,.p-grid{grid-template-columns:1fr 1fr;}.ex-grid{grid-template-columns:1fr;}}
      `}</style>

      <nav>
        <div className="logo">Vitella</div>
        <button className="nav-btn" onClick={()=>document.getElementById('ds').scrollIntoView({behavior:'smooth'})}>Create invitation</button>
      </nav>

      <section className="hero">
        <div className="hero-tag">Digital wedding invitations</div>
        <h1>Invitations that feel<br/>like <em>opening a gift</em></h1>
        <p className="hero-sub">A link. A wax seal. A moment your guests will remember. No app, no login — just beauty on any device.</p>
        <button className="hero-btn" onClick={()=>document.getElementById('ds').scrollIntoView({behavior:'smooth'})}>Create your invitation →</button>
        <div className="hero-scroll">↓ &nbsp; scroll to see examples</div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-lbl">01 &nbsp; How it works</div>
          <h2>What your guests <em>receive</em></h2>
          <p className="sec-sub">A personal link. They tap it, the wax seal breaks, an envelope opens, confetti fires, and your invitation card slides into view.</p>
          <div className="ex-grid">
            {[{num:'01',name:'White Botanical',desc:'Soft florals & watercolour',bg:'linear-gradient(135deg,#f0ece5,#e8dcc8)',ac:'#7a9a6a',tc:'#3a3028'},{num:'02',name:'Blue Floral',desc:'Monochromatic navy editorial',bg:'linear-gradient(135deg,#d8e4f8,#c0d0f0)',ac:'#1e3060',tc:'#1e3060'},{num:'03',name:'Pressed Wildflowers',desc:'Scattered botanicals, pure white',bg:'linear-gradient(135deg,#fdfcf9,#f5f3ee)',ac:'#9a80b0',tc:'#1a1a16'}].map(ex=>(
              <div className="ex-card" key={ex.num}>
                <div className="ex-num">{ex.num}</div>
                <div className="ex-preview" style={{background:ex.bg}}>
                  <svg viewBox="0 0 160 110" width="140" height="96">
                    <rect x="5" y="15" width="150" height="90" rx="4" fill="white" stroke={ex.ac} strokeWidth="1" opacity=".9"/>
                    <path d="M5 15 L80 70 L155 15" fill="none" stroke={ex.ac} strokeWidth="1" opacity=".4"/>
                    <circle cx="80" cy="58" r="14" fill={ex.ac} opacity=".85"/>
                    <text x="80" y="63" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="10" fill="white">V</text>
                    <text x="80" y="92" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill={ex.tc} opacity=".4">tap to open</text>
                  </svg>
                </div>
                <div className="ex-name">{ex.name}</div>
                <div className="ex-desc">{ex.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="ds" style={{background:'linear-gradient(180deg,var(--bg) 0%,var(--green-bg) 100%)'}}>
        <div className="wrap">
          <div className="sec-lbl">02 &nbsp; Design</div>
          <h2>Choose your <em>style</em></h2>
          <p className="sec-sub">Select one of our curated collections — or go fully bespoke with your own custom design.</p>
          <div className="d-grid">
            {DESIGNS.map(d=>(
              <div key={d.id} className={`d-card${selectedDesign===d.id?' sel':''}${d.premium?' bespoke':''}`} onClick={()=>setSelectedDesign(d.id)}>
                {selectedDesign===d.id&&<div className="d-check"><svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                {d.premium&&<span className="d-badge">Bespoke</span>}
                <div className="d-swatch" style={{background:d.premium?'repeating-linear-gradient(-45deg,#edf2e8,#edf2e8 4px,#dde8d5 4px,#dde8d5 12px)':`linear-gradient(135deg,${d.palette[0]}55,${d.palette[1]}88,${d.palette[2]}44)`,border:`1px solid ${d.palette[0]}66`}}>
                  <svg viewBox="0 0 200 108" width="100%" height="100%">
                    <rect x="30" y="12" width="140" height="84" rx="4" fill={d.palette[1]} opacity=".7" stroke={d.palette[0]} strokeWidth="0.8"/>
                    <path d="M30 12 L100 60 L170 12" fill="none" stroke={d.palette[0]} strokeWidth="0.8" opacity=".5"/>
                    <circle cx="100" cy="50" r="14" fill={d.palette[0]} opacity=".8"/>
                    <text x="100" y="55" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="10" fill="white">V</text>
                  </svg>
                </div>
                <div className="d-name">{d.name}</div>
                <div className="d-desc">{d.desc}</div>
                {d.premium&&<div className="d-extra">+ €100 on any plan</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-lbl">03 &nbsp; Plan</div>
          <h2>Simple, honest <em>pricing</em></h2>
          <p className="sec-sub">One price per event. No subscriptions, no credits, no surprises.</p>
          <div className="p-grid">
            {PLANS.map(p=>(
              <div key={p.id} className={`p-card${selectedPlan===p.id?' sel':''}`} onClick={()=>setSelectedPlan(p.id)}>
                {p.highlight&&<div className="p-badge">Most popular</div>}
                <div className="p-name">{p.name}</div>
                <div className="p-price">€{p.price}</div>
                <div className="p-guests">Up to {p.guests} guests</div>
                <ul className="p-feats">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fsec">
        <div className="wrap">
          <div className="sec-lbl">04 &nbsp; Your details</div>
          <h2 style={{fontSize:'clamp(26px,4vw,42px)',marginBottom:'2.5rem'}}>Tell us about your <em>wedding</em></h2>
          <div className="two-col">
            <div>
              <div className="f-grid">
                {[['partner1','Partner 1 name','Gon'],['partner2','Partner 2 name','Anna'],['date','Wedding date','date'],['time','Ceremony time','Four in the afternoon'],['venue','Venue name','Villa Rosales'],['city','City','Toledo'],['rsvpDeadline','RSVP deadline','date'],['email','Your email','you@email.com']].map(([k,lbl,ph])=>(
                  <div className="fg" key={k}>
                    <label>{lbl}</label>
                    <input type={ph==='date'?'date':k==='email'?'email':'text'} value={form[k]} onChange={e=>setF(k,e.target.value)} placeholder={ph!=='date'?ph:undefined}/>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="sum-card">
                <div className="sum-ttl">Your order</div>
                <div className="sum-row"><span className="sum-lbl">Design</span><span className="sum-val">{design.name}</span></div>
                <div className="sum-row"><span className="sum-lbl">Plan</span><span className="sum-val">{plan.name} · {plan.guests} guests</span></div>
                <div className="sum-row"><span className="sum-lbl">Guests</span><span className="sum-val">{guestCount>0?`${guestCount} guests`:'—'}</span></div>
                {selectedDesign==='custom'&&<div className="sum-row"><span className="sum-lbl">Bespoke design</span><span className="sum-val">+ €100</span></div>}
                <div className="sum-row" style={{paddingTop:'1rem'}}><span className="sum-tot-l">Total</span><span className="sum-tot-v">€{totalPrice}</span></div>
                <button className="sub-btn" disabled={!isValid||loading} onClick={handleSubmit}>{loading?'Creating...':'Create my invitation →'}</button>
                {error&&<div className="err">{error}</div>}
                {!isValid&&<p style={{fontSize:11,color:'var(--muted)',textAlign:'center',marginTop:'.75rem',lineHeight:1.6}}>Fill in partner names, date, venue and email to continue.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fsec" style={{background:'linear-gradient(180deg,var(--bg) 0%,var(--green-bg) 100%)'}}>
        <div className="wrap-sm">
          <div className="sec-lbl">05 &nbsp; Your photos</div>
          <h2 style={{fontSize:'clamp(24px,4vw,40px)',marginBottom:'.75rem'}}>Add your <em>photos</em></h2>
          <p style={{fontSize:15,color:'var(--muted)',marginBottom:'2.5rem'}}>{isCinematica?'Your photos appear as a softly animated background behind the card. Guests will see you both as they open it.':'Photo backgrounds are available on the Cinematica plan only.'}</p>
          {isCinematica?(
            <>
              <div className="up-zone" onClick={()=>photoRef.current.click()}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="6" stroke="var(--border2)" strokeWidth="1.5"/><path d="M16 10v12M10 16h12" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div className="up-title">Upload couple photos</div>
                <div className="up-sub">Drag and drop or click · up to 5 photos · JPG, PNG, HEIC</div>
                <input ref={photoRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handlePhotoUpload}/>
              </div>
              {photos.length>0&&<div className="ph-wrap">{photos.map((src,i)=><img key={i} src={src} className="ph-thumb" alt=""/>)}</div>}
            </>
          ):(
            <div className="locked"><p>Photo backgrounds are only available on the <strong>Cinematica</strong> plan (€179). Select it above to unlock.</p></div>
          )}
        </div>
      </section>

      <section className="fsec" style={{borderBottom:'none'}}>
        <div className="wrap-sm">
          <div className="sec-lbl">06 &nbsp; Guest list</div>
          <h2 style={{fontSize:'clamp(24px,4vw,40px)',marginBottom:'.75rem'}}>Add your <em>guests</em></h2>
          <p style={{fontSize:15,color:'var(--muted)',marginBottom:'2.5rem'}}>We generate one personalised invitation link per guest automatically. Upload a file or paste names directly.</p>
          <div className="up-zone" style={{marginBottom:'1rem'}} onClick={()=>guestFileRef.current.click()}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4v14M8 10l6-6 6 6" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20v2a2 2 0 002 2h16a2 2 0 002-2v-2" stroke="var(--border2)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <div className="up-title">{guestFile||'Upload guest list file'}</div>
            <div className="up-sub">Excel (.xlsx), CSV, or plain text · One guest per row</div>
            <input ref={guestFileRef} type="file" accept=".xlsx,.csv,.txt" style={{display:'none'}} onChange={e=>setGuestFile(e.target.files[0]?.name)}/>
          </div>
          <div style={{textAlign:'center',color:'var(--muted2)',fontSize:12,margin:'1rem 0',letterSpacing:2,textTransform:'uppercase'}}>or paste manually</div>
          <div className="fg">
            <label>Guest names &amp; contacts</label>
            <textarea value={guestText} onChange={e=>setGuestText(e.target.value)} placeholder={"Borja García, +34 612 345 678\nMaría López, maria@email.com\nAbuela Carmen"} style={{fontFamily:'monospace',fontSize:13}}/>
            <span style={{fontSize:12,color:guestCount>0?'var(--green)':'var(--muted2)'}}>{guestCount>0?`${guestCount} guest${guestCount!==1?'s':''} added`:'One per line — Name, phone or email (optional)'}</span>
          </div>
        </div>
      </section>

      <footer style={{padding:'3rem 2rem',borderTop:'1px solid var(--border)',textAlign:'center',background:'var(--bg2)'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:18,color:'var(--text)',marginBottom:'.5rem'}}>Vitella</div>
        <p style={{fontSize:13,color:'var(--muted)'}}>Luxury digital invitations · Made in Spain · GDPR compliant</p>
      </footer>
    </>
  )
}
