import { useState } from 'react'
import styles from './SecretWordInput.module.css'

export default function SecretWordInput({ answer, onUnlock, hint }) {
  const [val, setVal] = useState('')
  const [shaking, setShaking] = useState(false)

  const check = () => {
    const clean = val.toLowerCase().replace(/\s/g, '')
    if (clean === answer) { onUnlock() }
    else {
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
      setVal('')
    }
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>Hint: <em>{hint}</em></p>
      <div className={`${styles.row} ${shaking ? styles.shake : ''}`}>
        <input
          className={styles.input}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="type the secret word…"
          spellCheck={false}
        />
        <button className={styles.btn} onClick={check}>✦</button>
      </div>
    </div>
  )
}
