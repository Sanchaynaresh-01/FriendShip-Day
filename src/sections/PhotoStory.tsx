import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { images, allImages } from '../assets/images'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// PHOTO STORY — All chapters with unique layouts
// ============================================================

// ---- Lightbox ----
function Lightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={caption}
          className="w-full h-auto rounded-2xl object-contain"
          style={{ maxHeight: '85vh' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-4 text-center rounded-b-2xl"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
        >
          <p className="font-vibes text-2xl" style={{ color: '#F9A8D4' }}>{caption}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center cursor-none text-white"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  )
}

// ---- Chapter 1: Beginning — Puzzle Assembly ----
function ChapterBeginning() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  const pieces = [
    { src: images.ghibli, col: 'col-span-2 row-span-2', delay: 0 },
    { src: images.oldCollage, col: 'col-span-1 row-span-1', delay: 0.15 },
    { src: images.pinkSelfie, col: 'col-span-1 row-span-1', delay: 0.3 },
  ]

  return (
    <div ref={ref} className="relative py-24 px-4 md:px-8">
      {/* Chapter heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl gradient-text">The Beginning</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter One
        </p>
      </motion.div>

      {/* Puzzle grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-3 grid-rows-2 gap-3 h-[400px] md:h-[500px]">
        {pieces.map((piece, i) => (
          <motion.div
            key={i}
            className={`${piece.col} overflow-hidden rounded-2xl cursor-none`}
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(192,132,252,0.1)',
            }}
            initial={{
              opacity: 0,
              scale: 0.6,
              rotate: (i - 1) * 15,
              x: (i - 1) * 40,
              y: i * 20,
            }}
            animate={isInView ? {
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0,
            } : {}}
            transition={{
              duration: 1,
              delay: 0.3 + piece.delay,
              ease: [0.23, 1, 0.32, 1],
            }}
            whileHover={{ scale: 1.03, zIndex: 10 }}
            onClick={() => setLightbox(piece.src)}
            data-cursor
          >
            <img
              src={piece.src}
              alt="memory"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox} caption="The Beginning" onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 2: First Friendship — Hanging Polaroids ----
function ChapterFirstFriendship() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  const polaroids = [
    { src: images.mirrorSelfie, caption: 'Us 🪞', rotate: -8, y: 0 },
    { src: images.pinkSelfie, caption: 'Pink Day 💗', rotate: 3, y: -30 },
    { src: images.whiteOutfit, caption: 'Elegant 🤍', rotate: -5, y: 20 },
    { src: images.coupleSelfie, caption: 'Best Duo 💜', rotate: 7, y: -10 },
  ]

  return (
    <div ref={ref} className="relative py-24 px-4 overflow-hidden">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl" style={{ color: '#F9A8D4' }}>First Friendship</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter Two
        </p>
      </motion.div>

      {/* String */}
      <div className="relative max-w-4xl mx-auto">
        <svg
          className="absolute top-0 left-0 right-0 w-full"
          height="40"
          viewBox="0 0 800 40"
          style={{ pointerEvents: 'none' }}
        >
          <path
            d="M 0 20 Q 200 5 400 15 Q 600 25 800 10"
            stroke="rgba(192,132,252,0.3)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4,8"
          />
        </svg>

        {/* Polaroid hanging pins */}
        <div className="flex justify-center items-start gap-6 md:gap-10 flex-wrap pt-8">
          {polaroids.map((p, i) => (
            <motion.div
              key={i}
              className="relative"
              style={{ transformOrigin: 'top center' }}
              initial={{ opacity: 0, y: -60, rotate: p.rotate * 2 }}
              animate={isInView ? {
                opacity: 1,
                y: p.y,
                rotate: p.rotate,
              } : {}}
              transition={{
                duration: 1.2,
                delay: 0.2 + i * 0.15,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{
                rotate: 0,
                scale: 1.08,
                y: p.y - 10,
                transition: { duration: 0.3 },
              }}
              onClick={() => setLightbox(p.src)}
              data-cursor
            >
              {/* Pin */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-3 h-3 rounded-full z-10"
                style={{ background: 'linear-gradient(135deg, #C084FC, #8B5CF6)' }}
              />
              {/* Polaroid card */}
              <div
                className="polaroid cursor-none"
                style={{
                  background: 'rgba(250,250,255,0.95)',
                  boxShadow: '4px 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  className="object-cover"
                  style={{ width: 140, height: 140 }}
                  loading="lazy"
                />
                <p
                  className="font-vibes text-center mt-3 text-sm"
                  style={{ color: '#6b21a8' }}
                >
                  {p.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox} caption="First Friendship" onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 3: Beautiful Days — Glass Cards ----
function ChapterBeautifulDays() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [lightbox, setLightbox] = useState<{ src: string; cap: string } | null>(null)

  const cards = [
    { src: images.monument, caption: 'Adventures Await', desc: 'Every place feels magical with you' },
    { src: images.whiteDress, caption: 'Graceful Days', desc: 'You walk through life like poetry' },
    { src: images.teddy, caption: 'Soft Moments', desc: 'Warmth, hugs, and teddies 🧸' },
  ]

  return (
    <div ref={ref} className="relative py-24 px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl gradient-text">Beautiful Days</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter Three
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className="glass rounded-3xl overflow-hidden group cursor-none"
            style={{
              boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(139,92,246,0.05)',
              border: '1px solid rgba(192,132,252,0.15)',
            }}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{
              y: -12,
              boxShadow: '0 24px 60px rgba(139,92,246,0.25), inset 0 0 30px rgba(139,92,246,0.08)',
              borderColor: 'rgba(192,132,252,0.35)',
            }}
            onClick={() => setLightbox({ src: c.src, cap: c.caption })}
            data-cursor
          >
            <div className="relative overflow-hidden" style={{ height: 280 }}>
              <motion.img
                src={c.src}
                alt={c.caption}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(139,92,246,0.3), transparent)',
                }}
              />
            </div>
            <div className="p-5">
              <h3 className="font-playfair text-lg mb-1" style={{ color: '#D8B4FE' }}>
                {c.caption}
              </h3>
              <p className="font-grotesk text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {c.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} caption={lightbox.cap} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 4: Travelling — Fullscreen Cinematic ----
function ChapterTravelling() {
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    })

    tl.fromTo(el, { scale: 1.0, y: 0 }, { scale: 1.1, y: -80 })

    return () => { tl.kill() }
  }, [])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: '80vh', minHeight: 500 }}>
      {/* Parallax image */}
      <div ref={imgRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.1)' }}>
        <img
          src={images.palaceStairs}
          alt="Palace Stairs"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Dark overlay with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,3,18,0.3) 0%, rgba(8,3,18,0.1) 40%, rgba(8,3,18,0.7) 100%)',
        }}
      />

      {/* Slow cloud motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${20 + i * 20}%`,
              left: '-20%',
              opacity: 0.06,
            }}
            animate={{ x: ['0%', '120%'] }}
            transition={{
              duration: 20 + i * 8,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 5,
            }}
          >
            <svg width="400" height="100" viewBox="0 0 400 100">
              <path
                d="M0,50 C50,20 100,80 200,50 C300,20 350,70 400,50"
                stroke="white" strokeWidth="60" fill="none"
                strokeLinecap="round"
                style={{ filter: 'blur(20px)' }}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Caption */}
      <div className="absolute bottom-16 left-0 right-0 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="font-vibes text-5xl md:text-7xl" style={{ color: '#F9A8D4' }}>
            Travelling Together
          </span>
          <p className="font-grotesk text-sm mt-3 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Chapter Four — Every journey is better with you
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ---- Chapter 5: Cute Memories — Floating Hearts ----
function ChapterCuteMemories() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Floating hearts background */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-pink-400 select-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${12 + Math.random() * 20}px`,
            opacity: 0.15 + Math.random() * 0.2,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeInOut',
          }}
        >
          ♥
        </motion.div>
      ))}

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl" style={{ color: '#F9A8D4' }}>Cute Memories</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter Five
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {[
          { src: images.teddy, cap: 'Teddy Love 🧸', side: 'left' },
          { src: images.bouquet, cap: 'In Bloom 🌺', side: 'right' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="relative rounded-3xl overflow-hidden cursor-none"
            style={{ height: 380 }}
            initial={{
              opacity: 0,
              x: item.side === 'left' ? -80 : 80,
              rotate: item.side === 'left' ? -5 : 5,
            }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 + i * 0.2, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.03, rotate: item.side === 'left' ? 1 : -1 }}
            onClick={() => setLightbox(item.src)}
            data-cursor
          >
            <img src={item.src} alt={item.cap} className="w-full h-full object-cover" loading="lazy" />
            <div
              className="absolute inset-0 flex items-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(8,3,18,0.8), transparent)' }}
            >
              <span className="font-vibes text-3xl" style={{ color: '#F9A8D4' }}>{item.cap}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} caption="Cute Memories" onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 6: Special Moments — Rose Petals ----
function ChapterSpecialMoments() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Rose petal rain */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            fontSize: `${10 + Math.random() * 14}px`,
            '--cx': `${(Math.random() - 0.5) * 100}px`,
          } as React.CSSProperties}
          animate={{ y: '110vh', rotate: 360, x: [(Math.random() - 0.5) * 60 + 'px', (Math.random() - 0.5) * 60 + 'px'] }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        >
          🌸
        </motion.div>
      ))}

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl gradient-text">Special Moments</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter Six
        </p>
      </motion.div>

      {/* Staggered 3-column mosaic */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { src: images.blueDress, cap: 'Ocean Dreams 💙', h: 'h-72 md:h-80', delay: 0 },
          { src: images.palaceStairs, cap: 'Royal 👑', h: 'h-48 md:h-56', delay: 0.1 },
          { src: images.bouquet, cap: 'In Bloom 🌺', h: 'h-64 md:h-72', delay: 0.2 },
          { src: images.funnySelfie, cap: 'Laughing 😂', h: 'h-48', delay: 0.15 },
          { src: images.whiteDress, cap: 'Graceful 🤍', h: 'h-72', delay: 0.25 },
          { src: images.indoorFun, cap: 'Indoor Fun 🏠', h: 'h-56', delay: 0.3 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`relative ${item.h} rounded-2xl overflow-hidden cursor-none`}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 + item.delay, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.04, zIndex: 10 }}
            onClick={() => setLightbox(item.src)}
            data-cursor
          >
            <img src={item.src} alt={item.cap} className="w-full h-full object-cover" loading="lazy" />
            <motion.div
              className="absolute inset-0 flex items-end p-3 opacity-0"
              whileHover={{ opacity: 1 }}
              style={{ background: 'linear-gradient(to top, rgba(139,92,246,0.6), transparent)' }}
            >
              <span className="font-vibes text-xl text-white">{item.cap}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} caption="Special Moment" onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 7: Bench Memories — Horizontal Story ----
function ChapterBenchMemories() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  const items = [
    { src: images.benchWide, cap: 'Our Bench 🌿', desc: 'Wide and beautiful' },
    { src: images.benchClose, cap: 'Close & Cozy 💕', desc: 'Just us, together' },
    { src: images.funnySelfie, cap: 'Silly Times 😂', desc: 'Never a dull moment' },
    { src: images.finalPortrait, cap: 'You ✨', desc: 'The most beautiful soul' },
  ]

  return (
    <div ref={ref} className="relative py-24 overflow-hidden">
      <motion.div
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl" style={{ color: '#F9A8D4' }}>Bench Memories</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          Chapter Seven — Swipe to explore →
        </p>
      </motion.div>

      <div ref={scrollRef} className="horizontal-scroll-container">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="horizontal-scroll-item"
            style={{ width: 300, flexShrink: 0 }}
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="glass rounded-3xl overflow-hidden cursor-none"
              style={{
                border: '1px solid rgba(192,132,252,0.15)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
              whileHover={{ scale: 1.04, y: -8 }}
              onClick={() => setLightbox(item.src)}
              data-cursor
            >
              <div className="relative overflow-hidden" style={{ height: 340 }}>
                <motion.img
                  src={item.src}
                  alt={item.cap}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="p-5">
                <p className="font-playfair text-lg" style={{ color: '#D8B4FE' }}>{item.cap}</p>
                <p className="font-grotesk text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} caption="Bench Memory" onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ---- Chapter 8: Dream Gallery — Pinterest Masonry ----
function ChapterDreamGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5%' })
  const [lightbox, setLightbox] = useState<{ src: string; cap: string } | null>(null)

  const items = allImages.map((img, i) => ({
    ...img,
    height: [260, 340, 300, 380, 280, 320, 360, 240, 300, 350, 270, 330, 290, 310, 360, 280, 300][i % 17],
  }))

  return (
    <div ref={ref} className="relative py-24 px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl gradient-text">Dream Gallery</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          All Our Memories
        </p>
      </motion.div>

      {/* Masonry grid — CSS columns */}
      <div
        className="max-w-6xl mx-auto"
        style={{
          columns: 'var(--cols)',
          columnGap: '16px',
          ['--cols' as string]: '2',
        }}
      >
        <style>{`
          @media (min-width: 640px) { .masonry-wrap { --cols: 3 !important; } }
          @media (min-width: 1024px) { .masonry-wrap { --cols: 4 !important; } }
        `}</style>
        <div
          className="masonry-wrap"
          style={{
            columns: 2,
            columnGap: 16,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="inline-block w-full mb-4 rounded-2xl overflow-hidden cursor-none relative group"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                border: '1px solid rgba(192,132,252,0.08)',
                breakInside: 'avoid',
              }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + (i % 8) * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{
                scale: 1.03,
                zIndex: 10,
                boxShadow: '0 12px 40px rgba(139,92,246,0.3)',
                borderColor: 'rgba(192,132,252,0.3)',
              }}
              onClick={() => setLightbox({ src: item.src, cap: item.caption })}
              data-cursor
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-auto object-cover"
                style={{ display: 'block' }}
                loading="lazy"
              />
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(to top, rgba(8,3,18,0.85), rgba(139,92,246,0.2), transparent)' }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-playfair text-sm" style={{ color: '#F9A8D4' }}>{item.caption}</p>
                <p className="font-grotesk text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.description}</p>
              </motion.div>

              {/* Reflection overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} caption={lightbox.cap} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- MAIN PHOTO STORY EXPORT ----
export default function PhotoStory() {
  return (
    <div className="section-base">
      <ChapterBeginning />
      <ChapterFirstFriendship />
      <ChapterBeautifulDays />
      <ChapterTravelling />
      <ChapterCuteMemories />
      <ChapterSpecialMoments />
      <ChapterBenchMemories />
      <ChapterDreamGallery />
    </div>
  )
}
