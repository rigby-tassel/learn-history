import { useGameState } from '@/hooks/useGameState'

export default function StreakBanner() {
  const { state } = useGameState()

  if (state.streak.current < 1) return null

  return (
    <div className="flex items-center gap-1 bg-amber-500/10 rounded-full px-2.5 py-1">
      <span className={`text-sm ${state.streak.current >= 3 ? 'animate-fire' : ''}`}>🔥</span>
      <span className="text-xs font-black text-amber-600">{state.streak.current}</span>
    </div>
  )
}
