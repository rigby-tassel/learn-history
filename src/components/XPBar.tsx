import { useGameState } from '@/hooks/useGameState'

export default function XPBar() {
  const { state, currentLevel, xpProgress } = useGameState()

  return (
    <div className="flex items-center gap-1.5 bg-primary/8 rounded-full pl-1 pr-2.5 py-1">
      <span className="size-5 bg-brand-gradient text-white text-[10px] font-black rounded-full
                       flex items-center justify-center shadow-sm">
        {currentLevel.level}
      </span>
      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-brand-gradient rounded-full transition-all duration-500"
             style={{ width: `${xpProgress * 100}%` }} />
      </div>
      <span className="text-[10px] font-bold text-xp-gold">{state.xp}</span>
    </div>
  )
}
