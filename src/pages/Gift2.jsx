import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Gift2.module.css'
import bg from '../assets/gift2/bg.png'
import coupleAsset from '../assets/gift2/couple.png'
import sunflowerAsset from '../assets/gift2/sunflower.png'

function runBurst(canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  const cx = canvas.width/2, cy = canvas.height/2
  const COLORS = ['#e8b84b','#8aab7a','#f0a830','#ffd166','#a8c47a']
  const pts = Array.from({length:180},()=>{
    const angle=Math.random()*Math.PI*2, speed=3+Math.random()*10
    const isChar=Math.random()>0.72
    return { x:cx,y:cy, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      life:1, decay:0.008+Math.random()*0.018, r:isChar?0:1.5+Math.random()*3,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      char:isChar?(Math.random()>0.5?'🌻':'✦'):null, fontSize:10+Math.random()*10 }
  })
  const shooters=Array.from({length:8},(_,i)=>({
    x:-120,y:40+i*65,vx:20+Math.random()*10,vy:0.5+Math.random()*1.5,len:60+Math.random()*50,color:COLORS[i%COLORS.length]}))
  let alive=true
  const draw=()=>{
    if(!alive) return
    ctx.clearRect(0,0,canvas.width,canvas.height)
    pts.forEach(p=>{ if(p.life<=0) return; p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=p.decay
      ctx.globalAlpha=Math.max(0,p.life)
      if(p.char){ctx.fillStyle=p.color;ctx.font=`${p.fontSize}px serif`;ctx.fillText(p.char,p.x,p.y)}
      else{ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()} })
    shooters.forEach(s=>{ if(s.x>canvas.width+200) return; s.x+=s.vx;s.y+=s.vy
      const g=ctx.createLinearGradient(s.x-s.len,s.y,s.x,s.y)
      g.addColorStop(0,'transparent');g.addColorStop(1,s.color)
      ctx.globalAlpha=0.85;ctx.strokeStyle=g;ctx.lineWidth=1.8
      ctx.beginPath();ctx.moveTo(s.x-s.len,s.y);ctx.lineTo(s.x,s.y);ctx.stroke() })
    ctx.globalAlpha=1
    if(pts.some(p=>p.life>0)||shooters.some(s=>s.x<canvas.width+200)) requestAnimationFrame(draw)
    else ctx.clearRect(0,0,canvas.width,canvas.height)
  }
  draw(); return()=>{alive=false}
}

function SunflowerSVG({className,size=60}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{width:size,height:size}}>
      <circle cx="50" cy="50" r="46" fill="rgba(232,184,75,0.1)"/>
      {Array.from({length:12},(_,i)=>(
        <ellipse key={i} cx="50" cy="50" rx="7" ry="20" fill="#e8b84b" opacity="0.85"
          transform={`rotate(${i*30} 50 50) translate(0 -28)`}/>
      ))}
      <circle cx="50" cy="50" r="18" fill="#3d1c02"/>
      <circle cx="50" cy="50" r="13" fill="#5a2d0a"/>
      <rect x="47" y="68" width="6" height="22" rx="3" fill="#8aab7a"/>
    </svg>
  )
}

