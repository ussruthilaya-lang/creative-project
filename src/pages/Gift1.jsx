import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Gift1.module.css'
import bg from '../assets/gift1/bg.jpg'
import coupleAsset from '../assets/gift1/couple.png'
import constellationAsset from '../assets/gift1/constellation.jpg'

/* ─── particle burst ─── */
function runBurst(canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const cx = canvas.width / 2, cy = canvas.height / 2
  const pts = Array.from({length:180}, () => {
    const angle = Math.random() * Math.PI * 2, speed = 3 + Math.random() * 10
    const isChar = Math.random() > 0.72
    return { x:cx, y:cy, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      life:1, decay:0.008+Math.random()*0.018, r:isChar?0:1.5+Math.random()*3,
      color:Math.random()>0.5?'#c9963a':'#e8748a', char:isChar?'✦':null, fontSize:10+Math.random()*10 }
  })
  const shooters = Array.from({length:10},(_,i)=>({
    x:-120, y:30+i*60, vx:22+Math.random()*12, vy:0.5+Math.random()*1.5, len:70+Math.random()*60 }))
  let alive = true
  const draw = () => {
    if(!alive) return
    ctx.clearRect(0,0,canvas.width,canvas.height)
    pts.forEach(p=>{ if(p.life<=0) return; p.x+=p.vx; p.y+=p.vy; p.vy+=0.12; p.life-=p.decay
      ctx.globalAlpha=Math.max(0,p.life)
      if(p.char){ ctx.fillStyle=p.color; ctx.font=`${p.fontSize}px serif`; ctx.fillText(p.char,p.x,p.y) }
      else { ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill() }
    })
    shooters.forEach(s=>{ if(s.x>canvas.width+200) return; s.x+=s.vx; s.y+=s.vy
      const g=ctx.createLinearGradient(s.x-s.len,s.y,s.x,s.y)
      g.addColorStop(0,'transparent'); g.addColorStop(1,'#c9963a')
      ctx.globalAlpha=0.85; ctx.strokeStyle=g; ctx.lineWidth=1.8
      ctx.beginPath(); ctx.moveTo(s.x-s.len,s.y); ctx.lineTo(s.x,s.y); ctx.stroke() })
    ctx.globalAlpha=1
    if(pts.some(p=>p.life>0)||shooters.some(s=>s.x<canvas.width+200)) requestAnimationFrame(draw)
    else ctx.clearRect(0,0,canvas.width,canvas.height)
  }
  draw(); return ()=>{alive=false}
}

/* ─── Perfume bottle SVG sticker ─── */
function BottleSVG({ className }) {
  return (
    <svg viewBox="0 0 100 160" className={className}>
      <rect x="15" y="55" width="70" height="100" rx="6" fill="#0d1b3e" stroke="#c9963a" strokeWidth="1.8"/>
      <path d="M25 55 Q15 40 28 32 L72 32 Q85 40 75 55Z" fill="#1a3060" stroke="#c9963a" strokeWidth="1.4"/>
      <rect x="38" y="18" width="24" height="16" rx="3" fill="#1a3060" stroke="#c9963a" strokeWidth="1.2"/>
      <rect x="43" y="8" width="14" height="12" rx="2" fill="#c9963a"/>
      <rect x="48" y="2" width="4" height="8" rx="1" fill="#e8b84b"/>
      <rect x="22" y="75" width="56" height="62" rx="3" fill="#132040"/>
      <rect x="25" y="78" width="50" height="56" rx="2" fill="none" stroke="rgba(201,150,58,0.5)" strokeWidth="0.8"/>
      <text x="50" y="97"  textAnchor="middle" fill="#c9963a" fontSize="7.5" fontFamily="Georgia,serif" fontWeight="bold">TO THE</text>
      <text x="50" y="110" textAnchor="middle" fill="#c9963a" fontSize="7.5" fontFamily="Georgia,serif" fontWeight="bold">MOON</text>
      <text x="50" y="122" textAnchor="middle" fill="#e8b84b" fontSize="4" fontFamily="sans-serif">Bath &amp; Body Works</text>
    </svg>
  )
}

