import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !data) {
    return { notFound: true }
  }

  return { props: { invitation: data } }
}

export default function InvitationPage({ invitation }) {
  const router = useRouter()
  const guestName = router.query.guest || ''

  const [opened, setOpened] = useState(false)
  const [sealCracked, setSealCracked] = useState(false)
  const [flapOpen, setFlapOpen] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [showRsvp, setShowRsvp] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({ attending: '', guests: '1', dietary: '' })
  const [submitting, setSubmitting] = useState(false)

  // Format date nicely
  const dateObj = invitation.date ? new Date(invitation.date + 'T12:00:00') : null
  const dateFormatted = dateObj ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const dateParts = dateObj ? {
    day: dateObj.getDate(),
    month: dateObj.toLocaleDateString('en-GB', { month: 'long' }),
    year: dateObj.getFullYear()
  } : {}

  function openEnvelope() {
    if (opened) return
    setOpened(true)
    setSealCracked(true)
    setTimeout(() => setFlapOpen(true), 400)
    setTimeout(() => spawnConfetti(), 900)
    setTimeout(() => setCardVisible(true), 1300)
  }

  function spawnConfetti() {
    const container = document.getElementById('confetti-root')
    if (!container) return
    const colors = ['#c9a96e', '#8b1a1a', '#f5ead6', '#d4af37', '#ffffff', '#e8c878']
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div')
      const size = 5 + Math.random() * 8
      const color = colors[Math.floor(Math.random() * colors.length)]
      el.style.cssText = `
        position:absolute;top:-20px;left:${Math.random() * 100}%;
        width:${size}px;height:${size}px;background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '1px'};
        animation:fall ${2 + Math.random() * 2}s ease-in ${Math.random() * 1.5}s forwards;
        opacity:0;
      `
      container.appendChild(el)
    }
  }

  async function submitRsvp() {
    if (!rsvpForm.attending) return
    setSubmitting(true)
    await supabase.from('rsvps').insert({
      invitation_slug: invitation.slug,
      guest_name: guestName || 'Guest',
      attending: rsvpForm.attending === 'yes',
      guest_count: parseInt(rsvpForm.guests),
      dietary: rsvpForm.dietary,
      responded_at: new Date().toISOString(),
    })
    setSubmitting(false)
    setRsvpDone(true)
  }

  const rsvpDeadline = invitation.rsvp_deadline
    ? new Date(invitation.rsvp_deadline + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    : ''

  return (
    <>
      <Head>
        <title>{invitation.partner1} &amp; {invitation.partner2} — You're invited</title>
        <meta property="og:title" content={`${invitation.partner1} & ${invitation.partner2} are getting married`} />
        <meta property="og:description" content={`${dateFormatted} · ${invitation.venue_name}, ${invitation.venue_city}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;600&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes fall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(700px) rotate(720deg);opacity:0} }
          @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
          * { box-sizing:border-box; margin:0; padding:0; }
          body { background:#0d0808; }
        `}</style>
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #2c1f0e 0%, #1a0f05 50%, #0d0808 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'Cormorant Garamond, serif', position: 'relative', overflow: 'hidden' }}>

        {/* Confetti container */}
        <div id="confetti-root" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }} />

        {/* Envelope */}
        <div
          onClick={openEnvelope}
          style={{ position: 'relative', width: 'min(320px, 90vw)', height: '225px', cursor: opened ? 'default' : 'pointer', marginBottom: '-16px', zIndex: 2, transition: 'transform 0.3s', flexShrink: 0 }}
        >
          {/* Body */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #f5ead6, #e8d4b0 50%, #d4b88a)', borderRadius: '4px 4px 8px 8px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 49%, #c9a96e22 49.5%, transparent 50%), linear-gradient(225deg, transparent 49%, #c9a96e22 49.5%, transparent 50%)' }} />
          </div>

          {/* Flap */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '125px',
            transformOrigin: 'top center', transformStyle: 'preserve-3d',
            transform: flapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)', zIndex: 3
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #f0e0c0, #e0c898)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          </div>

          {/* Wax seal */}
          <div style={{
            position: 'absolute', top: '80px', left: '50%',
            transform: `translateX(-50%) scale(${sealCracked ? 0 : 1}) rotate(${sealCracked ? '20deg' : '0'})`,
            transition: 'transform 0.6s ease-out', zIndex: 4, width: '56px', height: '56px'
          }}>
            <svg viewBox="0 0 56 56" width="56" height="56" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
              <circle cx="28" cy="28" r="26" fill="#8b1a1a"/>
              <circle cx="28" cy="28" r="22" fill="#a52020"/>
              <circle cx="28" cy="28" r="18" fill="#8b1a1a" stroke="#c94040" strokeWidth="0.5"/>
              <text x="28" y="24" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="9" fill="#f5d0c0">{invitation.partner1[0]}</text>
              <text x="28" y="34" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="7" fill="#c94040">&amp;</text>
              <text x="28" y="42" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="9" fill="#f5d0c0">{invitation.partner2[0]}</text>
              <circle cx="28" cy="28" r="25" fill="none" stroke="#c94040" strokeWidth="0.5" strokeDasharray="3 2"/>
            </svg>
          </div>
        </div>

        {/* Tap hint */}
        {!opened && (
          <p style={{ fontStyle: 'italic', color: '#c9a96e', fontSize: '13px', letterSpacing: '1px', marginBottom: '1rem', animation: 'pulse 2.5s ease-in-out infinite' }}>
            ✦ tap the seal to open ✦
          </p>
        )}

        {/* Invitation card */}
        <div style={{
          width: 'min(300px, 88vw)',
          background: 'linear-gradient(165deg, #fffdf7 0%, #f8f0e0 60%, #f0e5c8 100%)',
          borderRadius: '3px', padding: '2rem 1.75rem', textAlign: 'center',
          position: 'relative', zIndex: 1,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)',
          border: '1px solid #c9a96e44',
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease, transform 1.4s cubic-bezier(0.2,0.8,0.3,1)',
        }}>
          {guestName && (
            <p style={{ fontStyle: 'italic', color: '#9b7a42', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Dear {guestName},
            </p>
          )}

          <div style={{ color: '#8b6914', marginBottom: '6px', letterSpacing: '4px' }}>✦</div>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: '#9b7a42', marginBottom: '14px' }}>
            Together with their families
          </p>

          <div style={{ fontFamily: 'IM Fell English, serif', fontStyle: 'italic', fontSize: 'clamp(32px,8vw,40px)', color: '#2c1a00', lineHeight: 1.1 }}>
            {invitation.partner1}
            <span style={{ display: 'block', fontSize: '20px', color: '#8b6914', margin: '2px 0' }}>&amp;</span>
            {invitation.partner2}
          </div>

          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)', margin: '14px auto' }} />

          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#9b7a42', fontStyle: 'italic', marginBottom: '14px' }}>
            request the honour of your presence
          </p>

          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', color: '#2c1a00', fontWeight: 600, letterSpacing: '2px', marginBottom: '4px' }}>
            {dateParts.day} · {dateParts.month}
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', color: '#8b6914', letterSpacing: '4px', marginBottom: '14px' }}>
            · {dateParts.year} ·
          </p>

          <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, #c9a96e88, transparent)', margin: '0 auto 12px' }} />

          <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#6b4c1a', lineHeight: 1.6, marginBottom: '4px' }}>
            {invitation.venue_name}
          </p>
          <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#6b4c1a', lineHeight: 1.6 }}>
            {invitation.venue_city}
          </p>
          {invitation.ceremony_time && (
            <p style={{ fontStyle: 'italic', fontSize: '12px', color: '#9b7a42', marginTop: '4px' }}>
              {invitation.ceremony_time}
            </p>
          )}

          {rsvpDeadline && (
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: '8px', letterSpacing: '2px', color: '#9b7a42', textTransform: 'uppercase', marginTop: '18px' }}>
              Kindly reply by {rsvpDeadline}
            </p>
          )}

          <button
            onClick={() => setShowRsvp(true)}
            style={{
              marginTop: '14px', padding: '9px 28px',
              border: '1px solid #c9a96e', borderRadius: '1px', background: 'transparent',
              fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '3px',
              textTransform: 'uppercase', color: '#8b6914', cursor: 'pointer'
            }}
          >
            RSVP
          </button>
        </div>

        {/* RSVP Modal overlay */}
        {showRsvp && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,8,5,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
            <div style={{ background: 'linear-gradient(145deg, #fffdf7, #f0e5c8)', borderRadius: '4px', padding: '2rem', width: 'min(300px, 90vw)', textAlign: 'center', border: '1px solid #c9a96e55', position: 'relative' }}>
              <button onClick={() => setShowRsvp(false)} style={{ position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', color: '#c9a96e', fontSize: '18px', cursor: 'pointer' }}>✕</button>

              {rsvpDone ? (
                <>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '3px', color: '#9b7a42', marginBottom: '16px' }}>
                    {rsvpForm.attending === 'yes' ? '✦ See you soon ✦' : '✦ Until next time ✦'}
                  </div>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#8b6914', fontSize: '15px' }}>
                    {rsvpForm.attending === 'yes'
                      ? `Thank you, ${guestName || 'dear friend'}. ${invitation.partner1} & ${invitation.partner2} look forward to celebrating with you.`
                      : `Thank you, ${guestName || 'dear friend'}. You will be missed dearly.`
                    }
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '4px', color: '#9b7a42', marginBottom: '20px' }}>YOUR RESPONSE</div>

                  <input
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9a96e66', background: '#fffdf7', fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#2c1a00', borderRadius: '2px', marginBottom: '10px' }}
                    placeholder={guestName || 'Your name'}
                    defaultValue={guestName}
                  />

                  <select
                    value={rsvpForm.attending}
                    onChange={e => setRsvpForm(p => ({ ...p, attending: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9a96e66', background: '#fffdf7', fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#2c1a00', borderRadius: '2px', marginBottom: '10px' }}
                  >
                    <option value="">Will you attend?</option>
                    <option value="yes">Joyfully accepts ✦</option>
                    <option value="no">Regretfully declines</option>
                  </select>

                  {rsvpForm.attending === 'yes' && (
                    <>
                      <input
                        type="number" min="1" max="10"
                        value={rsvpForm.guests}
                        onChange={e => setRsvpForm(p => ({ ...p, guests: e.target.value }))}
                        placeholder="Number of guests"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9a96e66', background: '#fffdf7', fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#2c1a00', borderRadius: '2px', marginBottom: '10px' }}
                      />
                      <input
                        value={rsvpForm.dietary}
                        onChange={e => setRsvpForm(p => ({ ...p, dietary: e.target.value }))}
                        placeholder="Dietary requirements (optional)"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9a96e66', background: '#fffdf7', fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#2c1a00', borderRadius: '2px', marginBottom: '10px' }}
                      />
                    </>
                  )}

                  <button
                    onClick={submitRsvp}
                    disabled={!rsvpForm.attending || submitting}
                    style={{ width: '100%', padding: '11px', background: '#8b6914', border: 'none', fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#f5ead6', cursor: 'pointer', borderRadius: '2px', marginTop: '6px', opacity: !rsvpForm.attending ? 0.6 : 1 }}
                  >
                    {submitting ? 'Sending...' : 'Send reply'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Vitella watermark */}
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '3px', color: '#c9a96e44', marginTop: '2rem', textAlign: 'center' }}>
          VITELLA
        </p>
      </div>
    </>
  )
}
