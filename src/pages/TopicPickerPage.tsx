import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import TopicInput from '@/components/TopicInput'
import { Progress } from '@/components/ui/progress'
import { useExploreSession } from '@/hooks/useExploreSession'
import { useGameState } from '@/hooks/useGameState'

export default function TopicPickerPage() {
  const navigate = useNavigate()
  const { startSession, resetSession } = useExploreSession()
  const { currentLevel, xpProgress, state, recordSessionStart } = useGameState()

  const handleTopicSelect = (topic: string) => {
    resetSession()
    startSession(topic)
    recordSessionStart()
    navigate('/session')
  }

  return (
    <ExploreLayout hideHeader>
      <div className="flex flex-col h-dvh">
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-sm font-semibold text-foreground">Explorer</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-bold text-primary">Lv {currentLevel.level}</span>
            <Progress value={xpProgress * 100} className="w-12 h-1.5" />
            <span>{state.xp} XP</span>
          </div>
        </div>

        {/* Centered message — fills the middle */}
        <div className="flex-1 flex items-center justify-center px-5">
          <p className="text-2xl font-medium text-foreground/80 text-center leading-relaxed">
            Where to next?
          </p>
        </div>

        {/* Bottom input — pinned to bottom */}
        <div className="px-5 pb-8 pt-2">
          <TopicInput onSubmit={handleTopicSelect} />
          <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
            Try "Ancient Egypt", "1998 Utah Jazz", or "How planes fly"
          </p>
        </div>
      </div>
    </ExploreLayout>
  )
}
