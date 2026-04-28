import { useEffect, useRef, useState } from 'react'
import styles from './MusicPlayer.module.css'

const tracks = [
  '/music/page1.mp3',
  '/music/page2.mp3',
  '/music/page3.mp3',
  '/music/page4.mp3',
  '/music/page5.mp3',
  '/music/page6.mp3',
]

export default function MusicPlayer({ page }) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = tracks[page] || ''
    audio.volume = 0.15
    audio.loop = true
    audio.play().catch(() => {}) // autoplay may be blocked
  }, [page])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  return (
    <>
      <audio ref={audioRef} />
      <button className={styles.btn} onClick={() => setMuted(m => !m)} title="Toggle music">
        {muted ? '🔇' : '🎵'}
      </button>
    </>
  )
}