export default function Gift1() {
  const navigate = useNavigate()
  const canvasRef = useRef()
  const [word, setWord] = useState('')
  const [shaking, setShaking] = useState(false)
  const [wrongHint, setWrongHint] = useState(false)
  const [stickersOut, setStickersOut] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [phase, setPhase] = useState(0)

  const handleCheck = () => {
    const clean = word.toLowerCase().replace(/\s/g,'')
    if(clean==='tothemoon'||clean==='moon'||clean==='tothem') {
      // stickers spring out → burst → reveal
      setStickersOut(true)
      setTimeout(()=>runBurst(canvasRef.current), 300)
      setTimeout(()=>setRevealed(true), 900)
      setTimeout(()=>setPhase(1), 1000)
      setTimeout(()=>setPhase(2), 1300)
      setTimeout(()=>setPhase(3), 1600)
      setTimeout(()=>setPhase(4), 2000)
      setTimeout(()=>setPhase(5), 2400)
      return
    }
    setShaking(true); setWrongHint(true)
    setTimeout(()=>setShaking(false),600)
    setTimeout(()=>setWrongHint(false),2800)
    setWord('')
  }

  /* ─────────────────────────────────────
     SECRET PAGE
  ───────────────────────────────────── */
  if (!revealed) return (
    <div className={styles.secretPage} style={{backgroundImage:`url(${bg})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>

      {/* Constellation overlay */}
      <img src={constellationAsset} className={styles.constellationBg} alt=""/>
      {/* Dark overlay */}
      <div className={styles.secretOverlay}/>

      {/* CENTER CONTENT */}
      <div className={styles.secretContent}>
        <span className={styles.secretLabel}>✦&nbsp;&nbsp;Gift One&nbsp;&nbsp;✦</span>

        <h2 className={styles.secretTitle}>
          Something that carries<br/>
          my soul to yours
        </h2>

        <p className={styles.secretSub}>a secret is waiting for you</p>

        <div className={styles.hintBox}>
          <p className={styles.hintText}>
            ✦&nbsp; The cologne is named after<br/>
            where I want to take you &nbsp;✦
          </p>
        </div>

        <div className={`${styles.inputRow} ${shaking?styles.shake:''}`}>
          <input
            className={styles.input}
            value={word}
            onChange={e=>setWord(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleCheck()}
            placeholder="whisper the secret word…"
            spellCheck={false} autoComplete="off"
          />
          <button className={styles.unlockBtn} onClick={handleCheck}>Unlock →</button>
        </div>

        {wrongHint && (
          <p className={styles.wrongHint}>not quite, baby — think about where we belong 🌙</p>
        )}
      </div>

      {/* STICKER CLUSTER — bottom */}
      <div className={`${styles.stickerCluster} ${stickersOut?styles.stickerClusterOut:''}`}>
        {/* left star */}
        <svg className={`${styles.svgSticker} ${styles.stickerL}`} viewBox="0 0 40 40">
          <text x="20" y="30" textAnchor="middle" fontSize="28" fill="#c9963a">✦</text>
        </svg>
        {/* center bottle */}
        <div className={styles.stickerCenter}>
          <BottleSVG className={styles.bottleSticker}/>
        </div>
        {/* right star */}
        <svg className={`${styles.svgSticker} ${styles.stickerR}`} viewBox="0 0 32 32">
          <text x="16" y="24" textAnchor="middle" fontSize="20" fill="#c9963a">✦</text>
        </svg>
        {/* small heart */}
        <svg className={`${styles.svgSticker} ${styles.stickerHeart}`} viewBox="0 0 24 24">
          <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" fill="#e8748a" opacity="0.8"/>
        </svg>
        {/* sparkle dots */}
        <div className={`${styles.sparkDot} ${styles.sd1}`}/>
        <div className={`${styles.sparkDot} ${styles.sd2}`}/>
        <div className={`${styles.sparkDot} ${styles.sd3}`}/>
      </div>
    </div>
  )

  /* ─────────────────────────────────────
     REVEAL PAGE — 3-column grid
  ───────────────────────────────────── */
  return (
    <div className={styles.revealPage} style={{backgroundImage:`url(${bg})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <img src={constellationAsset} className={styles.constellation} alt=""/>
      <div className={styles.centerGlow}/>

      {/* vertical dividers */}
      <div className={`${styles.divider} ${styles.dividerLeft} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={`${styles.divider} ${styles.dividerRight} ${phase>=4?styles.dividerIn:''}`}/>

      <div className={styles.grid}>
        {/* COL 1 */}
        <div className={`${styles.colLeft} ${phase>=2?styles.slideFromLeft:''}`}>
          <span className={styles.revealBadge}>✦&nbsp;&nbsp;Gift One&nbsp;&nbsp;✦</span>
          <div className={styles.bottleWrap}>
            <div className={styles.bottleGlow}/>
            <svg viewBox="0 0 100 160" className={styles.bottleSvg}>
              <rect x="15" y="55" width="70" height="100" rx="6" fill="#0d1b3e" stroke="#c9963a" strokeWidth="1.8"/>
              <path d="M25 55 Q15 40 28 32 L72 32 Q85 40 75 55Z" fill="#1a3060" stroke="#c9963a" strokeWidth="1.4"/>
              <rect x="38" y="18" width="24" height="16" rx="3" fill="#1a3060" stroke="#c9963a" strokeWidth="1.2"/>
              <rect x="43" y="8" width="14" height="12" rx="2" fill="#c9963a"/>
              <rect x="48" y="2" width="4" height="8" rx="1" fill="#e8b84b"/>
              <rect x="22" y="75" width="56" height="62" rx="3" fill="#132040"/>
              <rect x="25" y="78" width="50" height="56" rx="2" fill="none" stroke="rgba(201,150,58,0.5)" strokeWidth="0.8"/>
              <text x="50" y="97"  textAnchor="middle" fill="#c9963a" fontSize="7.5" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1">TO THE</text>
              <text x="50" y="110" textAnchor="middle" fill="#c9963a" fontSize="7.5" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1">MOON</text>
              <text x="50" y="122" textAnchor="middle" fill="#e8b84b" fontSize="4" fontFamily="sans-serif">Bath &amp; Body Works</text>
              <text x="50" y="130" textAnchor="middle" fill="rgba(232,184,75,0.7)" fontSize="3.5" fontFamily="sans-serif">The Men's Shop</text>
              <text x="26" y="72" fill="#c9963a" fontSize="6">✦</text>
              <text x="68" y="72" fill="#c9963a" fontSize="6">✦</text>
            </svg>
          </div>
          <h2 className={styles.revealTitle}>To The Moon</h2>
          <p className={styles.revealSubA}>by Bath &amp; Body Works · The Men's Shop Cologne</p>
        </div>

        {/* COL 2 */}
        <div className={styles.colMiddle}>
          <div className={styles.coupleGlowReveal}/>
          {phase>=3 && (
            <img src={coupleAsset} className={styles.revealCouple} alt=""/>
          )}
        </div>

        {/* COL 3 */}
        <div className={`${styles.colRight} ${phase>=2?styles.slideFromRight:''}`}>
          <span className={styles.decorQuote}>"</span>
          <p className={styles.poem}>
            Like this scent that lingers<br/>
            long after you have left the room —<br/>
            <span className={styles.poemGold}>you are everywhere in me,</span><br/>
            a warmth I carry into every dawn.<br/>
            <br/>
            Wear this, and know:<br/>
            wherever you wander, my love<br/>
            <span className={styles.poemGold}>travels with you, always.</span>
          </p>
          <div className={styles.poemDivider}/>
          <p className={styles.revealSign}>— with all my love, Sruthilaya 🌙</p>
        </div>

        {/* BOTTOM BAR */}
        <div className={`${styles.bottomBar} ${phase>=5?styles.bottomBarIn:''}`}>
          <div/>
          <div/>
          <button className={styles.nextBtn} onClick={()=>navigate('/gift2')}>Next Gift →</button>
        </div>
      </div>
    </div>
  )
}
