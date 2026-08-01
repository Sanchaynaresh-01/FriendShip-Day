import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { images } from '../assets/images'

// ============================================================
// VIDEO SECTION — Premium Glass Player
// ============================================================

export default function VideoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { margin: '-30%' })
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>()

  // Auto-play when visible
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isInView) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }, [isInView])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      video.pause()
      setPlaying(false)
    } else {
      video.play()
      setPlaying(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !muted
    setMuted(m => !m)
  }

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    setProgress(video.currentTime / video.duration * 100 || 0)
    setDuration(video.duration || 0)
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Number(e.target.value) / 100 * video.duration
  }

  const formatTime = (s: number) => {
    if (isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  return (
    <section id="video" className="relative py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-vibes text-6xl gradient-text">A Moving Memory</span>
        <p className="font-grotesk text-sm tracking-widest uppercase mt-3" style={{ color: 'rgba(192,132,252,0.6)' }}>
          In Motion
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Blur background layer */}
        <div
          className="absolute -inset-8 rounded-[40px] overflow-hidden opacity-30 blur-2xl"
          style={{ zIndex: -1 }}
        >
          <video src={images.video} muted autoPlay loop playsInline className="w-full h-full object-cover" />
        </div>

        {/* Glass container */}
        <div
          className="video-player-container glass-strong"
          style={{
            borderRadius: 32,
            border: '1px solid rgba(192,132,252,0.2)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.15), inset 0 0 40px rgba(139,92,246,0.05)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { if (playing) setShowControls(false) }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src={images.video}
            muted={muted}
            loop
            playsInline
            onTimeUpdate={onTimeUpdate}
            onClick={togglePlay}
            className="w-full rounded-t-3xl"
            style={{
              display: 'block',
              cursor: 'none',
              aspectRatio: '16/9',
              objectFit: 'cover',
              borderRadius: '32px 32px 0 0',
            }}
          />

          {/* Play overlay */}
          {!playing && (
            <motion.button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-cursor
            >
              <motion.div
                className="glass-purple rounded-full flex items-center justify-center"
                style={{
                  width: 72,
                  height: 72,
                  boxShadow: '0 0 40px rgba(139,92,246,0.5)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
              </motion.div>
            </motion.button>
          )}

          {/* Controls */}
          <motion.div
            className="p-4 flex flex-col gap-3"
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={onSeek}
              className="w-full cursor-none"
              style={{ accentColor: '#8B5CF6', height: 3 }}
            />

            {/* Bottom controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="cursor-none font-grotesk text-xs px-3 py-1.5 glass-purple rounded-full"
                style={{ color: '#C084FC' }}
              >
                {playing ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                onClick={toggleMute}
                className="cursor-none text-sm"
                style={{ color: 'rgba(192,132,252,0.7)' }}
              >
                {muted ? '🔇' : '🔊'}
              </button>

              <span
                className="font-grotesk text-xs ml-auto"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Caption */}
        <motion.p
          className="text-center mt-6 font-playfair italic text-lg"
          style={{ color: 'rgba(249,168,212,0.7)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          "A moment in time, frozen forever."
        </motion.p>
      </motion.div>
    </section>
  )
}
