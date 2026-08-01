import { useEffect, useRef, useState } from 'react'

// ============================================================
// ANIMATED BACKGROUND — Aurora + Stars + Blobs + Fireflies
// ============================================================

const NUM_STARS = 120
const NUM_FIREFLIES = 18
const NUM_BLOBS = 4

function generateStars() {
  return Array.from({ length: NUM_STARS }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 8,
    duration: Math.random() * 4 + 3,
  }))
}

function generateFireflies() {
  return Array.from({ length: NUM_FIREFLIES }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 10,
    fx: `${(Math.random() - 0.5) * 200}px`,
    fy: `${(Math.random() - 0.5) * 200}px`,
  }))
}

const blobs = [
  { color: 'rgba(139,92,246,0.18)', w: 500, h: 500, x: -100, y: -100, duration: 18 },
  { color: 'rgba(236,72,153,0.14)', w: 400, h: 400, x: '60%', y: '20%', duration: 22 },
  { color: 'rgba(192,132,252,0.12)', w: 350, h: 350, x: '20%', y: '60%', duration: 15 },
  { color: 'rgba(249,168,212,0.10)', w: 300, h: 300, x: '70%', y: '70%', duration: 25 },
]

export default function AnimatedBackground() {
  const [stars] = useState(generateStars)
  const [fireflies] = useState(generateFireflies)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Aurora layers
      const auroraColors = [
        ['rgba(139,92,246,0.06)', 'rgba(236,72,153,0.04)', 'transparent'],
        ['rgba(192,132,252,0.05)', 'rgba(139,92,246,0.03)', 'transparent'],
        ['rgba(236,72,153,0.04)', 'rgba(249,168,212,0.03)', 'transparent'],
      ]

      auroraColors.forEach((colors, i) => {
        const offset = Math.sin(t * 0.001 + i * 1.2) * 0.3
        const grd = ctx.createLinearGradient(
          0, canvas.height * (0.2 + offset),
          canvas.width, canvas.height * (0.8 - offset)
        )
        grd.addColorStop(0, colors[0])
        grd.addColorStop(0.5, colors[1])
        grd.addColorStop(1, colors[2])
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Animated nebula
      const x = canvas.width * (0.5 + Math.sin(t * 0.0003) * 0.2)
      const y = canvas.height * (0.5 + Math.cos(t * 0.0004) * 0.2)
      const nebula = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.6)
      nebula.addColorStop(0, 'rgba(139,92,246,0.04)')
      nebula.addColorStop(0.4, 'rgba(192,132,252,0.02)')
      nebula.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 50%), #080312',
        }}
      />

      {/* Canvas aurora */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Animated blobs */}
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: typeof b.x === 'number' ? b.x : b.x,
            top: typeof b.y === 'number' ? b.y : b.y,
            width: b.w,
            height: b.h,
            background: b.color,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(60px)',
            animation: `blobMorph ${b.duration}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
          }}
        />
      ))}

      {/* Stars */}
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Fireflies */}
      {fireflies.map(f => (
        <div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            '--fx': f.fx,
            '--fy': f.fy,
          } as React.CSSProperties}
        >
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'rgba(192,132,252,0.9)',
              boxShadow: '0 0 6px 2px rgba(192,132,252,0.6)',
              animation: `firefly ${f.duration}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        </div>
      ))}

      {/* Gradient mesh overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(8,3,18,0.8) 0%, transparent 80%)',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
