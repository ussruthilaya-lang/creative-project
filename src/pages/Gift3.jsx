import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Gift3.module.css'
import bg3 from '../assets/gift3/bg.png'
import couple3 from '../assets/gift3/couple.png'
import bg3_2 from '../assets/gift3/bg.png'

function runBurst(canvas) {
  const ctx = canvas.getContext('2d'); canvas.width=window.innerWidth; canvas.height=window.innerHeight
  const cx=canvas.width/2, cy=canvas.height/2
  const COLORS=['#cc0000','#e8b84b','#ff4444','#ffcc00','#8B0000']
  const pts=Array.from({length:180},()=>{ const a=Math.random()*Math.PI*2,s=3+Math.random()*10,isChar=Math.random()>0.72
    return{x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.008+Math.random()*0.018,r:isChar?0:1.5+Math.random()*3,color:COLORS[Math.floor(Math.random()*COLORS.length)],char:isChar?'🐾':null,fontSize:10+Math.random()*10}})
  const shoot=Array.from({length:8},(_,i)=>({x:-120,y:40+i*65,vx:20+Math.random()*10,vy:0.5+Math.random()*1.5,len:60+Math.random()*50}))
  let alive=true
  const draw=()=>{ if(!alive) return; ctx.clearRect(0,0,canvas.width,canvas.height)
    pts.forEach(p=>{if(p.life<=0)return;p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=p.decay;ctx.globalAlpha=Math.max(0,p.life)
      if(p.char){ctx.fillStyle=p.color;ctx.font=`${p.fontSize}px serif`;ctx.fillText(p.char,p.x,p.y)}else{ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}})
    shoot.forEach(s=>{if(s.x>canvas.width+200)return;s.x+=s.vx;s.y+=s.vy
      const g=ctx.createLinearGradient(s.x-s.len,s.y,s.x,s.y);g.addColorStop(0,'transparent');g.addColorStop(1,'#cc0000')
      ctx.globalAlpha=0.85;ctx.strokeStyle=g;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(s.x-s.len,s.y);ctx.lineTo(s.x,s.y);ctx.stroke()})
    ctx.globalAlpha=1
    if(pts.some(p=>p.life>0)||shoot.some(s=>s.x<canvas.width+200))requestAnimationFrame(draw)
    else ctx.clearRect(0,0,canvas.width,canvas.height)}
  draw();return()=>{alive=false}
}

function PawSVG({size=30,color='#cc0000',rotate=0}) {
  return (
    <svg viewBox="0 0 60 60" style={{width:size,height:size,transform:`rotate(${rotate}deg)`}}>
      <circle cx="30" cy="38" r="14" fill={color} opacity="0.85"/>
      <circle cx="16" cy="22" r="7" fill={color} opacity="0.85"/>
      <circle cx="30" cy="16" r="7" fill={color} opacity="0.85"/>
      <circle cx="44" cy="22" r="7" fill={color} opacity="0.85"/>
    </svg>
  )
}

