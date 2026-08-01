import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// LOADER — Cinematic loading screen with particle heart
// ============================================================

interface LoaderProps {
  onComplete: () => void
}

const NUM_LOADER_STARS = 80
const HEART_PARTICLES = 60

function heartPoint(t: number): [number, number] {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return [x, y]
}

export default function Loader({ onComplete }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'heart' | 'explode' | 'reveal'>('loading')
  const [visible, setVisible] = useState(true)

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 3 + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Phase transitions
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setPhase('heart'), 300)
      setTimeout(() => setPhase('explode'), 1800)
      setTimeout(() => setPhase('reveal'), 2600)
      setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 3400)
    }
  }, [progress, onComplete])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    const particles: {
      x: number; y: number; tx: number; ty: number;
      vx: number; vy: number; color: string; size: number;
      angle: number; speed: number; gathered: boolean;
    }[] = []

    // Generate heart target positions
    for (let i = 0; i < HEART_PARTICLES; i++) {
      const t = (i / HEART_PARTICLES) * Math.PI * 2
      const [hx, hy] = heartPoint(t)
      const scale = 8
      particles.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        tx: 200 + hx * scale,
        ty: 200 + hy * scale,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${280 + Math.random() * 60},80%,${60 + Math.random() * 20}%)`,
        size: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        gathered: false,
      })
    }

    let animId: number
    let gatherMode = false
    let explodeMode = false
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, 400, 400)

      particles.forEach(p => {
        if (explodeMode) {
          p.vx += (Math.random() - 0.5) * 2
          p.vy += (Math.random() - 0.5) * 2
          p.x += p.vx
          p.y += p.vy
          p.size *= 0.97
        } else if (gatherMode) {
          p.x += (p.tx - p.x) * 0.05
          p.y += (p.ty - p.y) * 0.05
        } else {
          p.x += Math.sin(t * p.speed + p.angle) * 0.5
          p.y += Math.cos(t * p.speed + p.angle) * 0.5
        }

        ctx.save()
        ctx.globalAlpha = explodeMode ? Math.max(0, p.size / 3) : 0.9
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()

    // Phase control
    const h = setTimeout(() => { gatherMode = true }, 100)
    const e = setTimeout(() => { explodeMode = true }, 1500)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(h)
      clearTimeout(e)
    }
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="loader-container"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* Background stars */}
        <div className="absolute inset-0">
          {Array.from({ length: NUM_LOADER_STARS }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 2 + 0.5,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-8"
          animate={phase === 'reveal' ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Particle canvas */}
          <motion.div
            animate={
              phase === 'explode'
                ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.8 }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: 200, height: 200 }}
            />
          </motion.div>

          {/* Text */}
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div
                key="loading"
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p
                  className="font-grotesk text-sm tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(192,132,252,0.8)' }}
                >
                  Loading Memories
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Circular progress */}
          <div className="relative" style={{ width: 60, height: 60 }}>
            <svg viewBox="0 0 60 60" className="rotate-[-90deg]" width="60" height="60">
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="rgba(139,92,246,0.15)"
                strokeWidth="2"
              />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="url(#loaderGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - Math.min(progress, 100) / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s ease' }}
              />
              <defs>
                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-grotesk text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {Math.round(Math.min(progress, 100))}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Heart burst explosion overlay */}
        <AnimatePresence>
          {phase === 'explode' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(236,72,153,0.8), rgba(139,92,246,0.4), transparent)',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal flash */}
        <AnimatePresence>
          {phase === 'reveal' && (
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(139,92,246,0.1)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
