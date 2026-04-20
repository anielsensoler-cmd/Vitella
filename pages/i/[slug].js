import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from('invitations').select('*').eq('slug', params.slug).single()
  if (error || !data) return { notFound: true }
  return { props: { invitation: data } }
}

const THEMES = {
  botanical: {
    pageBg: 'linear-gradient(160deg,#2c1f0e,#1a0f05 50%,#0d0808)',
    envBody: 'linear-gradient(145deg,#f5ead6,#e8d4b0 50%,#d4b88a)',
    envFlap: '#f0e0c0', envFlapBack: '#c9a050',
    sealBg: '#8b1a1a', sealInner: '#a52020',
    sealTextColor: '#f5d0c0',
    hint: '#c9a96e',
    cardBg: 'linear-gradient(165deg,#fffdf7,#f8f0e0 60%,#f0e5c8)',
    cardShadow: '0 40px 80px rgba(0,0,0,.5)',
    cardBorder: '#c9a96e33',
    nameFont: "'IM Fell English',Georgia,serif",
    nameColor: '#2c1a00', nameSize: '40px',
    ampColor: '#8b6914', ampSize: '20px',
    subFont: "'Cinzel',serif",
    subColor: '#9b7a42',
    divider: 'linear-gradient(90deg,transparent,#c9a96e,transparent)',
    dateFont: "'Cinzel',serif", dateColor: '#2c1a00', dateSize: '18px',
    yearColor: '#8b6914',
    venueColor: '#6b4c1a', venueSmColor: '#9b7a42',
    btnBorder: '#c9a96e', btnColor: '#8b6914', btnBg: 'transparent',
    ovBg: 'rgba(12,8,5,.92)', ovCard: 'linear-gradient(145deg,#fffdf7,#f0e5c8)',
    ovTitle: '#9b7a42', inBorder: '#c9a96e66', inBg: '#fffdf7', inColor: '#2c1a00',
    submitBg: '#8b6914', submitColor: '#f5ead6',
    confetti: ['#c9a96e','#8b1a1a','#f5ead6','#d4af37','#fff','#e8c878'],
    wm: '#c9a96e33',
    fonts: "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap",
  },
  blue: {
    pageBg: '#d8e4f8',
    envBody: '#c8d8f0', envFlap: '#b8c8e0', envFlapBack: '#a0b4d0',
    sealBg: '#1e3060', sealInner: '#243870',
    sealTextColor: '#d8e4f8',
    hint: '#4a6aaa',
    cardBg: '#d8e4f8',
    cardShadow: '0 20px 60px rgba(30,48,96,.2)',
    cardBorder: 'transparent',
    nameFont: "'Playfair Display',Georgia,serif",
    nameColor: '#1e3060', nameSize: '52px',
    ampColor: '#4a6aaa', ampSize: '32px',
    subFont: "'Josefin Sans',sans-serif",
    subColor: '#1e3060',
    divider: '#1e3060',
    dateFont: "'Josefin Sans',sans-serif", dateColor: '#1e3060', dateSize: '12px',
    yearColor: '#4a6aaa',
    venueColor: '#1e3060', venueSmColor: '#4a6aaa',
    btnBorder: '#1e3060', btnColor: '#d8e4f8', btnBg: '#1e3060',
    ovBg: 'rgba(216,228,248,.96)', ovCard: '#e8f0fc',
    ovTitle: '#1e3060', inBorder: '#6a8ac066', inBg: '#eaf0f8', inColor: '#1e3060',
    submitBg: '#1e3060', submitColor: '#d8e4f8',
    confetti: ['#1e3060','#4a6aaa','#d8e4f8','#8aaad8','#c0d0e8'],
    wm: '#1e306033',
    fonts: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Josefin+Sans:wght@300;400&display=swap",
  },
  pressed: {
    pageBg: '#f9f7f2',
    envBody: '#fdfcf9', envFlap: '#f5f0e8', envFlapBack: '#b8a888',
    sealBg: '#3a3020', sealInner: '#4a4030',
    sealTextColor: '#d0c0a0',
    hint: '#aaa',
    cardBg: '#fffdf8',
    cardShadow: '0 16px 50px rgba(20,15,0,.1)',
    cardBorder: '#d0c8b044',
    nameFont: "'Fraunces',Georgia,serif",
    nameColor: '#1a1610', nameSize: '44px',
    ampColor: '#8a7a5a', ampSize: '26px',
    subFont: "'Josefin Sans',sans-serif",
    subColor: '#8a7050',
    divider: 'linear-gradient(90deg,transparent,#d0c8b0,transparent)',
    dateFont: "'Fraunces',serif", dateColor: '#1a1610', dateSize: '16px',
    yearColor: '#8a7a5a',
    venueColor: '#1a1610', venueSmColor: '#8a7050',
    btnBorder: '#8a7a5a', btnColor: '#5a4a2a', btnBg: 'transparent',
    ovBg: 'rgba(253,252,249,.95)', ovCard: '#faf8f3',
    ovTitle: '#8a7050', inBorder: '#c8b89866', inBg: '#fffdf8', inColor: '#1a1610',
    submitBg: '#3a3020', submitColor: '#fdfcf9',
    confetti: ['#8a7a5a','#d0c8b0','#fffdf8','#e8b820','#9a80b0','#5a7a48'],
    wm: '#8a7a5a22',
    fonts: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=Josefin Sans:wght@300;400&display=swap",
  },
}

