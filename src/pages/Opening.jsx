import cakeAsset from '../assets/opening/cake.png'
import bgAsset from '../assets/opening/bg.png'
﻿import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Confetti from '../components/Confetti'
import styles from './Opening.module.css'

export default function Opening() {
  const navigate = useNavigate()
  const cardRef = useRef()
  const [confettiKey, setConfettiKey] = useState(0)
  const [phase, setPhase] = useState(0)

  // Staggered animation phases
  useEffect(() => {
    setConfettiKey(k => k + 1)
    const timers = [
      setTimeout(() => setPhase(1), 600),   // card up
      setTimeout(() => setPhase(2), 800),   // cake
      setTimeout(() => setPhase(3), 1000),  // content
      setTimeout(() => setPhase(4), 1400),  // stickers
      setTimeout(() => setPhase(5), 2000),  // arrow
      setTimeout(() => setPhase(6), 2400),  // swipe hint
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // 3D card tilt
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x = ((e.clientX - left) / width - 0.5) * 14
      const y = ((e.clientY - top) / height - 0.5) * -14
      card.style.transform = `rotate(-1.5deg) rotateY(${x}deg) rotateX(${y}deg)`
    }
    const onLeave = () => { card.style.transform = 'rotate(-1.5deg)' }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const stickers = ['🎓', '⭐', '🌸', '✨', '💛', '🎀']
  const stickerPositions = [
    { top: '14%', left: '6%', rotate: '-12deg' },
    { top: '10%', right: '8%', rotate: '8deg' },
    { bottom: '28%', left: '5%', rotate: '15deg' },
    { bottom: '20%', right: '7%', rotate: '-8deg' },
    { top: '42%', left: '3%', rotate: '-5deg' },
    { top: '60%', right: '5%', rotate: '12deg' },
  ]

  return (
    <div className={`${styles.page} page-grain`}>
      {/* Background */}
      <div className={styles.bgWrap}>
        <img src={bgAsset} alt="" className={styles.bgImg}
          onError={e => e.target.style.display = 'none'} />
        <div className={styles.bgFallback} />
      </div>

      <Confetti trigger={confettiKey} />

      {/* Stickers */}
      {phase >= 4 && stickers.map((s, i) => (
        <span key={i} className={styles.sticker}
          style={{ ...stickerPositions[i], animationDelay: `${i * 0.12}s` }}>
          {s}
        </span>
      ))}

      {/* Cake hero — above card */}
      <div className={`${styles.cakeWrap} ${phase >= 2 ? styles.cakeVisible : ''}`}>
        <img src={cakeAsset} alt="cake" className={styles.cake}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        <div className={styles.cakeFallback}>🎂</div>

        {/* Speech bubble */}
        <div className={`${styles.bubble} ${phase >= 3 ? styles.bubbleVisible : ''}`}>
          <span className={styles.bubbleLabel}>✦ the cake says —</span>
          <p className={styles.bubbleMsg}>
            Congrats on the degree, baby —<br />
            I always knew the{' '}
            <em className={styles.bubbleHighlight}>smartest person</em>
            {' '}in the room. 🎓
          </p>
        </div>
      </div>

      {/* Scrapbook card */}
      <div ref={cardRef} className={`${styles.card} ${phase >= 1 ? styles.cardVisible : ''}`}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>

        {/* Washi tape on top */}
        <div className={styles.washi} />

        {/* Torn top edge */}
        <div className={styles.tornTop} />

        <div className={`${styles.cardContent} ${phase >= 3 ? styles.contentVisible : ''}`}>
          <span className={styles.smallLabel}>✦ a little something ✦</span>

          <h1 className={styles.title}>
            Congratulations,{' '}
            <em className={styles.titleName}>Yeshwanth!</em>
          </h1>

          <p className={styles.subtitle}>
            Masters graduate &amp; biggest love of my life 🎓
          </p>

          {/* Wavy SVG divider */}
          <svg className={styles.divider} viewBox="0 0 300 20" fill="none">
            <path d="M0 10 C30 2, 60 18, 90 10 S150 2, 180 10 S240 18, 270 10 S300 2, 300 10"
              stroke="var(--rose)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>

          {/* Stamp label */}
          <div className={styles.stamp}>
            <span className={styles.stampStar}>★</span>
            <span className={styles.stampText}>A Grad Starter Kit</span>
            <span className={styles.stampStar}>★</span>
          </div>

          <p className={styles.signoff}>
            curated with chaos &amp; love, by Sruthilaya 💌
          </p>
        </div>

        <div className={styles.tornBottom} />
      </div>

      {/* Right nudge arrow */}
      {phase >= 5 && (
        <button className={styles.nudge} onClick={() => navigate('/gift1')} aria-label="Next page">
          <span className={styles.nudgeText}>explore</span>
          <span className={styles.nudgeArrow}>→</span>
        </button>
      )}

      {/* Swipe hint */}
      {phase >= 6 && (
        <div className={styles.swipeHint}>
          <span>swipe to explore →</span>
        </div>
      )}
    </div>
  )
}
