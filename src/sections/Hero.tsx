import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

// ============================================================
// HERO — Cinematic 100vh with Moon, Stars, Parallax
// ============================================================

const CLOUD_LAYERS = [
  { y: '25%', opacity: 0.06, scale: 1.4, speed: 0.02 },
  { y: '35%', opacity: 0.09, scale: 1.2, speed: 0.04 },
  { y: '45%', opacity: 0.12, scale: 1, speed: 0.06 },
]

const STARS_COUNT = 60

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [phrase, setPhrase] = useState(0)
  const [heroStars] = useState(() =>
    Array.from({ length: STARS_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 70,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
    }))
  )

  const phrases = [
    'Every friendship has a story...',
    'Ours became a universe.',
  ]

  // Phrase cycling
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhrase(1)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }

    // Gyroscope for mobile
    const onOrientation = (e: DeviceOrientationEvent) => {
      const x = (e.gamma || 0) / 45
      const y = (e.beta || 0) / 45 - 0.5
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('deviceorientation', onOrientation)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [])

  // GSAP floating particles
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLElement[] = []
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position:absolute;
        width:${Math.random() * 4 + 2}px;
        height:${Math.random() * 4 + 2}px;
        border-radius:50%;
        background:rgba(${Math.random() > 0.5 ? '139,92,246' : '236,72,153'},${0.4 + Math.random() * 0.4});
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        pointer-events:none;
        box-shadow:0 0 8px rgba(139,92,246,0.5);
      `
      container.appendChild(el)
      particles.push(el)

      gsap.to(el, {
        y: -60 - Math.random() * 80,
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 4,
        repeat: -1,
        ease: 'power2.out',
        repeatDelay: Math.random() * 2,
      })
    }

    return () => particles.forEach(p => p.remove())
  }, [])

  const scrollDown = () => {
    const next = document.getElementById('story')
    next?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'transparent' }}
    >
      {/* Stars layer — parallax */}
      <div
        ref={starsRef}
        className="absolute inset-0"
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {heroStars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 3 + s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Cloud layers — parallax */}
      {CLOUD_LAYERS.map((c, i) => (
        <div
          key={i}
          className="absolute w-full pointer-events-none"
          style={{
            top: c.y,
            opacity: c.opacity,
            transform: `translate(${mousePos.x * c.speed * 100}px, ${mousePos.y * c.speed * 50}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <svg viewBox="0 0 1440 200" className="w-full" style={{ transform: `scaleX(${c.scale})` }}>
            <path
              d="M0,100 C100,60 200,140 360,100 C500,65 600,140 720,100 C840,60 940,140 1080,100 C1200,65 1320,130 1440,100 L1440,200 L0,200 Z"
              fill="white"
            />
          </svg>
        </div>
      ))}

      {/* Moon — parallax */}
      <div
        ref={moonRef}
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          left: '50%',
          transform: `translate(calc(-50% + ${mousePos.x * 20}px), ${mousePos.y * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ position: 'relative' }}
        >
          {/* Moon glow */}
          <div
            style={{
              position: 'absolute',
              inset: -40,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(216,180,254,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
              filter: 'blur(10px)',
              animation: 'heartbeat 4s ease-in-out infinite',
            }}
          />
          {/* Moon disc */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FAFAFF 0%, #e8d5ff 40%, #c084fc 80%, #8b5cf6 100%)',
              boxShadow: '0 0 40px rgba(216,180,254,0.6), 0 0 80px rgba(139,92,246,0.3)',
            }}
          />
          {/* Crescent shadow */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 18,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(8,3,18,0.3)',
              filter: 'blur(4px)',
            }}
          />
        </motion.div>
      </div>

      {/* Aurora radial at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(139,92,246,0.12) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Main text */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4"
        style={{ marginTop: 80 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Eyebrow */}
          <motion.p
            className="font-grotesk text-xs tracking-[0.4em] uppercase mb-6"
            style={{ color: 'rgba(192,132,252,0.7)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A Friendship Universe
          </motion.p>

          {/* Animated headline */}
          <div className="relative h-[100px] md:h-[120px] flex items-center justify-center overflow-hidden">
            {phrases.map((p, i) => (
              <motion.h1
                key={i}
                className="absolute font-playfair text-glow"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
                  lineHeight: 1.3,
                  fontStyle: i === 1 ? 'italic' : 'normal',
                  color: i === 0 ? 'rgba(250,250,255,0.95)' : 'transparent',
                  backgroundImage: i === 1
                    ? 'linear-gradient(135deg, #C084FC, #EC4899, #D8B4FE)'
                    : 'none',
                  WebkitBackgroundClip: i === 1 ? 'text' : 'unset',
                  backgroundClip: i === 1 ? 'text' : 'unset',
                  WebkitTextFillColor: i === 1 ? 'transparent' : 'rgba(250,250,255,0.95)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: phrase === i ? 1 : 0,
                  y: phrase === i ? 0 : -20,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {p}
              </motion.h1>
            ))}
          </div>

          {/* Name tag */}
          <motion.div
            className="mt-6 mb-12 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div style={{ height: 1, width: 40, background: 'rgba(192,132,252,0.3)' }} />
            <span className="font-vibes text-3xl" style={{ color: '#D8B4FE' }}>
              For Saumya
            </span>
            <div style={{ height: 1, width: 40, background: 'rgba(192,132,252,0.3)' }} />
          </motion.div>

          {/* CTA button */}
          <motion.button
            onClick={scrollDown}
            className="magnetic-btn cursor-none"
            style={{ color: 'white' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            data-cursor
          >
            <span className="font-grotesk text-sm tracking-wide">Begin the Story</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Floating hearts decoration */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${10 + i * 12}%`,
              top: `${30 + Math.sin(i) * 20}%`,
              fontSize: `${10 + Math.random() * 10}px`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span
          className="font-grotesk text-xs tracking-widest uppercase"
          style={{ color: 'rgba(192,132,252,0.5)' }}
        >
          Scroll
        </span>
        <motion.div
          style={{
            width: 1.5,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(192,132,252,0.8), transparent)',
          }}
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #080312)',
        }}
      />
    </section>
  )
}
