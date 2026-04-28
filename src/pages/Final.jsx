import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Final.module.css'
import bg from '../assets/final/bg.png'
import coupleAsset from '../assets/final/couple.png'
import fireworksAsset from '../assets/final/fireworks.png'
import campusMemory from '../assets/final/campus_memory.png'

function startConfetti(canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  const W=canvas.width, H=canvas.height
  const COLORS=['#c9963a','#e8b84b','#f5d98a','#e8748a','#fdf8f0']
  const isMobile = W < 768
  const MAX = isMobile ? 12 : 20
  const pieces = Array.from({length:MAX}, ()=>({
    x:Math.random()*W, y:Math.random()*H,
    w:3+Math.random()*4, h:3+Math.random()*3,
    vx:(Math.random()-0.5)*0.3, vy:0.4+Math.random()*0.4,
    rot:Math.random()*Math.PI*2, rotV:(Math.random()-0.5)*0.02,
    color:COLORS[Math.floor(Math.random()*COLORS.length)],
    circle:Math.random()>0.5,
  }))
  let alive = true
  const draw = () => {
    if(!alive) return
    ctx.clearRect(0,0,W,H)
    pieces.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV
      if(p.y>H+10){p.y=-10;p.x=Math.random()*W}
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot)
      ctx.fillStyle=p.color; ctx.globalAlpha=0.45
      if(p.circle){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill()}
      else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h)}
      ctx.restore()
    })
    ctx.globalAlpha=1; requestAnimationFrame(draw)
  }
  draw(); return()=>{alive=false}
}

const PETAL_LEFTS = [5,12,20,28,35,42,55,62,70,78,85,92]

