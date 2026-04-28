import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Gift4.module.css'
import bg4 from '../assets/gift4/bg.png'
import couple4 from '../assets/gift4/couple.png'

function runBurst(canvas) {
  const ctx=canvas.getContext('2d'); canvas.width=window.innerWidth; canvas.height=window.innerHeight
  const cx=canvas.width/2, cy=canvas.height/2
  const COLORS=['#f5c5d0','#e8b84b','#ffd6e0','#fff0c8','#ffb3c6']
  const pts=Array.from({length:180},()=>{ const a=Math.random()*Math.PI*2,s=3+Math.random()*10,isChar=Math.random()>0.72
    return{x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.008+Math.random()*0.018,r:isChar?0:1.5+Math.random()*3,color:COLORS[Math.floor(Math.random()*COLORS.length)],char:isChar?(Math.random()>0.5?'🐻':'✦'):null,fontSize:10+Math.random()*10}})
  const shoot=Array.from({length:8},(_,i)=>({x:-120,y:40+i*65,vx:20+Math.random()*10,vy:0.5+Math.random()*1.5,len:60+Math.random()*50}))
  let alive=true
  const draw=()=>{ if(!alive) return; ctx.clearRect(0,0,canvas.width,canvas.height)
    pts.forEach(p=>{if(p.life<=0)return;p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=p.decay;ctx.globalAlpha=Math.max(0,p.life)
      if(p.char){ctx.fillStyle=p.color;ctx.font=`${p.fontSize}px serif`;ctx.fillText(p.char,p.x,p.y)}else{ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}})
    shoot.forEach(s=>{if(s.x>canvas.width+200)return;s.x+=s.vx;s.y+=s.vy
      const g=ctx.createLinearGradient(s.x-s.len,s.y,s.x,s.y);g.addColorStop(0,'transparent');g.addColorStop(1,'#f5c5d0')
      ctx.globalAlpha=0.85;ctx.strokeStyle=g;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(s.x-s.len,s.y);ctx.lineTo(s.x,s.y);ctx.stroke()})
    ctx.globalAlpha=1
    if(pts.some(p=>p.life>0)||shoot.some(s=>s.x<canvas.width+200))requestAnimationFrame(draw)
    else ctx.clearRect(0,0,canvas.width,canvas.height)}
  draw();return()=>{alive=false}
}

function BearSVG({size=100}) {
  return (
    <svg viewBox="0 0 100 100" style={{width:size,height:size}}>
      {/* ears */}
      <circle cx="28" cy="28" r="14" fill="#8B6355"/>
      <circle cx="72" cy="28" r="14" fill="#8B6355"/>
      <circle cx="28" cy="28" r="9" fill="#c8967e"/>
      <circle cx="72" cy="28" r="9" fill="#c8967e"/>
      {/* head */}
      <circle cx="50" cy="52" r="34" fill="#8B6355"/>
      {/* face */}
      <circle cx="38" cy="46" r="6" fill="#2d1a0a"/>
      <circle cx="62" cy="46" r="6" fill="#2d1a0a"/>
      {/* eye shine */}
      <circle cx="40" cy="44" r="2" fill="white"/>
      <circle cx="64" cy="44" r="2" fill="white"/>
      {/* snout */}
      <ellipse cx="50" cy="62" rx="12" ry="9" fill="#c8967e"/>
      <circle cx="50" cy="58" r="4" fill="#2d1a0a"/>
      {/* graduation cap */}
      <rect x="25" y="20" width="50" height="6" rx="2" fill="#0d1b3e"/>
      <rect x="44" y="14" width="12" height="7" rx="1" fill="#0d1b3e"/>
      <rect x="54" y="14" width="14" height="3" rx="1" fill="#c9963a"/>
      {/* bow tie */}
      <path d="M40 78 L50 72 L60 78 L50 84Z" fill="#e8748a" opacity="0.9"/>
    </svg>
  )
}

