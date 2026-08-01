import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ============================================================
// FINAL SURPRISE — Crystal Heart + Confetti + Aurora Burst
// ============================================================

interface Confetti {
  id: number
  x: number
  color: string
  size: number
  duration: number
  delay: number
  cx: string
}

interface StarParticle {
  id: number
  x: number
  y: number
  size: number
  angle: number
  speed: number
  opacity: number
}

function generateConfetti(count: number): Confetti[] {
  const colors = ['#8B5CF6', '#EC4899', '#C084FC', '#F9A8D4', '#D8B4FE', '#fff']
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    cx: `${(Math.random() - 0.5) * 200}px`,
  }))
}

function CrystalHeart({ glowing }: { glowing: boolean }) {
  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      {/* Glow rings */}
      {glowing && Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ borderRadius: '50%' }}
          animate={{
            scale: [1, 2 + i * 0.5, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100 160 C 100 160 30 120 30 75 C 30 52 47 40 65 46 C 79 50 100 65 100 65 C 100 65 121 50 135 46 C 153 40 170 52 170 75 C 170 120 100 160 100 160 Z"
              fill={`rgba(${i === 0 ? '236,72,153' : i === 1 ? '139,92,246' : '192,132,252'},0.3)`}
              style={{ filter: `blur(${(i + 1) * 8}px)` }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Heart SVG */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="30%" stopColor="#EC4899" />
            <stop offset="70%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="heartShine" x1="20%" y1="10%" x2="60%" y2="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Heart base */}
        <path
          d="M 100 160 C 100 160 30 120 30 75 C 30 52 47 40 65 46 C 79 50 100 65 100 65 C 100 65 121 50 135 46 C 153 40 170 52 170 75 C 170 120 100 160 100 160 Z"
          fill="url(#heartGrad)"
          filter="url(#heartGlow)"
        />
        {/* Crystal facets */}
        <path
          d="M 100 65 L 75 100 L 100 140 L 125 100 Z"
          fill="rgba(255,255,255,0.15)"
        />
        <path
          d="M 100 65 L 30 75 L 75 100 Z"
          fill="rgba(255,255,255,0.1)"
        />
        <path
          d="M 100 65 L 170 75 L 125 100 Z"
          fill="rgba(255,255,255,0.08)"
        />
        {/* Shine */}
        <path
          d="M 100 65 C 100 65 121 50 135 46 C 120 55 110 65 100 65 Z"
          fill="url(#heartShine)"
        />
        {/* Sparkle dots */}
        <circle cx="60" cy="65" r="3" fill="rgba(255,255,255,0.8)" />
        <circle cx="145" cy="58" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="100" cy="148" r="2.5" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  )
}

export default function FinalSurprise() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })
  const [triggered, setTriggered] = useState(false)
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [stars, setStars] = useState<StarParticle[]>([])

  useEffect(() => {
    if (isInView && !triggered) {
      setTimeout(() => {
        setTriggered(true)
        setConfetti(generateConfetti(80))
        setStars(Array.from({ length: 40 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          angle: Math.random() * 360,
          speed: Math.random() * 3 + 1,
          opacity: Math.random(),
        })))
      }, 600)
    }
  }, [isInView, triggered])

  const handleActivate = () => {
    setTriggered(true)
    setConfetti(generateConfetti(80))
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden"
    >
      {/* Aurora burst background */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 40%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Confetti rain */}
      <AnimatePresence>
        {triggered && confetti.map(c => (
          <motion.div
            key={c.id}
            className="absolute pointer-events-none rounded-sm"
            style={{
              left: `${c.x}%`,
              top: -20,
              width: c.size,
              height: c.size * 2,
              background: c.color,
              '--cx': c.cx,
            } as React.CSSProperties}
            animate={{
              y: '110vh',
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              x: [0, c.cx],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: 'linear',
              repeat: 2,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Star burst particles */}
      <AnimatePresence>
        {triggered && stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: s.size,
              height: s.size,
              background: 'rgba(216,180,254,0.8)',
              boxShadow: '0 0 4px rgba(216,180,254,0.5)',
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(s.angle * Math.PI / 180) * 300 * s.speed,
              y: Math.sin(s.angle * Math.PI / 180) * 300 * s.speed,
              opacity: 0,
              scale: [1, 0.5],
            }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        ))}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-vibes text-6xl gradient-text">A Special Surprise</span>
          <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
            Just For You, Saumya
          </p>
        </motion.div>

        {/* Crystal Heart */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.div
            animate={triggered ? {
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            } : {
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: triggered ? 0.6 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            onClick={handleActivate}
            style={{ cursor: 'none' }}
            data-cursor
          >
            <CrystalHeart glowing={triggered} />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p
            className="font-playfair text-xl italic leading-relaxed"
            style={{ color: 'rgba(249,168,212,0.9)' }}
          >
            "You are the heart of every adventure, the laughter in every story, and the soul of every memory."
          </p>
        </motion.div>

        {/* Activate button */}
        {!triggered && (
          <motion.button
            onClick={handleActivate}
            className="magnetic-btn cursor-none"
            style={{ color: 'white' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            data-cursor
          >
            <span className="font-grotesk text-sm">Reveal the Surprise ✨</span>
          </motion.button>
        )}

        {/* Glow explosion message */}
        <AnimatePresence>
          {triggered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center"
            >
              <motion.p
                className="font-vibes text-4xl md:text-5xl"
                style={{ color: '#F9A8D4' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Happy Friendship Day! 🎊
              </motion.p>
              <p className="font-grotesk text-sm mt-3" style={{ color: 'rgba(216,180,254,0.7)' }}>
                You deserve all the magic in the world 💜
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
