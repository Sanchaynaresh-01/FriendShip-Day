import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// CUSTOM CURSOR — Glow + Magnetic + Ripple + Particles
// ============================================================

interface Ripple {
  id: number
  x: number
  y: number
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const animId = useRef<number>()

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 768) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => setIsHovering(true)
    const onLeave = () => setIsHovering(false)

    const onClick = (e: MouseEvent) => {
      const id = Date.now()
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('click', onClick)

    const interactives = document.querySelectorAll('a, button, [data-cursor]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // Smooth follow animation
    const animate = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) return

      // Dot snaps immediately
      dot.style.left = pos.current.x + 'px'
      dot.style.top = pos.current.y + 'px'

      // Ring lerps behind
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      ring.style.left = ringPos.current.x + 'px'
      ring.style.top = ringPos.current.y + 'px'

      animId.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      if (animId.current) cancelAnimationFrame(animId.current)
    }
  }, [])

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ transform: 'translate(-50%,-50%)' }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? 'cursor-expanded' : ''}`}
        style={{ transform: 'translate(-50%,-50%)' }}
      />

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: r.x,
              top: r.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1.5px solid rgba(236,72,153,0.6)',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
              zIndex: 99997,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

// ============================================================
// TOUCH RIPPLE — Mobile only
// ============================================================

export function TouchRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    if (window.innerWidth >= 768) return

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      const id = Date.now()
      setRipples(r => [...r, { id, x: touch.clientX, y: touch.clientY }])
      setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700)
    }

    document.addEventListener('touchstart', onTouch)
    return () => document.removeEventListener('touchstart', onTouch)
  }, [])

  return (
    <AnimatePresence>
      {ripples.map(r => (
        <motion.div
          key={r.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: r.x,
            top: r.y,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.4), transparent)',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      ))}
    </AnimatePresence>
  )
}