export default function Gift4() {
  const navigate=useNavigate(), canvasRef=useRef()
  const [word,setWord]=useState(''), [shaking,setShaking]=useState(false)
  const [wrongHint,setWrongHint]=useState(false), [stickersOut,setStickersOut]=useState(false)
  const [revealed,setRevealed]=useState(false), [phase,setPhase]=useState(0)

  const handleCheck=()=>{
    const clean=word.toLowerCase().replace(/\s/g,'')
    if(clean==='bear'||clean==='lucky'||clean==='teddybear') {
      setStickersOut(true); setTimeout(()=>runBurst(canvasRef.current),300)
      setTimeout(()=>setRevealed(true),900); setTimeout(()=>setPhase(1),1000)
      setTimeout(()=>setPhase(2),1200); setTimeout(()=>setPhase(3),1400)
      setTimeout(()=>setPhase(4),1700); setTimeout(()=>setPhase(5),2000); return
    }
    setShaking(true);setWrongHint(true)
    setTimeout(()=>setShaking(false),600); setTimeout(()=>setWrongHint(false),2800); setWord('')
  }

  if(!revealed) return (
    <div className={styles.secretPage} style={{backgroundImage:`url(${bg4})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={styles.secretOverlay}/>
      {/* floating hearts */}
      {Array.from({length:5},(_,i)=>(
        <div key={i} className={styles.floatHeart}
          style={{left:`${10+i*18}%`,animationDelay:`${i*0.7}s`,animationDuration:`${4+i*0.5}s`}}>🤍</div>
      ))}
      <div className={styles.secretContent}>
        <span className={styles.secretLabel}>✦&nbsp;&nbsp;Gift Four&nbsp;&nbsp;✦</span>
        <h2 className={styles.secretTitle}>
          Your little<br/>
          <em className={styles.titleAccent}>lucky charm 🐻</em>
        </h2>
        <p className={styles.secretSub}>something small and full of love</p>
        <div className={styles.hintBox}>
          <p className={styles.hintText}>
            ✦&nbsp; What do you call a small soft<br/>
            toy that sits on your shelf<br/>
            and brings you luck? &nbsp;✦
          </p>
        </div>
        <div className={`${styles.inputRow} ${shaking?styles.shake:''}`}>
          <input className={styles.input} value={word} onChange={e=>setWord(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleCheck()}
            placeholder="whisper the secret word…" spellCheck={false} autoComplete="off"/>
          <button className={styles.unlockBtn} onClick={handleCheck}>Unlock →</button>
        </div>
        {wrongHint && <p className={styles.wrongHint}>not quite, baby — think soft, lucky, and totally you 🤍</p>}
      </div>
      <div className={`${styles.stickerCluster} ${stickersOut?styles.stickerClusterOut:''}`}>
        <svg viewBox="0 0 40 40" style={{width:28,height:28}}><text x="20" y="28" textAnchor="middle" fontSize="22" fill="#e8b84b">✦</text></svg>
        <div className={styles.stickerCenter}><BearSVG size={110}/></div>
        <svg viewBox="0 0 32 32" style={{width:22,height:22}}><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#e8b84b">✦</text></svg>
        <svg className={styles.heartSticker} viewBox="0 0 24 24"><path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" fill="#f5c5d0"/></svg>
        <div className={`${styles.sparkDot} ${styles.sd1}`}/>
        <div className={`${styles.sparkDot} ${styles.sd2}`}/>
        <div className={`${styles.sparkDot} ${styles.sd3}`}/>
      </div>
    </div>
  )

  return (
    <div className={styles.revealPage} style={{backgroundImage:`url(${bg4})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={styles.revealOverlay}/>
      <div className={`${styles.divider} ${styles.dividerLeft} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={`${styles.divider} ${styles.dividerRight} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={styles.grid}>
        <div className={`${styles.colLeft} ${phase>=2?styles.slideFromLeft:''}`}>
          <span className={styles.revealBadge}>✦&nbsp;&nbsp;Gift Four&nbsp;&nbsp;✦</span>
          <div className={styles.heroWrap}>
            <div className={styles.heroGlow}/>
            <BearSVG size={120}/>
          </div>
          <h2 className={styles.revealTitle}>Your Lucky Charm</h2>
          <p className={styles.revealSubA}>Put him on your shelf, baby 🐻</p>
        </div>
        <div className={styles.colMiddle}>
          <div className={styles.coupleGlow}/>
          {phase>=3 && <img src={couple4} className={styles.revealCouple} alt=""/>}
        </div>
        <div className={`${styles.colRight} ${phase>=2?styles.slideFromRight:''}`}>
          <span className={styles.decorQuote}>"</span>
          <p className={styles.poem}>
            You know what's funny?<br/>
            I came to Northeastern<br/>
            and found my favourite person. 🐾<br/><br/>
            This little bear has been sitting somewhere<br/>
            waiting to come home with you.<br/>
            Put him on your shelf, baby.<br/><br/>
            On the days that feel big and scary,<br/>
            on the days that feel golden and full —<br/>
            look at him and know:<br/><br/>
            somewhere, I am cheering for you.<br/>
            I always will be.<br/><br/>
            <span className={styles.poemRose}>You are my lucky charm too.</span> 🤍
          </p>
          <div className={styles.poemDivider}/>
          <p className={styles.revealSign}>— always yours, Sruthilaya ✨</p>
        </div>
        <div className={`${styles.bottomBar} ${phase>=4?styles.bottomBarIn:''}`}>
          <div/><div/>
          <button className={styles.nextBtn} onClick={()=>navigate('/final')}>Final Surprise →</button>
        </div>
      </div>
    </div>
  )
}
