import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [opened, setOpened] = useState(false)
  const [sealCracked, setSealCracked] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)

  function openEnvelope() {
    if (opened) return
    setOpened(true)
    setSealCracked(true)
    setTimeout(() => setCardVisible(true), 1400)
  }

  return (
    <>
      <Head>
        <title>Vitella — Luxury digital invitations</title>
        <meta name="description" content="Cinematic digital wedding invitations sent by link. No app needed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: '#1a0f05', color: '#f5ead6', textAlign: 'center', padding: '4rem 1.5rem 3rem' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '4px', color: '#c9a96e', marginBottom: '16px' }}>
            VITELLA
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 300, color: '#f5ead6', lineHeight: 1.1, marginBottom: '16px' }}>
            Invitations that feel<br />like opening a gift
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#c9a96e', fontStyle: 'italic', marginBottom: '2.5rem' }}>
            A link. A wax seal. A moment they'll remember.
          </p>
          <Link href="/order" className="btn" style={{ fontFamily: 'Cinzel, serif', fontSize: '12px', letterSpacing: '2px', padding: '14px 36px' }}>
            Create your invitation
          </Link>
        </div>

        {/* Demo envelope */}
        <div style={{ background: '#0d0808', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#c9a96e', fontSize: '14px', marginBottom: '2rem', letterSpacing: '1px' }}>
            ✦ tap the seal to see the experience ✦
          </p>

          {/* Envelope */}
          <div onClick={openEnvelope} style={{ position: 'relative', width: '300px', height: '210px', cursor: opened ? 'default' : 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #f5ead6, #d4b88a)', borderRadius: '4px 4px 8px 8px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '115px',
              transformOrigin: 'top center',
              transform: opened ? 'rotateX(-180deg)' : 'rotateX(0)',
              transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)',
              transformStyle: 'preserve-3d',
              zIndex: 3
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #f0e0c0, #e0c898)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
            </div>
            {/* Wax seal */}
            <div style={{
              position: 'absolute', top: '75px', left: '50%', transform: `translateX(-50%) ${sealCracked ? 'scale(0) rotate(20deg)' : 'scale(1)'}`,
              transition: 'transform 0.6s ease-out', zIndex: 4, width: '50px', height: '50px'
            }}>
              <svg viewBox="0 0 56 56" width="50" height="50">
                <circle cx="28" cy="28" r="26" fill="#8b1a1a"/>
                <circle cx="28" cy="28" r="20" fill="#a52020"/>
                <text x="28" y="32" textAnchor="middle" fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="14" fill="#f5d0c0">V</text>
                <circle cx="28" cy="28" r="25" fill="none" stroke="#c94040" strokeWidth="0.5" strokeDasharray="3 2"/>
              </svg>
            </div>
          </div>

          {/* Card slides up */}
          <div style={{
            width: '280px', background: 'linear-gradient(165deg, #fffdf7, #f0e5c8)',
            borderRadius: '3px', padding: '2.5rem 2rem', textAlign: 'center',
            marginTop: '-16px', zIndex: 2, position: 'relative',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease, transform 1.4s cubic-bezier(0.2,0.8,0.3,1)',
            border: '1px solid #c9a96e33'
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '12px', fontStyle: 'italic', color: '#9b7a42', marginBottom: '10px' }}>Together with their families</div>
            <div style={{ fontFamily: 'IM Fell English, serif', fontStyle: 'italic', fontSize: '34px', color: '#2c1a00', lineHeight: 1.1 }}>
              Gon<span style={{ fontSize: '18px', color: '#8b6914', display: 'block', margin: '2px 0' }}>&amp;</span>Anna
            </div>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)', margin: '14px auto' }} />
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#2c1a00', fontWeight: 600, letterSpacing: '2px' }}>15 · July · 2025</div>
            <div style={{ marginTop: '10px', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '13px', color: '#6b4c1a' }}>Villa Rosales, Toledo</div>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, marginBottom: '8px' }}>Simple pricing</h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '3rem' }}>One price per event. No subscriptions, no credits, no surprises.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Esencial', price: '€49', guests: 'Up to 100 guests', features: ['1 design template', 'RSVP tracking', 'Shareable link'] },
              { name: 'Premium', price: '€99', guests: 'Up to 250 guests', features: ['All designs', 'Photo gallery', 'Guest personalisation', 'WhatsApp delivery'], highlight: true },
              { name: 'Cinematica', price: '€179', guests: 'Unlimited guests', features: ['Everything in Premium', 'Video background', 'Music', 'Live dashboard', 'Priority support'] },
            ].map(tier => (
              <div key={tier.name} style={{
                background: 'white', border: tier.highlight ? '2px solid #8b6914' : '1px solid #e5e5e3',
                borderRadius: '12px', padding: '1.5rem', position: 'relative'
              }}>
                {tier.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#8b6914', color: 'white', fontSize: '11px', padding: '3px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Most popular</div>}
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: '#8b6914', marginBottom: '8px' }}>{tier.name}</div>
                <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px' }}>{tier.price}</div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>{tier.guests}</div>
                <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2 }}>
                  {tier.features.map(f => <li key={f} style={{ color: '#444' }}>✦ {f}</li>)}
                </ul>
                <Link href="/order" className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', background: tier.highlight ? '#8b6914' : 'transparent', color: tier.highlight ? 'white' : '#8b6914', border: '1px solid #8b6914', textDecoration: 'none', padding: '10px' }}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e5e3', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#888', fontSize: '14px' }}>Vitella · Luxury digital invitations · Made in Spain</p>
        </div>
      </div>
    </>
  )
}
