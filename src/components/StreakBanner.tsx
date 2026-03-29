import { useGameState } from '@/hooks/useGameState'

export default function StreakBanner() {
  const { state } = useGameState()

  if (state.streak.current < 1) return null

  return (
    <div className="flex items-center gap-0.5 text-sm font-bold text-amber-600">
      <span className={state.streak.current >= 3 ? 'animate-fire' : ''}>🔥</span>
      <span>{state.streak.current}</span>
    </div>
  )
}
