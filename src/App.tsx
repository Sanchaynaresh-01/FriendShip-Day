import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react';
// Core components
import AnimatedBackground from './components/AnimatedBackground'
import CustomCursor, { TouchRipple } from './components/CustomCursor'
import Loader from './components/Loader'
import Navigation from './components/Navigation'
import MusicPlayer from './components/MusicPlayer'
import ScrollProgress from './components/ScrollProgress'

// Sections
import Hero from './sections/Hero'
import Introduction from './sections/Introduction'
import PhotoStory from './sections/PhotoStory'
import VideoSection from './sections/VideoSection'
import LetterSection from './sections/LetterSection'
import FinalSurprise from './sections/FinalSurprise'
import Ending from './sections/Ending'

// ============================================================
// APP ROOT
// ============================================================

export default function App() {
  const [loaded, setLoaded] = useState(false)

  // Initialize lenis smooth scroll
  useEffect(() => {
    if (!loaded) return

    // Simple smooth scroll with native behavior for compatibility
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [loaded])

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Main site */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Persistent UI */}
            <CustomCursor />
            <TouchRipple />
            <ScrollProgress />
            <Navigation />
            <MusicPlayer />

            {/* Global background (fixed, behind everything) */}
            <AnimatedBackground />

            {/* Page content */}
            <main style={{ position: 'relative', zIndex: 1 }}>
              {/* HERO */}
              <Hero />

              {/* Separator */}
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.3), transparent)',
                  margin: '0 10%',
                }}
              />

              {/* INTRODUCTION */}
              <Introduction />

              {/* PHOTO STORY — All 8 chapters */}
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)',
                  margin: '0 5%',
                }}
              />
              <PhotoStory />

              {/* VIDEO */}
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.3), rgba(139,92,246,0.3), transparent)',
                  margin: '0 10%',
                }}
              />
              <VideoSection />

              {/* LETTER */}
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.3), transparent)',
                  margin: '0 10%',
                }}
              />
              <LetterSection />

              {/* FINAL SURPRISE */}
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.3), transparent)',
                  margin: '0 5%',
                }}
              />
              <FinalSurprise />

              {/* ENDING */}
              <Ending />
            </main>

            {/* Footer */}
            <footer
              className="relative z-10 py-8 text-center"
              style={{
                background: 'rgba(8,3,18,0.9)',
                borderTop: '1px solid rgba(139,92,246,0.1)',
              }}
            >
              <motion.p
                className="font-grotesk text-xs tracking-[0.3em] uppercase"
                style={{ color: 'rgba(192,132,252,0.4)' }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Made with 💜 by Muskan — For Saumya, Always
              </motion.p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </>
  )
}
