import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import TopicInput from '@/components/TopicInput'
import { useExploreSession } from '@/hooks/useExploreSession'
import { useGameState } from '@/hooks/useGameState'

const FLOATING_ICONS = [
  { emoji: '🏛️', x: 8, y: 12 },
  { emoji: '🚀', x: 82, y: 8 },
  { emoji: '🦕', x: 18, y: 68 },
  { emoji: '⚡', x: 88, y: 55 },
  { emoji: '🌍', x: 50, y: 18 },
  { emoji: '📚', x: 12, y: 42 },
  { emoji: '🔬', x: 78, y: 35 },
]

const QUICK_TOPICS = ['Ancient Egypt', 'Space Travel', 'Dinosaurs', 'World War II']

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
      <div className="relative flex flex-col h-dvh overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-brand-gradient animate-gradient-shift" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FLOATING_ICONS.map((icon, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-float-particle"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                '--float-duration': `${5 + i * 1.2}s`,
                '--float-delay': `${i * 0.8}s`,
              } as React.CSSProperties}
            >
              {icon.emoji}
            </span>
          ))}
        </div>

        {/* Game HUD top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-sm shadow-lg">
              {currentLevel.level}
            </div>
            <div>
              <p className="text-xs font-bold text-white/90">{currentLevel.name}</p>
              <div className="w-20 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state.streak.current > 0 && (
              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5">
                <span className={`text-sm ${state.streak.current >= 3 ? 'animate-fire' : ''}`}>🔥</span>
                <span className="text-xs font-bold text-white">{state.streak.current}</span>
              </div>
            )}
            <div className="bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5">
              <span className="text-xs font-bold text-amber-300">{state.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Center hero */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-6xl mb-4 animate-fade-in">🧭</div>
          <h1 className="text-3xl font-black text-white text-center leading-tight mb-2 animate-fade-in stagger-1">
            Where to next?
          </h1>
          <p className="text-sm text-white/60 text-center animate-fade-in stagger-2">
            Search anything — history, science, sports, space...
          </p>
        </div>

        {/* Bottom glass card with input */}
        <div className="relative z-10 px-5 pb-8 pt-2 animate-slide-up stagger-2">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20">
            <TopicInput onSubmit={handleTopicSelect} variant="light" />
            {/* Quick-start chips */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {QUICK_TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  className="px-3 py-1.5 bg-white/15 text-white/90 text-xs font-medium rounded-full
                             border border-white/10 hover:bg-white/25 transition-all active:scale-95"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ExploreLayout>
  )
}