export default function Gift2() {
  const navigate = useNavigate()
  const canvasRef = useRef()
  const [word,setWord] = useState('')
  const [shaking,setShaking] = useState(false)
  const [wrongHint,setWrongHint] = useState(false)
  const [stickersOut,setStickersOut] = useState(false)
  const [revealed,setRevealed] = useState(false)
  const [phase,setPhase] = useState(0)

  const handleCheck = () => {
    const clean = word.toLowerCase().replace(/\s/g,'')
    if(clean==='sunflower'||clean==='bloom'||clean==='sunshine') {
      setStickersOut(true)
      setTimeout(()=>runBurst(canvasRef.current),300)
      setTimeout(()=>setRevealed(true),900)
      setTimeout(()=>setPhase(1),1000)
      setTimeout(()=>setPhase(2),1200)
      setTimeout(()=>setPhase(3),1400)
      setTimeout(()=>setPhase(4),1700)
      setTimeout(()=>setPhase(5),2000)
      setTimeout(()=>setPhase(6),2200)
      return
    }
    setShaking(true);setWrongHint(true)
    setTimeout(()=>setShaking(false),600)
    setTimeout(()=>setWrongHint(false),2800)
    setWord('')
  }

  const sparkles = Array.from({length:6},(_,i)=>i)

  /* ── SECRET PAGE ── */
  if(!revealed) return (
    <div className={styles.secretPage} style={{backgroundImage:`url(${bg})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={styles.secretOverlay}/>

      {/* floating petals */}
      {Array.from({length:6},(_,i)=>(
        <div key={i} className={styles.petal}
          style={{left:`${5+i*16}%`,animationDelay:`${i*0.8}s`,animationDuration:`${6+i*0.5}s`}}/>
      ))}

      <div className={styles.secretContent}>
        <span className={styles.secretLabel}>✦&nbsp;&nbsp;Gift Two&nbsp;&nbsp;✦</span>
        <h2 className={styles.secretTitle}>
          Something that<br/>
          <em className={styles.titleGold}>never wilts 🌻</em>
        </h2>
        <p className={styles.secretSub}>what never fades is waiting</p>
        <div className={styles.hintBox}>
          <p className={styles.hintText}>
            ✦&nbsp; These golden flowers always<br/>
            turn toward the light —<br/>
            what are they called? &nbsp;✦
          </p>
        </div>
        <div className={`${styles.inputRow} ${shaking?styles.shake:''}`}>
          <input className={styles.input} value={word}
            onChange={e=>setWord(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleCheck()}
            placeholder="whisper the secret word…" spellCheck={false} autoComplete="off"/>
          <button className={styles.unlockBtn} onClick={handleCheck}>Unlock →</button>
        </div>
        {wrongHint && <p className={styles.wrongHint}>not quite, baby — think sunshine and petals 🌻</p>}
      </div>

      {/* STICKER CLUSTER */}
      <div className={`${styles.stickerCluster} ${stickersOut?styles.stickerClusterOut:''}`}>
        <SunflowerSVG className={`${styles.stickerSide} ${styles.stickerL}`} size={60}/>
        <div className={styles.stickerCenter}>
          <img src={sunflowerAsset} className={styles.mainSticker} alt=""
            onError={e=>{e.target.style.display='none'}}/>
          {/* fallback if no png */}
          <SunflowerSVG className={styles.fallbackFlower} size={100}/>
        </div>
        <SunflowerSVG className={`${styles.stickerSide} ${styles.stickerR}`} size={50}/>
        {sparkles.map(i=>(
          <div key={i} className={`${styles.sparkDot} ${styles['sd'+(i+1)]}`}/>
        ))}
      </div>
    </div>
  )

  /* ── REVEAL PAGE ── */
  return (
    <div className={styles.revealPage} style={{backgroundImage:`url(${bg})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={`${styles.revealOverlay} ${phase>=1?styles.revealOverlayDark:''}`}/>

      <div className={`${styles.divider} ${styles.dividerLeft} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={`${styles.divider} ${styles.dividerRight} ${phase>=4?styles.dividerIn:''}`}/>

      <div className={styles.grid}>
        {/* COL 1 */}
        <div className={`${styles.colLeft} ${phase>=2?styles.slideFromLeft:''}`}>
          <span className={styles.revealBadge}>✦&nbsp;&nbsp;Gift Two&nbsp;&nbsp;✦</span>
          <div className={`${styles.flowerWrap} ${phase>=1?styles.flowerIn:''}`}>
            <div className={styles.flowerGlow}/>
            <SunflowerSVG size={90}/>
          </div>
          <h2 className={styles.revealTitle}>Forever in Bloom</h2>
          <p className={styles.revealSubA}>A bouquet that will never wilt 🌻</p>
        </div>

        {/* COL 2 */}
        <div className={styles.colMiddle}>
          <div className={styles.coupleGlow}/>
          {phase>=3 && <img src={coupleAsset} className={styles.revealCouple} alt=""/>}
        </div>

        {/* COL 3 */}
        <div className={`${styles.colRight} ${phase>=2?styles.slideFromRight:''}`}>
          <span className={styles.decorQuote}>"</span>
          <p className={styles.poem}>
            Sunflowers never chase the dark —<br/>
            <span className={styles.poemGold}>they turn, always, toward the light.</span><br/>
            You are graduating into your sunshine, baby.<br/>
            <br/>
            And just like these flowers that never fade,<br/>
            I am here — <span className={styles.poemGold}>permanent, warm, yours.</span><br/>
            Your biggest cheerleader,<br/>
            always in your corner.<br/>
            <br/>
            This bouquet will never wilt.<br/>
            <span className={styles.poemGold}>Neither will I.</span> 🌻
          </p>
          <div className={styles.poemDivider}/>
          <p className={styles.revealSign}>— forever yours, Sruthilaya 🌸</p>
        </div>

        <div className={`${styles.bottomBar} ${phase>=5?styles.bottomBarIn:''}`}>
          <div/><div/>
          <button className={styles.nextBtn} onClick={()=>navigate('/gift3')}>Next Gift →</button>
        </div>
      </div>

      {phase>=6 && <img src={sunflowerAsset} className={styles.stickerReveal} alt=""/>}
    </div>
  )
}
