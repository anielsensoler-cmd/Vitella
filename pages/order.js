import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const DESIGNS = [
  { id: 'classic-dark', label: 'Classic Dark', description: 'Gold seal on dark parchment — timeless elegance' },
  { id: 'ivory-garden', label: 'Ivory Garden', description: 'Soft ivory tones with botanical accents' },
  { id: 'modern-minimal', label: 'Modern Minimal', description: 'Clean lines, monochrome, contemporary' },
]

const TIERS = [
  { id: 'esencial', label: 'Esencial — €49', maxGuests: 100 },
  { id: 'premium', label: 'Premium — €99', maxGuests: 250 },
  { id: 'cinematica', label: 'Cinematica — €179', maxGuests: 9999 },
]

export default function Order() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slug, setSlug] = useState('')

  const [form, setForm] = useState({
    tier: 'premium',
    partner1: '',
    partner2: '',
    date: '',
    venue_name: '',
    venue_city: '',
    ceremony_time: '',
    rsvp_deadline: '',
    design: 'classic-dark',
    client_email: '',
    guests_raw: '',
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function parseGuests(raw) {
    return raw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(',').map(p => p.trim())
        return { name: parts[0], contact: parts[1] || '' }
      })
  }

  async function submit() {
    setLoading(true)
    setError('')

    try {
      // Generate a unique slug
      const { customAlphabet } = await import('nanoid')
      const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)
      const newSlug = `${form.partner1.toLowerCase().replace(/\s+/g, '')}-${form.partner2.toLowerCase().replace(/\s+/g, '')}-${nanoid()}`

      const guests = parseGuests(form.guests_raw)

      // Save invitation to Supabase
      const { error: invError } = await supabase
        .from('invitations')
        .insert({
          slug: newSlug,
          tier: form.tier,
          partner1: form.partner1,
          partner2: form.partner2,
          date: form.date,
          venue_name: form.venue_name,
          venue_city: form.venue_city,
          ceremony_time: form.ceremony_time,
          rsvp_deadline: form.rsvp_deadline,
          design: form.design,
          client_email: form.client_email,
          guests: guests,
          created_at: new Date().toISOString(),
        })

      if (invError) throw invError

      setSlug(newSlug)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <Head>
        <title>Create your invitation — Vitella</title>
      </Head>

      <div className="page-wrap">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '1rem' }}>
          <a href="/" style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', letterSpacing: '3px', color: '#8b6914', textDecoration: 'none' }}>VITELLA</a>
          <h1 style={{ marginTop: '1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '28px' }}>Create your invitation</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: step >= s ? '#8b6914' : '#ddd',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
        </div>

        {/* STEP 1: Event details */}
        {step === 1 && (
          <div className="card">
            <h2>Event details</h2>

            <label>Your plan</label>
            <select value={form.tier} onChange={e => set('tier', e.target.value)}>
              {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Partner 1 name</label>
                <input value={form.partner1} onChange={e => set('partner1', e.target.value)} placeholder="Gon" />
              </div>
              <div>
                <label>Partner 2 name</label>
                <input value={form.partner2} onChange={e => set('partner2', e.target.value)} placeholder="Anna" />
              </div>
            </div>

            <label>Wedding date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />

            <label>Ceremony time</label>
            <input value={form.ceremony_time} onChange={e => set('ceremony_time', e.target.value)} placeholder="Four in the afternoon" />

            <label>Venue name</label>
            <input value={form.venue_name} onChange={e => set('venue_name', e.target.value)} placeholder="Villa Rosales" />

            <label>Venue city</label>
            <input value={form.venue_city} onChange={e => set('venue_city', e.target.value)} placeholder="Toledo" />

            <label>RSVP deadline</label>
            <input type="date" value={form.rsvp_deadline} onChange={e => set('rsvp_deadline', e.target.value)} />

            <label>Your email (to receive RSVP updates)</label>
            <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} placeholder="you@email.com" />

            <div style={{ marginTop: '1.5rem' }}>
              <button
                className="btn"
                disabled={!form.partner1 || !form.partner2 || !form.date || !form.venue_name}
                onClick={() => setStep(2)}
                style={{ width: '100%' }}
              >
                Next: Choose design →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Design + guest list */}
        {step === 2 && (
          <div className="card">
            <h2>Design &amp; guests</h2>

            <label>Choose your design</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
              {DESIGNS.map(d => (
                <label key={d.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px',
                  border: `1px solid ${form.design === d.id ? '#8b6914' : '#ddd'}`,
                  borderRadius: '8px', cursor: 'pointer', background: form.design === d.id ? '#fdf6e3' : 'white',
                  marginTop: 0
                }}>
                  <input type="radio" name="design" value={d.id} checked={form.design === d.id} onChange={() => set('design', d.id)} style={{ width: 'auto', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{d.label}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{d.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <label>
              Guest list
              <span style={{ fontWeight: 400, color: '#888', marginLeft: '8px' }}>one per line — Name, phone/email (optional)</span>
            </label>
            <textarea
              value={form.guests_raw}
              onChange={e => set('guests_raw', e.target.value)}
              placeholder={`Borja, +34 612 345 678\nMaría García, maria@email.com\nAbuela Carmen`}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
            <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
              {parseGuests(form.guests_raw).length} guests added
              {form.tier === 'esencial' && parseGuests(form.guests_raw).length > 100 && (
                <span style={{ color: '#c0392b' }}> — Esencial plan is limited to 100 guests</span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
              <button
                className="btn"
                onClick={submit}
                disabled={loading || form.guests_raw.trim() === ''}
                style={{ flex: 2 }}
              >
                {loading ? 'Creating...' : 'Create invitation ✦'}
              </button>
            </div>

            {error && <div className="alert-error">{error}</div>}
          </div>
        )}

        {/* STEP 3: Done — show links */}
        {step === 3 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✦</div>
            <h2>Your invitation is live</h2>
            <p style={{ marginBottom: '2rem' }}>
              Share the link below with each guest. Each one has their name personalised automatically.
            </p>

            <div style={{ background: '#fdf6e3', border: '1px solid #c9a96e55', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#8b6914', marginBottom: '6px', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>BASE LINK</div>
              <code style={{ fontSize: '13px', wordBreak: 'break-all', color: '#2c1a00' }}>
                {baseUrl}/i/{slug}
              </code>
            </div>

            <div style={{ background: '#fdf6e3', border: '1px solid #c9a96e55', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#8b6914', marginBottom: '6px', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>PERSONALISED EXAMPLE</div>
              <code style={{ fontSize: '13px', wordBreak: 'break-all', color: '#2c1a00' }}>
                {baseUrl}/i/{slug}?guest=Borja
              </code>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>Replace "Borja" with each guest's name. The invitation will greet them personally.</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={`/i/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Preview invitation
              </a>
              <a
                href={`/dashboard?slug=${slug}`}
                className="btn btn-outline"
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                View dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
