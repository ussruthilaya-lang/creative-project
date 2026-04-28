import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef()
  const ringRef = useRef()

  useEffect(() => {
    let rx = 0, ry = 0
    const move = (e) => {
      const x = e.clientX, y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`
      }
      rx += (x - rx) * 0.12
      ry += (y - ry) * 0.12
    }
    const raf = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 12}px, ${ry - 12}px)`
      }
      requestAnimationFrame(raf)
    }
    window.addEventListener('mousemove', move)
    requestAnimationFrame(raf)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}
