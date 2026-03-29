import { useGameState } from '@/hooks/useGameState'

export default function XPBar() {
  const { state, currentLevel, xpProgress } = useGameState()

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-1">
        <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {currentLevel.level}
        </span>
        <div className="w-12 h-1.5 bg-primary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${Math.round(xpProgress * 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-primary">{state.xp}</span>
      </div>
    </div>
  )
}
