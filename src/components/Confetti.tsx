import { useState, useEffect } from 'react'

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#3b82f6']
const PIECE_COUNT = 30

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a
}

export default function Confetti() {
  const [show, setShow] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const handler = () => {
      setKey(k => k + 1)
      setShow(true)
      setTimeout(() => setShow(false), 2500)
    }
    window.addEventListener('game-confetti', handler)
    return () => window.removeEventListener('game-confetti', handler)
  }, [])

  if (!show) return null

  return (
    <div key={key} className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {Array.from({ length: PIECE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${randomBetween(10, 90)}%`,
            backgroundColor: COLORS[i % COLORS.length],
            '--confetti-x': `${randomBetween(-100, 100)}px`,
            '--confetti-rotate': `${randomBetween(360, 1080)}deg`,
            '--confetti-duration': `${randomBetween(1.2, 2.4)}s`,
            '--confetti-delay': `${randomBetween(0, 0.3)}s`,
            width: `${randomBetween(6, 12)}px`,
            height: `${randomBetween(4, 8)}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
