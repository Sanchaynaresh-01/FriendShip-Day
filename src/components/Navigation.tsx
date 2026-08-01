import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Images, Film, Mail, Star } from 'lucide-react'

// ============================================================
// NAVIGATION — Floating Glass Orb, Dynamic Island style
// ============================================================

const navItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'video', label: 'Video', icon: Film },
  { id: 'letter', label: 'Letter', icon: Mail },
  { id: 'ending', label: 'End', icon: Star },
]

export default function Navigation() {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState('hero')
  const [hidden, setHidden] = useState(false)
  let hideTimer: ReturnType<typeof setTimeout>

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(n => document.getElementById(n.id))
      const scrollY = window.scrollY + window.innerHeight / 2

      sections.forEach((section, i) => {
        if (section && scrollY >= section.offsetTop) {
          setActive(navItems[i].id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setExpanded(false)
  }

  const handleMouseEnter = () => {
    clearTimeout(hideTimer)
    setHidden(false)
  }

  const handleMouseLeave = () => {
    hideTimer = setTimeout(() => {
      if (!expanded) setHidden(false)
    }, 3000)
  }

  return (
    <div
      className="nav-orb"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-2 items-end"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {navItems.map((item, i) => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass cursor-none group"
                  style={{
                    background: isActive
                      ? 'rgba(139,92,246,0.25)'
                      : 'rgba(255,255,255,0.04)',
                    border: isActive
                      ? '1px solid rgba(139,92,246,0.4)'
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isActive
                      ? '0 0 20px rgba(139,92,246,0.2)'
                      : 'none',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon
                    size={14}
                    style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.5)' }}
                  />
                  <span
                    className="font-grotesk text-xs tracking-wide"
                    style={{ color: isActive ? '#C084FC' : 'rgba(255,255,255,0.6)' }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main orb button */}
      <motion.button
        onClick={() => setExpanded(e => !e)}
        className="cursor-none relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={expanded ? { rotate: 45 } : { rotate: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        data-cursor
      >
        <div
          className="glass-purple rounded-full flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
            boxShadow: '0 0 30px rgba(139,92,246,0.4), inset 0 0 20px rgba(139,92,246,0.1)',
          }}
        >
          <motion.div
            animate={expanded ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {expanded ? (
              <span style={{ fontSize: 20 }}>×</span>
            ) : (
              <span style={{ fontSize: 16 }}>✦</span>
            )}
          </motion.div>
        </div>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(139,92,246,0.4)',
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.button>
    </div>
  )
}
