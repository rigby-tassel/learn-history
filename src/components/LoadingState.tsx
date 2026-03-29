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
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-12 animate-phase-in">
      <div className="text-6xl animate-spin-slow">🌍</div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Exploring {topic}
        </h2>
        <p className="text-sm text-slate-400 h-5 transition-opacity" key={msgIndex}>
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
      </div>

      {/* Rotating facts */}
      <div className="bg-white/80 backdrop-blur rounded-2xl px-5 py-4 max-w-xs text-center shadow-sm">
        <p className="text-xs font-semibold text-primary uppercase mb-1.5">Did you know?</p>
        <p className="text-sm text-slate-600 leading-relaxed animate-fade-in" key={factIndex}>
          {LOADING_FACTS[factIndex]}
        </p>
      </div>
    </div>
  )
}