export default function InvitationPage({ invitation }) {
  const router = useRouter()
  const guestName = router.query.guest || ''
  const t = THEMES[invitation.design] || THEMES.botanical
  const isBotanical = (invitation.design === 'botanical' || invitation.design === 'custom' || !invitation.design)
  const isBlue = invitation.design === 'blue'
  const isPressed = invitation.design === 'pressed'

  const [opened, setOpened] = useState(false)
  const [sealCracked, setSealCracked] = useState(false)
  const [flapOpen, setFlapOpen] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [showRsvp, setShowRsvp] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({ attending:'', guests:'1', dietary:'' })
  const [submitting, setSubmitting] = useState(false)

  const dateObj = invitation.date ? new Date(invitation.date + 'T12:00:00') : null
  const dp = dateObj ? { day: dateObj.getDate(), month: dateObj.toLocaleDateString('en-GB',{month:'long'}), year: dateObj.getFullYear() } : {}
  const rsvpDL = invitation.rsvp_deadline ? new Date(invitation.rsvp_deadline+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long'}) : ''

  function openEnvelope() {
    if (opened) return
    setOpened(true); setSealCracked(true)
    setTimeout(()=>setFlapOpen(true), 400)
    setTimeout(()=>spawnConfetti(), 900)
    setTimeout(()=>setCardVisible(true), 1300)
  }

  function spawnConfetti() {
    const el = document.getElementById('cfroot')
    if (!el) return
    for (let i=0;i<80;i++) {
      const d=document.createElement('div')
      const s=5+Math.random()*8
      d.style.cssText=`position:absolute;top:-20px;left:${Math.random()*100}%;width:${s}px;height:${s}px;background:${t.confetti[Math.floor(Math.random()*t.confetti.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation:fall ${2+Math.random()*2}s ease-in ${Math.random()*1.5}s forwards;opacity:0;`
      el.appendChild(d)
    }
  }

  async function submitRsvp() {
    if (!rsvpForm.attending) return
    setSubmitting(true)
    await supabase.from('rsvps').insert({ invitation_slug:invitation.slug, guest_name:guestName||'Guest', attending:rsvpForm.attending==='yes', guest_count:parseInt(rsvpForm.guests), dietary:rsvpForm.dietary, responded_at:new Date().toISOString() })
    setSubmitting(false); setRsvpDone(true)
  }

  const inp = { width:'100%',padding:'10px 12px',border:`1px solid ${t.inBorder}`,background:t.inBg,fontFamily:"'Cormorant Garamond',serif",fontSize:'15px',color:t.inColor,borderRadius:'2px',marginBottom:'10px',outline:'none' }

  return (
    <>
      <Head>
        <title>{invitation.partner1} & {invitation.partner2} — You are invited</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href={t.fonts} rel="stylesheet" />
        <style>{`
          @keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(700px) rotate(720deg);opacity:0}}
          @keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:${t.pageBg};}
        `}</style>
      </Head>

      <div style={{minHeight:'100vh',background:t.pageBg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem 1rem',position:'relative',overflow:'hidden'}}>
        <div id="cfroot" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:100,overflow:'hidden'}}/>

        {/* ENVELOPE */}
        <div onClick={openEnvelope} style={{position:'relative',width:'min(310px,90vw)',height:'220px',cursor:opened?'default':'pointer',marginBottom:'-14px',zIndex:2,flexShrink:0}}>
          <div style={{position:'absolute',inset:0,background:t.envBody,borderRadius:'4px 4px 8px 8px',boxShadow:'0 20px 60px rgba(0,0,0,.28)'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,transparent 49%,rgba(0,0,0,.03) 49.5%,transparent 50%),linear-gradient(225deg,transparent 49%,rgba(0,0,0,.03) 49.5%,transparent 50%)'}}/>
          </div>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'125px',transformOrigin:'top center',transformStyle:'preserve-3d',transform:flapOpen?'rotateX(-180deg)':'rotateX(0deg)',transition:'transform 1.2s cubic-bezier(.4,0,.2,1)',zIndex:3}}>
            <div style={{position:'absolute',inset:0,background:t.envFlap,clipPath:'polygon(0 0,100% 0,50% 100%)'}}/>
            <div style={{position:'absolute',inset:0,background:t.envFlapBack,clipPath:'polygon(0 0,100% 0,50% 100%)',backfaceVisibility:'hidden',transform:'rotateX(180deg)'}}/>
          </div>
          {/* Wax seal */}
          <div style={{position:'absolute',top:'76px',left:'50%',transform:`translateX(-50%) scale(${sealCracked?0:1}) rotate(${sealCracked?'20deg':'0'})`,transition:'transform .6s ease-out',zIndex:4,width:'54px',height:'54px'}}>
            <svg viewBox="0 0 54 54" width="54" height="54" style={{filter:'drop-shadow(0 4px 12px rgba(0,0,0,.35))'}}>
              <circle cx="27" cy="27" r="26" fill={t.sealBg}/>
              <circle cx="27" cy="27" r="22" fill={t.sealInner}/>
              {isBotanical && <>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".9"/>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".75" transform="rotate(60 27 18)"/>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".85" transform="rotate(120 27 18)"/>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".9" transform="rotate(180 27 18)"/>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".75" transform="rotate(240 27 18)"/>
                <ellipse cx="27" cy="18" rx="3.5" ry="5.5" fill={t.sealTextColor} opacity=".85" transform="rotate(300 27 18)"/>
                <circle cx="27" cy="18" r="3.5" fill="#fdf0c0"/>
                <text x="27" y="37" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="8" fill={t.sealTextColor}>{invitation.partner1[0]}&amp;{invitation.partner2[0]}</text>
              </>}
              {isBlue && <>
                <text x="27" y="23" textAnchor="middle" fontFamily="Playfair Display,serif" fontStyle="italic" fontSize="9" fill={t.sealTextColor}>{invitation.partner1[0]}</text>
                <text x="27" y="31" textAnchor="middle" fontFamily="serif" fontSize="7" fill={t.sealTextColor} opacity=".6">&amp;</text>
                <text x="27" y="39" textAnchor="middle" fontFamily="Playfair Display,serif" fontStyle="italic" fontSize="9" fill={t.sealTextColor}>{invitation.partner2[0]}</text>
              </>}
              {isPressed && <>
                <text x="27" y="22" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="8" fill={t.sealTextColor}>{invitation.partner1[0]}</text>
                <text x="27" y="30" textAnchor="middle" fontFamily="serif" fontSize="7" fill={t.sealTextColor} opacity=".5">+</text>
                <text x="27" y="38" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="8" fill={t.sealTextColor}>{invitation.partner2[0]}</text>
              </>}
              <circle cx="27" cy="27" r="25" fill="none" stroke={t.sealTextColor} strokeWidth=".5" strokeDasharray="3 2" opacity=".35"/>
            </svg>
          </div>
        </div>

        {!opened && <p style={{fontStyle:'italic',color:t.hint,fontSize:'13px',letterSpacing:'1px',marginBottom:'1rem',animation:'pulse 2.5s ease-in-out infinite',textAlign:'center'}}>✦ tap the seal to open ✦</p>}

        {/* CARD */}
        <div style={{width:'min(294px,88vw)',background:t.cardBg,borderRadius:'3px',padding:'2rem 1.75rem',textAlign:'center',position:'relative',zIndex:1,boxShadow:t.cardShadow,border:`1px solid ${t.cardBorder}`,opacity:cardVisible?1:0,transform:cardVisible?'translateY(0)':'translateY(30px)',transition:'opacity 1s ease,transform 1.4s cubic-bezier(.2,.8,.3,1)',overflow:'hidden'}}>

          {/* BOTANICAL card overlays */}
          {isBotanical && <svg style={{position:'absolute',top:0,right:0,width:'70px',height:'70px',opacity:.1,pointerEvents:'none'}} viewBox="0 0 60 60"><circle cx="20" cy="30" r="7" fill="#c8b898"/><circle cx="36" cy="24" r="9" fill="#e0d0b8"/><circle cx="50" cy="32" r="6" fill="#c8b898"/><path d="M20 30 Q36 20 50 32" fill="none" stroke="#a89878" strokeWidth=".5"/></svg>}

          {/* BLUE card botanical overlays */}
          {isBlue && <>
            <svg style={{position:'absolute',top:0,left:0,width:'75px',height:'100px',opacity:.45,pointerEvents:'none'}} viewBox="0 0 75 100">
              <line x1="0" y1="100" x2="55" y2="20" stroke="#1e3060" strokeWidth=".8" strokeLinecap="round"/>
              <circle cx="55" cy="18" r="7" fill="none" stroke="#1e3060" strokeWidth=".8"/>
              <circle cx="55" cy="18" r="3" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="55" y1="11" x2="55" y2="7" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="62" y1="13" x2="66" y2="9" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="62" y1="23" x2="66" y2="27" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="55" y1="25" x2="55" y2="29" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="48" y1="23" x2="44" y2="27" stroke="#1e3060" strokeWidth=".7"/>
              <line x1="48" y1="13" x2="44" y2="9" stroke="#1e3060" strokeWidth=".7"/>
              <ellipse cx="18" cy="70" rx="5" ry="8" fill="#1e3060" transform="rotate(-40 18 70)" opacity=".7"/>
              <ellipse cx="30" cy="58" rx="5" ry="8" fill="#1e3060" transform="rotate(-35 30 58)" opacity=".7"/>
            </svg>
            <svg style={{position:'absolute',top:0,right:0,width:'75px',height:'100px',opacity:.4,pointerEvents:'none',transform:'scaleX(-1)'}} viewBox="0 0 75 100">
              <line x1="0" y1="100" x2="55" y2="20" stroke="#1e3060" strokeWidth=".8" strokeLinecap="round"/>
              <circle cx="55" cy="18" r="7" fill="none" stroke="#1e3060" strokeWidth=".8"/>
              <circle cx="55" cy="18" r="3" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <ellipse cx="18" cy="70" rx="5" ry="8" fill="#1e3060" transform="rotate(-40 18 70)" opacity=".7"/>
              <ellipse cx="30" cy="58" rx="5" ry="8" fill="#1e3060" transform="rotate(-35 30 58)" opacity=".7"/>
            </svg>
            <svg style={{position:'absolute',bottom:0,left:0,width:'80px',height:'100px',opacity:.42,pointerEvents:'none'}} viewBox="0 0 80 100">
              <circle cx="40" cy="45" r="22" fill="none" stroke="#1e3060" strokeWidth=".9"/>
              <circle cx="40" cy="45" r="15" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <circle cx="40" cy="45" r="8" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <ellipse cx="-5" cy="75" rx="9" ry="14" fill="#1e3060" transform="rotate(-20 -5 75)"/>
              <ellipse cx="14" cy="85" rx="8" ry="13" fill="#1e3060" transform="rotate(10 14 85)"/>
            </svg>
            <svg style={{position:'absolute',bottom:0,right:0,width:'80px',height:'100px',opacity:.42,pointerEvents:'none',transform:'scaleX(-1)'}} viewBox="0 0 80 100">
              <circle cx="40" cy="45" r="22" fill="none" stroke="#1e3060" strokeWidth=".9"/>
              <circle cx="40" cy="45" r="15" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <circle cx="40" cy="45" r="8" fill="none" stroke="#1e3060" strokeWidth=".7"/>
              <ellipse cx="-5" cy="75" rx="9" ry="14" fill="#1e3060" transform="rotate(-20 -5 75)"/>
              <ellipse cx="14" cy="85" rx="8" ry="13" fill="#1e3060" transform="rotate(10 14 85)"/>
            </svg>
          </>}

          {/* PRESSED card botanical overlays */}
          {isPressed && <>
            <svg style={{position:'absolute',top:0,right:0,width:'95px',height:'95px',opacity:.48,pointerEvents:'none'}} viewBox="0 0 100 100">
              <circle cx="78" cy="14" r="15" fill="none" stroke="#8a7a5a" strokeWidth=".7"/>
              <ellipse cx="62" cy="26" rx="9" ry="16" fill="none" stroke="#8a7a5a" strokeWidth=".7" transform="rotate(-35 62 26)"/>
              <path d="M72 30 Q82 44 66 54" fill="none" stroke="#8a7a5a" strokeWidth=".7"/>
              <line x1="72" y1="54" x2="55" y2="80" stroke="#8a7a5a" strokeWidth=".7"/>
              <ellipse cx="42" cy="68" rx="6" ry="11" fill="none" stroke="#8a7a5a" strokeWidth=".7" transform="rotate(-15 42 68)"/>
              <ellipse cx="55" cy="38" rx="5" ry="10" fill="#8a7a5a" transform="rotate(-15 55 38)" opacity=".5"/>
            </svg>
            <svg style={{position:'absolute',bottom:0,left:0,width:'80px',height:'80px',opacity:.38,pointerEvents:'none',transform:'rotate(185deg)'}} viewBox="0 0 100 100">
              <circle cx="78" cy="14" r="14" fill="none" stroke="#8a7a5a" strokeWidth=".7"/>
              <ellipse cx="62" cy="26" rx="8" ry="15" fill="none" stroke="#8a7a5a" strokeWidth=".7" transform="rotate(-35 62 26)"/>
              <line x1="72" y1="40" x2="50" y2="78" stroke="#8a7a5a" strokeWidth=".7"/>
              <ellipse cx="42" cy="68" rx="6" ry="11" fill="none" stroke="#8a7a5a" strokeWidth=".7" transform="rotate(-15 42 68)"/>
            </svg>
            {/* Loose petals */}
            <ellipse style={{position:'absolute'}} cx="125" cy="170" rx="6" ry="10" fill="#e8b820" transform="rotate(-25)" opacity=".6"/>
            <svg style={{position:'absolute',top:'155px',left:'55px',opacity:.65,pointerEvents:'none'}} viewBox="0 0 70 40" width="70" height="40">
              <ellipse cx="15" cy="20" rx="6" ry="10" fill="#e8b820" transform="rotate(-25 15 20)"/>
              <ellipse cx="30" cy="14" rx="6" ry="10" fill="#d4a010" transform="rotate(15 30 14)"/>
              <ellipse cx="45" cy="22" rx="5" ry="9" fill="#c8a010" transform="rotate(-40 45 22)"/>
            </svg>
            {/* Purple phlox */}
            <svg style={{position:'absolute',bottom:'90px',right:'10px',opacity:.5,pointerEvents:'none'}} viewBox="0 0 34 34" width="34" height="34">
              <ellipse cx="17" cy="8" rx="7" ry="9" fill="#5a30a0"/>
              <ellipse cx="17" cy="8" rx="7" ry="9" fill="#4a2090" transform="rotate(72 17 17)"/>
              <ellipse cx="17" cy="8" rx="7" ry="9" fill="#5a30a0" transform="rotate(144 17 17)"/>
              <ellipse cx="17" cy="8" rx="7" ry="9" fill="#4a2090" transform="rotate(216 17 17)"/>
              <ellipse cx="17" cy="8" rx="7" ry="9" fill="#5a30a0" transform="rotate(288 17 17)"/>
              <circle cx="17" cy="17" r="4.5" fill="#f0e8ff"/>
            </svg>
          </>}

          {/* CARD TEXT */}
          <div style={{position:'relative',zIndex:2}}>
            {guestName && <p style={{fontStyle:'italic',color:t.subColor,fontSize:'12px',marginBottom:'12px',letterSpacing:'.5px'}}>Dear {guestName},</p>}

            {/* Blue: arched text */}
            {isBlue && <svg viewBox="0 0 260 52" width="100%" height="52" style={{marginBottom:'6px'}}>
              <defs><path id="arc" d="M 15,48 A 115,115 0 0,1 245,48"/></defs>
              <text fontFamily="Josefin Sans,sans-serif" fontSize="8" fill="#1e3060" fontWeight="300" letterSpacing="4">
                <textPath href="#arc" startOffset="50%" textAnchor="middle">YOU ARE INVITED · TO THE WEDDING OF</textPath>
              </text>
            </svg>}

            {!isBlue && <div style={{color:t.subColor,marginBottom:'6px',letterSpacing:'4px',fontSize:'16px'}}>✦</div>}
            {!isBlue && <p style={{fontFamily:t.subFont,fontSize:'9px',letterSpacing:'4px',textTransform:'uppercase',color:t.subColor,marginBottom:'14px'}}>Together with their families</p>}

            {/* Names */}
            <div style={{fontFamily:t.nameFont,fontStyle:'italic',fontSize:t.nameSize,color:t.nameColor,lineHeight:1.05,marginBottom:'2px'}}>{invitation.partner1}</div>
            <span style={{display:'block',fontFamily:t.nameFont,fontStyle:'italic',fontSize:t.ampSize,color:t.ampColor,margin:'4px 0 4px'}}>&amp;</span>
            <div style={{fontFamily:t.nameFont,fontStyle:'italic',fontSize:t.nameSize,color:t.nameColor,lineHeight:1.05,marginBottom:'4px'}}>{invitation.partner2}</div>

            {/* Blue date row */}
            {isBlue && dp.day && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'10px 4px'}}>
              <span style={{fontFamily:t.dateFont,fontSize:'15px',fontWeight:700,color:t.dateColor,letterSpacing:'1px'}}>{String(dateObj.getDate()).padStart(2,'0')}.{String(dateObj.getMonth()+1).padStart(2,'0')}</span>
              <div style={{flex:1,height:'1px',background:t.divider,margin:'0 8px'}}/>
              <span style={{fontFamily:t.dateFont,fontSize:'15px',fontWeight:700,color:t.dateColor,letterSpacing:'1px'}}>{dp.year}</span>
            </div>}

            {/* Divider */}
            {!isBlue && <div style={{width:'80px',height:'1px',background:t.divider,margin:'14px auto'}}/>}
            {!isBlue && <p style={{fontFamily:t.subFont,fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase',color:t.subColor,fontStyle:'italic',marginBottom:'14px'}}>request the honour of your presence</p>}

            {/* Date */}
            <p style={{fontFamily:t.dateFont,fontSize:isBlue?'11px':t.dateSize,color:t.dateColor,fontWeight:isBlue?700:600,marginBottom:'4px',letterSpacing:isBlue?'3px':'2px',textTransform:isBlue?'uppercase':'none'}}>
              {dp.day} · {dp.month}
            </p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'13px',color:t.yearColor,letterSpacing:'4px',marginBottom:'12px'}}>· {dp.year} ·</p>

            <div style={{width:'50px',height:'1px',background:t.divider,margin:'0 auto 12px'}}/>
            <p style={{fontStyle:'italic',fontSize:'14px',color:t.venueColor,lineHeight:1.6,marginBottom:'4px'}}>{invitation.venue_name}</p>
            <p style={{fontStyle:'italic',fontSize:'14px',color:t.venueColor,lineHeight:1.6}}>{invitation.venue_city}</p>
            {invitation.ceremony_time && <p style={{fontStyle:'italic',fontSize:'12px',color:t.venueSmColor,marginTop:'4px'}}>{invitation.ceremony_time}</p>}
            {rsvpDL && <p style={{fontFamily:t.subFont,fontSize:'8px',letterSpacing:'2px',color:t.subColor,textTransform:'uppercase',marginTop:'18px'}}>Kindly reply by {rsvpDL}</p>}

            <button onClick={()=>setShowRsvp(true)} style={{marginTop:'14px',padding:'9px 28px',border:`1px solid ${t.btnBorder}`,borderRadius:'1px',background:t.btnBg,fontFamily:t.subFont,fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase',color:t.btnColor,cursor:'pointer'}}>
              RSVP
            </button>
          </div>
        </div>

        {/* RSVP Modal */}
        {showRsvp && <div style={{position:'fixed',inset:0,background:t.ovBg,display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
          <div style={{background:t.ovCard,borderRadius:'4px',padding:'2rem',width:'min(300px,90vw)',textAlign:'center',border:`1px solid ${t.inBorder}`,position:'relative'}}>
            <button onClick={()=>setShowRsvp(false)} style={{position:'absolute',top:'12px',right:'16px',background:'none',border:'none',color:t.ovTitle,fontSize:'18px',cursor:'pointer'}}>✕</button>
            {rsvpDone ? (
              <>
                <div style={{fontFamily:t.subFont,fontSize:'10px',letterSpacing:'3px',color:t.ovTitle,marginBottom:'16px'}}>{rsvpForm.attending==='yes'?'✦ See you soon ✦':'✦ Until next time ✦'}</div>
                <p style={{fontStyle:'italic',color:t.ovTitle,fontSize:'15px',lineHeight:1.7}}>{rsvpForm.attending==='yes'?`Thank you, ${guestName||'dear friend'}. ${invitation.partner1} & ${invitation.partner2} look forward to celebrating with you.`:`Thank you, ${guestName||'dear friend'}. You will be dearly missed.`}</p>
              </>
            ) : (
              <>
                <div style={{fontFamily:t.subFont,fontSize:'10px',letterSpacing:'4px',color:t.ovTitle,marginBottom:'20px',textTransform:'uppercase'}}>Your Response</div>
                <input defaultValue={guestName} placeholder="Your name" style={inp}/>
                <select value={rsvpForm.attending} onChange={e=>setRsvpForm(p=>({...p,attending:e.target.value}))} style={inp}>
                  <option value="">Will you attend?</option>
                  <option value="yes">Joyfully accepts ✦</option>
                  <option value="no">Regretfully declines</option>
                </select>
                {rsvpForm.attending==='yes' && <>
                  <input type="number" min="1" max="10" value={rsvpForm.guests} onChange={e=>setRsvpForm(p=>({...p,guests:e.target.value}))} placeholder="Number of guests" style={inp}/>
                  <input value={rsvpForm.dietary} onChange={e=>setRsvpForm(p=>({...p,dietary:e.target.value}))} placeholder="Dietary requirements (optional)" style={inp}/>
                </>}
                <button onClick={submitRsvp} disabled={!rsvpForm.attending||submitting} style={{width:'100%',padding:'11px',background:t.submitBg,border:'none',fontFamily:t.subFont,fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase',color:t.submitColor,cursor:'pointer',borderRadius:'2px',marginTop:'6px',opacity:!rsvpForm.attending?.45:1}}>
                  {submitting?'Sending...':'Send reply'}
                </button>
              </>
            )}
          </div>
        </div>}

        <p style={{fontFamily:"'Cinzel',serif",fontSize:'9px',letterSpacing:'3px',color:t.wm,marginTop:'2rem',textAlign:'center'}}>VITELLA</p>
      </div>
    </>
  )
}
