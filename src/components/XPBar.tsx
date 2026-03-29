import { useGameState } from '@/hooks/useGameState'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function XPBar() {
  const { state, currentLevel, xpProgress } = useGameState()

  return (
    <div className="flex items-center gap-1.5">
      <Badge variant="secondary" className="gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold">
        <span className="size-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center">
          {currentLevel.level}
        </span>
        <Progress value={xpProgress * 100} className="w-10 h-1.5" />
        <span className="text-muted-foreground">{state.xp}</span>
      </Badge>
    </div>
  )
}
