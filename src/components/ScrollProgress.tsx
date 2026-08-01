import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="scroll-progress"
      style={{
        width: `${progress}%`,
        transition: 'width 0.1s linear',
      }}
    />
  )
}
