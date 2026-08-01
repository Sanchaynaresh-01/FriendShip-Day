import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// MUSIC PLAYER — Floating Glass UI with ambient piano
// ============================================================

// Using a royalty-free ambient piano from a public CDN
// (User can replace with their own file)
const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [expanded, setExpanded] = useState(false)
  const [bars, setBars] = useState([0.3, 0.6, 0.4, 0.8, 0.5, 0.7, 0.4, 0.6])

  // Animate bars when playing
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setBars(b => b.map(() => 0.2 + Math.random() * 0.8))
    }, 150)
    return () => clearInterval(interval)
  }, [playing])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.volume = volume
      audio.play().catch(() => {})
    }
    setPlaying(p => !p)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(m => !m)
  }

  const changeVolume = (v: number) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="none" />

      <motion.div
        className="glass-purple rounded-3xl overflow-hidden"
        style={{
          boxShadow: '0 8px 32px rgba(139,92,246,0.2), inset 0 0 20px rgba(139,92,246,0.05)',
        }}
        animate={{ width: expanded ? 220 : 52, height: expanded ? 140 : 52 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.button
              key="orb"
              onClick={() => setExpanded(true)}
              className="w-full h-full flex items-center justify-center cursor-none"
              data-cursor
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Music icon / waveform */}
              <div className="flex items-end gap-[3px]">
                {bars.slice(0, 4).map((h, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: 3,
                      background: playing
                        ? 'linear-gradient(to top, #8B5CF6, #EC4899)'
                        : 'rgba(192,132,252,0.5)',
                    }}
                    animate={{ height: playing ? h * 18 + 4 : 8 }}
                    transition={{ duration: 0.15 }}
                  />
                ))}
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="panel"
              className="p-4 flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span
                  className="font-grotesk text-xs tracking-wider"
                  style={{ color: 'rgba(192,132,252,0.8)' }}
                >
                  ♪ Ambient
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-xs cursor-none opacity-50 hover:opacity-100"
                  style={{ color: '#C084FC' }}
                >
                  ×
                </button>
              </div>

              {/* Waveform bars */}
              <div className="flex items-end justify-center gap-[3px] h-8">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: 4,
                      background: playing
                        ? 'linear-gradient(to top, #8B5CF6, #EC4899)'
                        : 'rgba(192,132,252,0.3)',
                    }}
                    animate={{ height: playing ? h * 28 + 4 : 6 }}
                    transition={{ duration: 0.15 }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleMute}
                  className="cursor-none opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: '#C084FC' }}
                >
                  {muted ? '🔇' : '🔊'}
                </button>

                <button
                  onClick={togglePlay}
                  className="cursor-none flex items-center justify-center rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                  }}
                  data-cursor
                >
                  <span style={{ fontSize: 12 }}>
                    {playing ? '⏸' : '▶'}
                  </span>
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={e => changeVolume(Number(e.target.value))}
                  className="cursor-none"
                  style={{
                    width: 48,
                    accentColor: '#8B5CF6',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
