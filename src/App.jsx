import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import CustomCursor from './components/CustomCursor'
import ProgressDots from './components/ProgressDots'
import Opening from './pages/Opening'
import Gift1 from './pages/Gift1'
import Gift2 from './pages/Gift2'
import Gift3 from './pages/Gift3'
import Gift4 from './pages/Gift4'
import Final from './pages/Final'
import './App.css'

const PAGES = ['/', '/gift1', '/gift2', '/gift3', '/gift4', '/final']

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const touchStartX = useRef(null)
  const currentIdx = PAGES.indexOf(location.pathname)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && currentIdx < PAGES.length - 1)
        navigate(PAGES[currentIdx + 1])
      if (e.key === 'ArrowLeft' && currentIdx > 0)
        navigate(PAGES[currentIdx - 1])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIdx, navigate])

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > 80 && currentIdx < PAGES.length - 1) navigate(PAGES[currentIdx + 1])
    if (delta < -80 && currentIdx > 0) navigate(PAGES[currentIdx - 1])
    touchStartX.current = null
  }

  return (
    <div className="app-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <CustomCursor />
      <ProgressDots current={currentIdx} total={PAGES.length} />
      <div className="page-wrapper">
        <Routes location={location}>
          <Route path="/" element={<Opening />} />
          <Route path="/gift1" element={<Gift1 />} />
          <Route path="/gift2" element={<Gift2 />} />
          <Route path="/gift3" element={<Gift3 />} />
          <Route path="/gift4" element={<Gift4 />} />
          <Route path="/final" element={<Final />} />
        </Routes>
      </div>
    </div>
  )
}
