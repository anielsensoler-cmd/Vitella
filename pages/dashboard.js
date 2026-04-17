import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const { slug } = router.query

  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPw, setWrongPw] = useState(false)
  const [invitation, setInvitation] = useState(null)
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const CORRECT_PW = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'vitella2024'

  function login() {
    if (password === CORRECT_PW) {
      setAuthed(true)
      loadData()
    } else {
      setWrongPw(true)
    }
  }

  async function loadData() {
    if (!slug) return
    setLoading(true)

    const { data: inv } = await supabase
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .single()

    const { data: rsvpData } = await supabase
      .from('rsvps')
      .select('*')
      .eq('invitation_slug', slug)
      .order('responded_at', { ascending: false })

    setInvitation(inv)
    setRsvps(rsvpData || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authed && slug) loadData()
  }, [slug, authed])

  // Live updates via Supabase realtime
  useEffect(() => {
    if (!authed || !slug) return
    const channel = supabase
      .channel('rsvps-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps', filter: `invitation_slug=eq.${slug}` },
        payload => setRsvps(prev => [payload.new, ...prev])
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [authed, slug])

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const attending = rsvps.filter(r => r.attending)
  const declined = rsvps.filter(r => !r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0)

  function copyLink(name = '') {
    const url = `${baseUrl}/i/${slug}${name ? `?guest=${encodeURIComponent(name)}` : ''}`
    navigator.clipboard.writeText(url)
    setCopied(name || 'base')
    setTimeout(() => setCopied(''), 2000)
  }

  if (!authed) {
    return (
      <>
        <Head><title>Dashboard — Vitella</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8', padding: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #e5e5e3', borderRadius: '12px', padding: '2rem', width: 'min(360px, 100%)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '3px', color: '#8b6914', marginBottom: '1.5rem' }}>VITELLA</p>
            <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem' }}>Enter your password to view RSVPs</p>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setWrongPw(false) }}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${wrongPw ? '#fca5a5' : '#ddd'}`, borderRadius: '8px', fontSize: '15px', marginBottom: '12px', outline: 'none' }}
            />
            {wrongPw && <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '8px' }}>Incorrect password</p>}
            <button onClick={login} style={{ width: '100%', padding: '12px', background: '#8b6914', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
              Enter
            </button>
          </div>
        </div>
      </>
    )
  }

  if (loading || !invitation) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Head><title>{invitation.partner1} & {invitation.partner2} — Dashboard</title></Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '3px', color: '#8b6914' }}>VITELLA · DASHBOARD</p>
          <h1 style={{ fontSize: '26px', fontWeight: 500, marginTop: '8px' }}>{invitation.partner1} &amp; {invitation.partner2}</h1>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>{invitation.venue_name}, {invitation.venue_city} · {invitation.date}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
          {[
            { label: 'Total guests', value: invitation.guests?.length || 0, color: '#1a1a1a' },
            { label: 'RSVPed', value: rsvps.length, color: '#1a1a1a' },
            { label: 'Attending', value: attending.length, color: '#065f46' },
            { label: 'Declined', value: declined.length, color: '#991b1b' },
            { label: 'Total seats', value: totalGuests, color: '#1a1a1a' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#f5f5f3', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 600, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Guest links */}
        <div style={{ background: 'white', border: '1px solid #e5e5e3', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>Guest links</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.25rem' }}>Click to copy each personalised link, then paste into WhatsApp or email.</p>

          {/* Base link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#fdf6e3', border: '1px solid #c9a96e44', borderRadius: '8px', marginBottom: '8px' }}>
            <code style={{ flex: 1, fontSize: '12px', color: '#2c1a00', wordBreak: 'break-all' }}>{baseUrl}/i/{slug}</code>
            <button onClick={() => copyLink()} style={{ padding: '5px 12px', background: '#8b6914', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {copied === 'base' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Per-guest links */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {(invitation.guests || []).map((guest, i) => {
              const rsvp = rsvps.find(r => r.guest_name?.toLowerCase() === guest.name?.toLowerCase())
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderBottom: '1px solid #f0f0ee' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{guest.name}</div>
                    {guest.contact && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guest.contact}</div>}
                  </div>
                  <div style={{ minWidth: '60px', textAlign: 'center' }}>
                    {rsvp ? (
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: rsvp.attending ? '#ecfdf5' : '#fef2f2', color: rsvp.attending ? '#065f46' : '#991b1b' }}>
                        {rsvp.attending ? 'Coming' : 'Declined'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#bbb' }}>Pending</span>
                    )}
                  </div>
                  <button
                    onClick={() => copyLink(guest.name)}
                    style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', color: '#555' }}
                  >
                    {copied === guest.name ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* RSVP list */}
        <div style={{ background: 'white', border: '1px solid #e5e5e3', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>RSVPs received ({rsvps.length})</h2>

          {rsvps.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>No RSVPs yet — links are live and waiting.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e3' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 500, fontSize: '12px' }}>Guest</th>
                  <th style={{ textAlign: 'center', padding: '8px 0', color: '#888', fontWeight: 500, fontSize: '12px' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '8px 0', color: '#888', fontWeight: 500, fontSize: '12px' }}>Guests</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 500, fontSize: '12px' }}>Dietary</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f3' }}>
                    <td style={{ padding: '10px 0', fontWeight: 500 }}>{r.guest_name}</td>
                    <td style={{ textAlign: 'center', padding: '10px 0' }}>
                      <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '12px', background: r.attending ? '#ecfdf5' : '#fef2f2', color: r.attending ? '#065f46' : '#991b1b' }}>
                        {r.attending ? 'Attending' : 'Declined'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 0', color: '#555' }}>{r.attending ? r.guest_count || 1 : '—'}</td>
                    <td style={{ padding: '10px 0', color: '#555', fontSize: '13px' }}>{r.dietary || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
