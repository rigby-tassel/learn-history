import { useEffect, useState } from 'react'
import type { QuizAnswer } from '@/types'
import { useGameState } from '@/hooks/useGameState'
import AchievementBadge from './AchievementBadge'

interface ResultsViewProps {
  topic: string
  answers: QuizAnswer[]
  totalQuestions: number
  suggestedSubtopics: string[]
  onNewTopic: () => void
  onSubtopic: (topic: string) => void
  sessionXP: number
}

export default function ResultsView({
  topic,
  answers,
  totalQuestions,
  suggestedSubtopics,
  onNewTopic,
  onSubtopic,
  sessionXP,
}: ResultsViewProps) {
  const { state, currentLevel } = useGameState()
  const [showBadges, setShowBadges] = useState(false)

  const correct = answers.filter(a => a.isCorrect).length
  const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0

  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : pct >= 40 ? '📚' : '💪'
  const message =
    pct >= 80 ? 'Amazing! You really know your stuff!'
    : pct >= 60 ? 'Great job! You learned a lot!'
    : pct >= 40 ? 'Good effort! Keep exploring!'
    : "Nice try! Let's keep learning!"

  // Find recently unlocked achievements
  const recentAchievements = state.achievements.filter(a => {
    if (!a.unlockedAt) return false
    const unlocked = new Date(a.unlockedAt)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    return unlocked > fiveMinAgo
  })

  // Trigger confetti for perfect score
  useEffect(() => {
    if (pct === 100) {
      window.dispatchEvent(new Event('game-confetti'))
    }
  }, [pct])

  return (
    <div className="space-y-5 animate-phase-in">
      {/* Score card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-3xl font-black text-slate-900">
          {correct}/{totalQuestions}
        </h2>
        <p className="text-slate-500 text-sm mb-4">{message}</p>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Session XP earned */}
        <div className="mt-4 bg-amber-50 rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-amber-700">
            ✨ You earned {sessionXP} XP this session!
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Level {currentLevel.level}: {currentLevel.name}
          </p>
        </div>
      </div>

      {/* New achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Achievements Unlocked!</h3>
          <div className="grid grid-cols-3 gap-2">
            {recentAchievements.map(a => (
              <AchievementBadge key={a.id} achievement={a} isNew />
            ))}
          </div>
        </div>
      )}

      {/* All badges toggle */}
      <button
        onClick={() => setShowBadges(!showBadges)}
        className="w-full text-center text-xs font-medium text-primary py-2"
      >
        {showBadges ? 'Hide badges' : `View all badges (${state.achievements.filter(a => a.unlockedAt).length}/${state.achievements.length})`}
      </button>
      {showBadges && (
        <div className="grid grid-cols-4 gap-2 animate-expand">
          {state.achievements.map(a => (
            <AchievementBadge key={a.id} achievement={a} size="sm" />
          ))}
        </div>
      )}

      {/* Subtopics */}
      {suggestedSubtopics.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Keep exploring {topic}
          </h3>
          <div className="space-y-2">
            {suggestedSubtopics.map(sub => (
              <button
                key={sub}
                onClick={() => onSubtopic(sub)}
                className="w-full flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-700 active:scale-[0.98] transition-transform min-h-[44px]"
              >
                <span>🔍 {sub}</span>
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">+15 XP</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New topic */}
      <button
        onClick={onNewTopic}
        className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform min-h-[44px]"
      >
        Explore a New Topic
      </button>
    </div>
  )
}
