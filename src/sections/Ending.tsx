import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

// ============================================================
// ENDING — Stars gather into heart → moon → fade
// ============================================================

const NUM_ENDING_STARS = 80

function heartPoint(t: number, scale = 1): [number, number] {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return [x * scale, y * scale]
}

export default function Ending() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'idle' | 'gather' | 'heart' | 'moon' | 'text'>('idle')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          setTimeout(() => setPhase('gather'), 800)
          setTimeout(() => setPhase('heart'), 2500)
          setTimeout(() => setPhase('moon'), 4500)
          setTimeout(() => setPhase('text'), 6000)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Canvas star animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const W = canvas.width
    const H = canvas.height

    // Generate star particles
    const stars = Array.from({ length: NUM_ENDING_STARS }, (_, i) => {
      const t = (i / NUM_ENDING_STARS) * Math.PI * 2
      const [hx, hy] = heartPoint(t, 14)
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        tx: W / 2 + hx,
        ty: H / 2 + hy,
        mx: W / 2,
        my: H / 2,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random(),
        color: `hsl(${270 + Math.random() * 60},80%,${60 + Math.random() * 20}%)`,
        gathered: false,
        phase: 'float',
      }
    })

    let animId: number
    let t = 0
    let gatherMode = false
    let moonMode = false

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      stars.forEach((s, i) => {
        if (moonMode) {
          // Converge to center
          s.x += (s.mx - s.x) * 0.02
          s.y += (s.my - s.y) * 0.02
          s.size = Math.max(0.1, s.size * 0.99)
        } else if (gatherMode) {
          // Move toward heart position
          s.x += (s.tx - s.x) * 0.04
          s.y += (s.ty - s.y) * 0.04
        } else {
          // Float randomly
          s.x += Math.sin(t * 0.01 + i * 0.3) * 0.3
          s.y += Math.cos(t * 0.008 + i * 0.4) * 0.3
        }

        ctx.save()
        ctx.globalAlpha = moonMode ? Math.max(0, s.opacity * (1 - t * 0.002)) : s.opacity
        ctx.fillStyle = s.color
        ctx.shadowColor = s.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.1, s.size), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()

    // Phase listeners
    const phaseHandler = () => {}

    return () => {
      cancelAnimationFrame(animId)
    }

    // Watch phase state via direct timer inside canvas
  }, [])

  // Control gather/moon via phase
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Re-trigger animation phases by dispatching custom event
    if (phase === 'gather') {
      canvas.dataset.phase = 'gather'
    } else if (phase === 'moon') {
      canvas.dataset.phase = 'moon'
    }
  }, [phase])

  const finalText = [
    'Some people become memories...',
    'You became home.',
  ]

  return (
    <section
      id="ending"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* Star canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Moon phase */}
      <AnimatePresence>
        {phase === 'moon' && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FAFAFF, #e8d5ff 40%, #c084fc 80%, #8b5cf6)',
              boxShadow: '0 0 60px rgba(216,180,254,0.6), 0 0 120px rgba(139,92,246,0.3)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Heart shape flash */}
      <AnimatePresence>
        {phase === 'heart' && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <svg width="200" height="200" viewBox="-20 -20 40 40">
              <path
                d="M 0 8 C 0 8 -10 4 -10 -2 C -10 -7 -5 -10 0 -5 C 5 -10 10 -7 10 -2 C 10 4 0 8 0 8 Z"
                fill="url(#endHeartGrad)"
              />
              <defs>
                <radialGradient id="endHeartGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F9A8D4" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final text */}
      <AnimatePresence>
        {phase === 'text' && (
          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {finalText.map((line, i) => (
              <motion.p
                key={i}
                className={i === 0 ? 'font-playfair italic' : 'font-vibes'}
                style={{
                  fontSize: i === 0 ? 'clamp(1.2rem, 3vw, 2.2rem)' : 'clamp(2rem, 6vw, 4.5rem)',
                  color: i === 0 ? 'rgba(249,168,212,0.9)' : '#D8B4FE',
                  textShadow: '0 0 40px rgba(192,132,252,0.5)',
                  display: 'block',
                  marginBottom: i === 0 ? 16 : 0,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.8, duration: 1, ease: 'easeOut' }}
              >
                {line}
              </motion.p>
            ))}

            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <div className="h-px w-40 mx-auto mb-4" style={{ background: 'rgba(192,132,252,0.3)' }} />
              <p className="font-grotesk text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(192,132,252,0.5)' }}>
                Made with love by Muskan
              </p>
              <motion.div
                className="flex justify-center gap-2 mt-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span style={{ fontSize: 20 }}>💜</span>
                <span style={{ fontSize: 20 }}>🌙</span>
                <span style={{ fontSize: 20 }}>✨</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </section>
  )
}
