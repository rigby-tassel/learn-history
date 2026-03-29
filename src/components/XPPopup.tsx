import { useState, useEffect } from 'react'

interface XPItem {
  id: number
  amount: number
}

let counter = 0

export default function XPPopup() {
  const [items, setItems] = useState<XPItem[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const id = ++counter
      setItems(prev => [...prev, { id, amount: detail.amount }])
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== id))
      }, 1500)
    }
    window.addEventListener('game-xp-awarded', handler)
    return () => window.removeEventListener('game-xp-awarded', handler)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="fixed top-14 right-4 z-50 flex flex-col items-end gap-1 pointer-events-none">
      {items.map((item, idx) => (
        <span
          key={item.id}
          className="animate-xp-float text-sm font-black text-xp-gold drop-shadow-md"
          style={{ marginTop: idx * -4 }}
        >
          +{item.amount} XP
        </span>
      ))}
    </div>
  )
}
