import styles from './ProgressDots.module.css'

export default function ProgressDots({ current, total }) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`${styles.dot} ${i === current ? styles.active : ''}`} />
      ))}
    </div>
  )
}
