import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import TopicInput from '@/components/TopicInput'
import TopicSuggestions from '@/components/TopicSuggestions'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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

  const newAchievements = state.achievements.filter(a => {
    if (!a.unlockedAt) return false
    return new Date(a.unlockedAt) > new Date(Date.now() - 60 * 60 * 1000)
  })

  return (
    <ExploreLayout>
      <div className="flex-1 flex flex-col items-center gap-5 px-4 py-6">
        {/* Hero */}
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-2">🌍</div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            What do you want to explore?
          </h2>
          <p className="text-muted-foreground text-sm">
            Pick a topic and discover amazing stories
          </p>
        </div>

        {/* Level badge */}
        <Card className="w-full rounded-2xl border shadow-sm animate-fade-in">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="size-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-lg font-black text-primary">{currentLevel.level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-card-foreground">{currentLevel.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Progress value={xpProgress * 100} className="flex-1 h-2" />
                <span className="text-[11px] font-bold text-muted-foreground shrink-0">{state.xp} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent achievements */}
        {newAchievements.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
            {newAchievements.map(a => (
              <Badge key={a.id} variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs">
                <span>{a.icon}</span>
                {a.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="w-full">
          <TopicInput onSubmit={handleTopicSelect} />
        </div>

        {/* Suggestions */}
        <div className="w-full">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Pick a topic
          </p>
          <TopicSuggestions onSelect={handleTopicSelect} />
        </div>
      </div>
    </ExploreLayout>
  )
}
