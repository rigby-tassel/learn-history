import { useState, useEffect } from 'react'
import { LOADING_FACTS, LOADING_MESSAGES } from '@/constants'

export default function LoadingState({ topic }: { topic: string }) {
  const [factIndex, setFactIndex] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const t1 = setInterval(() => setFactIndex(i => (i + 1) % LOADING_FACTS.length), 3500)
    const t2 = setInterval(() => setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length), 2500)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-12 animate-phase-in">
      {/* Branded loader icon */}
      <div className="size-20 rounded-3xl bg-brand-gradient animate-pulse-ring flex items-center justify-center shadow-xl">
        <span className="text-3xl">🧭</span>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-black text-foreground mb-1">
          Exploring <span className="text-gradient-brand">{topic}</span>
        </h2>
        <p className="text-sm text-muted-foreground h-5 transition-opacity" key={msgIndex}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Gradient progress bar */}
      <div className="w-full max-w-xs">
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand-gradient rounded-full animate-loading-bar" />
        </div>
      </div>

      {/* Skeleton card preview */}
      <div className="w-full max-w-xs space-y-3">
        <div className="h-28 rounded-2xl skeleton-shimmer" />
        <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
        <div className="h-3 w-full rounded-full skeleton-shimmer" />
        <div className="h-3 w-5/6 rounded-full skeleton-shimmer" />
      </div>

      {/* Rotating facts */}
      <div className="bg-card rounded-2xl px-5 py-4 max-w-xs text-center shadow-md border border-border">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Did you know?</p>
        <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in" key={factIndex}>
          {LOADING_FACTS[factIndex]}
        </p>
      </div>
    </div>
  )
}
