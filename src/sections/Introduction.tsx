import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// INTRODUCTION — Emotional quote with split text reveal
// ============================================================

const quote = "In a world full of storms, you were the kind of calm that feels like sunshine after rain."
const words = quote.split(' ')

const sparklePositions = [
  { x: '10%', y: '20%' }, { x: '85%', y: '15%' }, { x: '20%', y: '80%' },
  { x: '75%', y: '70%' }, { x: '50%', y: '10%' }, { x: '30%', y: '60%' },
  { x: '65%', y: '85%' }, { x: '90%', y: '45%' },
]

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      style={{ position: 'absolute', ...style, pointerEvents: 'none' }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 4,
        ease: 'easeInOut',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
          fill="#C084FC"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  )
}

export default function Introduction() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' })
  const bgRef = useRef<HTMLDivElement>(null)

  // Parallax bg shift on scroll
  useEffect(() => {
    const el = bgRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: self => {
        el.style.transform = `translateY(${self.progress * 60 - 30}px)`
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
    >
      {/* Background radial */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '80vw',
            height: '80vw',
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <Sparkle key={i} style={pos} />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span
            className="font-vibes text-5xl"
            style={{ color: '#D8B4FE' }}
          >
            Our Story
          </span>
        </motion.div>

        {/* Split word quote */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-16">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="font-playfair"
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
                color: i % 5 === 0
                  ? '#C084FC'
                  : i % 5 === 2
                  ? '#F9A8D4'
                  : 'rgba(250,250,255,0.9)',
                display: 'inline-block',
              }}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3 + i * 0.07,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Author attribution */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 + words.length * 0.07 + 0.3, duration: 0.8 }}
        >
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(192,132,252,0.5))' }} />
          <span className="font-grotesk text-sm tracking-wide" style={{ color: 'rgba(192,132,252,0.6)' }}>
            — Muskan
          </span>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(192,132,252,0.5))' }} />
        </motion.div>

        {/* Stats / heartfelt numbers */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { num: '∞', label: 'Memories Made' },
            { num: '17', label: 'Chapters Together' },
            { num: '1', label: 'Best Friend' },
            { num: '♾', label: 'Forever Bond' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-1"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span
                className="font-playfair"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#D8B4FE' }}
              >
                {stat.num}
              </span>
              <span
                className="font-grotesk text-xs tracking-wide text-center"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
