import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import TopicInput from '@/components/TopicInput'
import TopicSuggestions from '@/components/TopicSuggestions'
import { useExploreSession } from '@/hooks/useExploreSession'
import { useGameState } from '@/hooks/useGameState'

export default function TopicPickerPage() {
  const navigate = useNavigate()
  const { startSession, resetSession } = useExploreSession()
  const { currentLevel, xpProgress, state } = useGameState()
  const gameState = useGameState()

  const handleTopicSelect = (topic: string) => {
    resetSession()
    startSession(topic)
    gameState.recordSessionStart()
    navigate('/session')
  }

  const newAchievements = state.achievements.filter(a => {
    if (!a.unlockedAt) return false
    const unlocked = new Date(a.unlockedAt)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return unlocked > hourAgo
  })

  return (
    <ExploreLayout>
      <div className="flex-1 flex flex-col items-center gap-6 px-4 py-6">
        {/* Hero */}
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-2">🌍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            What do you want to explore?
          </h2>
          <p className="text-slate-400 text-sm">
            Pick a topic and discover amazing stories from history
          </p>
        </div>

        {/* Level badge */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 animate-fade-in">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-lg font-black text-primary">{currentLevel.level}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{currentLevel.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.round(xpProgress * 100)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{state.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Recent achievements */}
        {newAchievements.length > 0 && (
          <div className="flex gap-2 animate-fade-in">
            {newAchievements.map(a => (
              <div key={a.id} className="flex items-center gap-1.5 bg-amber-50 rounded-full px-3 py-1.5 text-xs font-medium text-amber-700">
                <span>{a.icon}</span>
                {a.name}
              </div>
            ))}
          </div>
        )}

        {/* Search input */}
        <TopicInput onSubmit={handleTopicSelect} />

        {/* Suggestions */}
        <div className="w-full">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Pick a topic
          </p>
          <TopicSuggestions onSelect={handleTopicSelect} />
        </div>
      </div>
    </ExploreLayout>
  )
}