function HoodieSVG({size=90}) {
  return (
    <svg viewBox="0 0 100 100" style={{width:size,height:size}}>
      <rect x="15" y="35" width="70" height="55" rx="8" fill="#cc0000"/>
      <path d="M15 35 Q20 20 35 18 L50 30 L65 18 Q80 20 85 35Z" fill="#aa0000"/>
      <rect x="30" y="18" width="40" height="14" rx="5" fill="#880000"/>
      <text x="50" y="68" textAnchor="middle" fontSize="9" fill="white" fontFamily="serif" fontWeight="bold">NU</text>
      <circle cx="50" cy="52" r="12" fill="none" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

export default function Gift3() {
  const navigate=useNavigate(), canvasRef=useRef()
  const [word,setWord]=useState(''), [shaking,setShaking]=useState(false)
  const [wrongHint,setWrongHint]=useState(false), [stickersOut,setStickersOut]=useState(false)
  const [revealed,setRevealed]=useState(false), [phase,setPhase]=useState(0)

  const handleCheck=()=>{
    const clean=word.toLowerCase().replace(/\s/g,'')
    if(clean==='husky'||clean==='northeastern'||clean==='nuhuskies') {
      setStickersOut(true); setTimeout(()=>runBurst(canvasRef.current),300)
      setTimeout(()=>setRevealed(true),900); setTimeout(()=>setPhase(1),1000)
      setTimeout(()=>setPhase(2),1200); setTimeout(()=>setPhase(3),1400)
      setTimeout(()=>setPhase(4),1700); setTimeout(()=>setPhase(5),2000); return
    }
    setShaking(true);setWrongHint(true)
    setTimeout(()=>setShaking(false),600); setTimeout(()=>setWrongHint(false),2800); setWord('')
  }

  if(!revealed) return (
    <div className={styles.secretPage} style={{backgroundImage:`url(${bg3})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={styles.secretOverlay}/>
      {/* maple leaf accents */}
      {Array.from({length:5},(_,i)=>(
        <div key={i} className={styles.leaf}
          style={{left:`${8+i*20}%`,animationDelay:`${i*0.7}s`,animationDuration:`${5+i*0.6}s`}}/>
      ))}
      <div className={styles.secretContent}>
        <span className={styles.secretLabel}>✦&nbsp;&nbsp;Gift Three&nbsp;&nbsp;✦</span>
        <h2 className={styles.secretTitle}>
          Something to wear<br/>
          <em className={styles.titleAccent}>with pride 🐾</em>
        </h2>
        <p className={styles.secretSub}>your identity is waiting</p>
        <div className={styles.hintBox}>
          <p className={styles.hintText}>
            ✦&nbsp; What do they call the fierce<br/>
            and loyal dog who represents<br/>
            your university? &nbsp;✦
          </p>
        </div>
        <div className={`${styles.inputRow} ${shaking?styles.shake:''}`}>
          <input className={styles.input} value={word} onChange={e=>setWord(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleCheck()}
            placeholder="whisper the secret word…" spellCheck={false} autoComplete="off"/>
          <button className={styles.unlockBtn} onClick={handleCheck}>Unlock →</button>
        </div>
        {wrongHint && <p className={styles.wrongHint}>not quite, baby — think Northeastern's proudest pup 🐾</p>}
      </div>
      <div className={`${styles.stickerCluster} ${stickersOut?styles.stickerClusterOut:''}`}>
        <PawSVG size={32} color="#cc0000" rotate={-10}/>
        <div className={styles.stickerCenter}><HoodieSVG size={100}/></div>
        <PawSVG size={26} color="#cc0000" rotate={15}/>
        <div className={`${styles.sparkDot} ${styles.sd1}`}/>
        <div className={`${styles.sparkDot} ${styles.sd2}`}/>
        <div className={`${styles.sparkDot} ${styles.sd3}`}/>
      </div>
    </div>
  )

  return (
    <div className={styles.revealPage} style={{backgroundImage:`url(${bg3})`}}>
      <canvas ref={canvasRef} className={styles.canvas}/>
      <div className={styles.revealOverlay}/>
      <div className={`${styles.divider} ${styles.dividerLeft} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={`${styles.divider} ${styles.dividerRight} ${phase>=4?styles.dividerIn:''}`}/>
      <div className={styles.grid}>
        <div className={`${styles.colLeft} ${phase>=2?styles.slideFromLeft:''}`}>
          <span className={styles.revealBadge}>✦&nbsp;&nbsp;Gift Three&nbsp;&nbsp;✦</span>
          <div className={styles.heroWrap}>
            <div className={styles.heroGlow}/>
            <HoodieSVG size={110}/>
          </div>
          <h2 className={styles.revealTitle}>Wear it Proud</h2>
          <p className={styles.revealSubA}>Northeastern Alumni, forever 🐾</p>
        </div>
        <div className={styles.colMiddle}>
          <div className={styles.coupleGlow}/>
          {phase>=3 && <img src={couple3} className={styles.revealCouple} alt=""/>}
        </div>
        <div className={`${styles.colRight} ${phase>=2?styles.slideFromRight:''}`}>
          <span className={styles.decorQuote}>"</span>
          <p className={styles.poem}>
            You earned every thread of this, baby.<br/><br/>
            Wear it on lazy Sunday mornings,<br/>
            on coffee runs, on days you forget<br/>
            how far you've come.<br/>
            Let it remind you —<br/><br/>
            <span className={styles.poemAccent}>Northeastern alumni.</span><br/>
            <span className={styles.poemAccent}>That's you. That will always be you.</span><br/><br/>
            I wanted you to have something that says<br/>
            'I did it' without you having to say a word. 🐾
          </p>
          <div className={styles.poemDivider}/>
          <p className={styles.revealSign}>— so proud of you, Sruthilaya 🍂</p>
        </div>
        <div className={`${styles.bottomBar} ${phase>=5?styles.bottomBarIn:''}`}>
          <div/><div/>
          <button className={styles.nextBtn} onClick={()=>navigate('/gift4')}>Next Gift →</button>
        </div>
      </div>
    </div>
  )
}