export default function Final() {
  const navigate = useNavigate()
  const confCanvasRef = useRef()
  const [showFwPng,    setShowFwPng]    = useState(false)
  const [showCouple,   setShowCouple]   = useState(false)
  const [showBlossoms, setShowBlossoms] = useState(false)
  const [phase,        setPhase]        = useState(0)

  useEffect(() => {
    setTimeout(()=>setShowFwPng(true),    800)
    setTimeout(()=>setShowCouple(true),   1200)
    setTimeout(()=>setShowBlossoms(true), 1800)
    setTimeout(()=>setPhase(1),           2200)
    setTimeout(()=>setPhase(2),           2500)
    setTimeout(()=>setPhase(3),           2900)
    setTimeout(()=>setPhase(4),           3300)

    let stopConf
    const confTimer = setTimeout(()=>{
      stopConf = startConfetti(confCanvasRef.current)
    }, 3500)

    return ()=>{ clearTimeout(confTimer); stopConf?.() }
  },[])

  const petalCount = typeof window!=='undefined'&&window.innerWidth<768 ? 8 : 12

  return (
    <div className={styles.page} style={{backgroundImage:`url(${bg})`}}>

      {/* ── FIXED BG LAYERS ── */}
      <div className={styles.bgOverlay}/>
      {showFwPng && (
        <img src={fireworksAsset} className={styles.fwPng} alt=""
          onError={e=>e.target.style.display='none'}/>
      )}
      <canvas ref={confCanvasRef} className={styles.confCanvas}/>

      {/* cherry blossoms — fixed */}
      {showBlossoms && PETAL_LEFTS.slice(0,petalCount).map((left,i)=>(
        <div key={i} className={styles.petal} style={{
          left:`${left}%`,
          width:`${8+(i%3)*2}px`, height:`${10+(i%4)*2}px`,
          animationDuration:`${8+i*0.6}s`,
          animationDelay:`${(i*0.5)%6}s`,
        }}/>
      ))}

      {/* ── VERTICAL DIVIDERS ── */}
      <div className={`${styles.divider} ${styles.divL} ${phase>=3?styles.divIn:''}`}/>
      <div className={`${styles.divider} ${styles.divR} ${phase>=3?styles.divIn:''}`}/>

      {/* ── 3-COLUMN GRID ── */}
      <div className={styles.grid}>

        {/* COL 1 — left: campus memory + decorative */}
        <div className={`${styles.colLeft} ${phase>=1?styles.slideLeft:''}`}>
          <img src={campusMemory} className={styles.campusImg} alt=""
            onError={e=>e.target.style.display='none'}/>
          <p className={styles.memoryCaption}>a memory worth everything 🐾</p>
          <svg width="20" height="20" viewBox="0 0 24 24" className={styles.heartSvg}>
            <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" fill="#e8748a"/>
          </svg>
        </div>

        {/* COL 2 — middle: couple */}
        <div className={styles.colMiddle}>
          <div className={styles.coupleGlow}/>
          {showCouple && (
            <img src={coupleAsset} className={styles.couple} alt=""
              onError={e=>e.target.style.display='none'}/>
          )}
        </div>

        {/* COL 3 — right: message card */}
        <div className={`${styles.colRight} ${phase>=2?styles.slideRight:''}`}>
          <div className={styles.cardWrap}>
            <div className={styles.washi}/>
            <div className={styles.card}>
              <p className={styles.eyebrow}>✦&nbsp;&nbsp;for my favourite graduate&nbsp;&nbsp;✦</p>

              <p className={styles.opening}>
                Hey, you. Yes, you — the one with the<br/>
                cap and the gown and that smile that<br/>
                still gets me every time.
              </p>

              <div className={styles.divLine}/>

              <div className={styles.body}>
                <p>
                  Look at you, baby. You actually did it. 🎓<br/><br/>
                  I know I'm not standing next to you today<br/>
                  and trust me, that's the hardest part.<br/>
                  But I want you to know —<br/>
                  <span className={styles.gold}>I am there.</span> In every single thing<br/>
                  I packed into this.
                </p>
                <p>
                  In the perfume that travels with you,<br/>
                  in the flowers that never fade,<br/>
                  in the hoodie that wraps around you,<br/>
                  in the little bear on your shelf.<br/>
                  That's all me, saying:{' '}
                  <span className={styles.gold}>I've got you. Always.</span>
                </p>
                <p>
                  Remember the day we met?<br/>
                  Neither of us knew we were walking toward<br/>
                  the best thing that would happen to us.<br/>
                  Northeastern gave us a lot of things, baby —<br/>
                  but <span className={styles.gold}>giving me you was the best one.</span> 🐾
                </p>
                <p>
                  We have crossed hard days before.<br/>
                  We will cross every single one ahead — together.<br/>
                  And the days ahead? They are so bright.<br/>
                  So ridiculously, beautifully bright.<br/>
                  I can already see you in them.
                </p>
                <p>
                  This was your Grad Starter Kit —<br/>
                  curated with chaos, tears, love,<br/>
                  and a little too much online shopping<br/>
                  at midnight. 💛<br/><br/>
                  Go build your beautiful future, Yeshwanth.<br/>
                  I'll be right here — cheering loudest,<br/>
                  hugging tightest, always in your corner.<br/><br/>
                  Congratulations, my love.<br/>
                  <span className={styles.gold}>Today is just the beginning.</span> 🌟
                </p>
              </div>

              <div className={styles.divLine} style={{margin:'24px 0'}}/>

              <div className={styles.sigBlock}>
                <p className={styles.sigTop}>
                  All my love, all my hugs,<br/>all my kisses —
                </p>
                <p className={styles.sigName}>yours always, Sruthilaya 🌸</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3 — bottom bar */}
        <div className={`${styles.bottomBar} ${phase>=4?styles.bottomBarIn:''}`}>
          <button className={styles.backBtn} onClick={()=>navigate('/gift4')}>← back</button>
          <div/>{/* center placeholder — progress dots handled globally */}
          <p className={styles.footerText}>made with chaos &amp; love, 2026 💛</p>
        </div>

      </div>{/* end grid */}
    </div>
  )
}
