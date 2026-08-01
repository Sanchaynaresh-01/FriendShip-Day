import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ============================================================
// LETTER SECTION — Glass Envelope, Wax Seal, Paper Unfold
// ============================================================

const letterText = `Dear Saumya,

There are some people who walk into your life and quietly rearrange everything — not with grand gestures, but with small, persistent acts of being there. You are one of those people for me.

I remember the day we first really talked — how time slipped away without us noticing, and how I walked home feeling lighter than I had in months. That is who you are. You make the world lighter.

You have this rare quality of making everyone around you feel seen. Not just heard — truly seen. You listen with your whole heart, you laugh with abandon, and you love fiercely. Being your friend is one of the greatest gifts I have ever received.

There have been moments I was breaking, and somehow, without me having to say a word, you would appear — with chai, with your ridiculous sense of humour, with just your presence. You have this magic, Saumya, of turning ordinary moments into memories I will carry forever.

Thank you for every late night conversation. Every silly photograph. Every adventure we said we'd take and actually took. Every time you believed in me when I had forgotten to believe in myself.

You are not just my best friend. You are home. You are the universe I never knew I was searching for, and every day I am grateful that our stories collided.

Happy Friendship Day, my dearest Saumya. Here is to forever.

With all the love in my heart,
Muskan 💜`

const letterLines = letterText.split('\n').filter(l => l !== '')

function FloatingHeart({ delay = 0 }) {
  return (
    <motion.span
      className="absolute text-pink-400 pointer-events-none"
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        fontSize: `${12 + Math.random() * 10}px`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      ♥
    </motion.span>
  )
}

export default function LetterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })
  const [opened, setOpened] = useState(false)
  const [typedLines, setTypedLines] = useState<string[]>([])
  const [typingDone, setTypingDone] = useState(false)

  // Typewriter effect for letter lines
  useEffect(() => {
    if (!opened) return

    let i = 0
    const interval = setInterval(() => {
      if (i < letterLines.length) {
        setTypedLines(prev => [...prev, letterLines[i]])
        i++
      } else {
        clearInterval(interval)
        setTypingDone(true)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [opened])

  return (
    <section
      id="letter"
      ref={ref}
      className="relative min-h-screen py-24 px-4 flex items-center justify-center overflow-hidden"
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(236,72,153,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating hearts */}
      {Array.from({ length: 12 }, (_, i) => (
        <FloatingHeart key={i} delay={i * 0.5} />
      ))}

      <div className="max-w-2xl w-full mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-vibes text-6xl" style={{ color: '#F9A8D4' }}>A Letter For You</span>
          <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
            From the Heart
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!opened ? (
            /* Envelope closed */
            <motion.div
              key="envelope"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Envelope SVG */}
              <div className="relative" style={{ width: 280, height: 200 }}>
                <svg viewBox="0 0 280 200" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(192,132,252,0.15)" />
                      <stop offset="100%" stopColor="rgba(236,72,153,0.1)" />
                    </linearGradient>
                    <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139,92,246,0.2)" />
                      <stop offset="100%" stopColor="rgba(192,132,252,0.1)" />
                    </linearGradient>
                  </defs>
                  {/* Envelope body */}
                  <rect x="0" y="20" width="280" height="180" rx="12" fill="url(#envGrad)" stroke="rgba(192,132,252,0.3)" strokeWidth="1" />
                  {/* Envelope flap */}
                  <path d="M 0 20 L 140 110 L 280 20 Z" fill="url(#flapGrad)" stroke="rgba(192,132,252,0.2)" strokeWidth="1" />
                  {/* Bottom triangles */}
                  <path d="M 0 200 L 120 110 L 0 20 Z" fill="rgba(139,92,246,0.08)" />
                  <path d="M 280 200 L 160 110 L 280 20 Z" fill="rgba(139,92,246,0.08)" />
                  {/* Bottom seam */}
                  <path d="M 0 200 L 140 110 L 280 200 Z" fill="rgba(192,132,252,0.06)" />
                </svg>

                {/* Wax seal */}
                <motion.div
                  className="absolute"
                  style={{
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 52,
                    height: 52,
                    background: 'radial-gradient(circle, #EC4899, #8B5CF6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(236,72,153,0.4), inset 0 0 10px rgba(0,0,0,0.2)',
                    fontSize: 20,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ♥
                </motion.div>
              </div>

              {/* Open button */}
              <motion.button
                onClick={() => setOpened(true)}
                className="magnetic-btn cursor-none"
                style={{ color: 'white', fontSize: 14 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                data-cursor
              >
                <span>Open Letter</span>
                <span>💌</span>
              </motion.button>

              <p className="font-grotesk text-xs" style={{ color: 'rgba(192,132,252,0.5)' }}>
                Click to read the letter
              </p>
            </motion.div>
          ) : (
            /* Letter paper unfolded */
            <motion.div
              key="letter"
              initial={{ opacity: 0, scaleY: 0, rotateX: -90 }}
              animate={{ opacity: 1, scaleY: 1, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformOrigin: 'top center', perspective: 800 }}
            >
              <div
                className="letter-paper rounded-2xl p-8 md:p-12 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(249,168,212,0.05), rgba(192,132,252,0.05))',
                  border: '1px solid rgba(249,168,212,0.15)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.3), inset 0 0 30px rgba(139,92,246,0.03)',
                }}
              >
                {/* Paper lines decoration */}
                <div className="absolute inset-8 pointer-events-none">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: i * 30,
                        height: 1,
                        background: 'rgba(192,132,252,0.06)',
                      }}
                    />
                  ))}
                </div>

                {/* Letter content */}
                <div className="relative z-10 space-y-4">
                  {typedLines.map((line, i) => {
                    const safeStart = (prefix: string) => typeof line === 'string' && line.startsWith(prefix)
                    const isSpecial = safeStart('Dear') || safeStart('With') || safeStart('Muskan')
                    return (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className={isSpecial ? 'font-vibes text-2xl' : 'font-poppins text-sm leading-relaxed'}
                        style={{ color: isSpecial ? '#F9A8D4' : 'rgba(250,250,255,0.85)' }}
                      >
                        {line || '\u00A0'}
                      </motion.p>
                    )
                  })}

                  {/* Typing cursor */}
                  {!typingDone && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      style={{ color: '#C084FC' }}
                    >
                      |
                    </motion.span>
                  )}
                </div>

                {/* Decorative hearts */}
                {typingDone && (
                  <motion.div
                    className="flex justify-center gap-3 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {['💜', '🌙', '✨', '💗', '🌸'].map((e, i) => (
                      <motion.span
                        key={i}
                        style={{ fontSize: 20 }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {e}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
