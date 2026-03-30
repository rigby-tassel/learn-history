import { useEffect, useState } from 'react'
import type { QuizAnswer } from '@/types'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  const recentAchievements = state.achievements.filter(a => {
    if (!a.unlockedAt) return false
    return new Date(a.unlockedAt) > new Date(Date.now() - 5 * 60 * 1000)
  })

  useEffect(() => {
    if (pct === 100) window.dispatchEvent(new Event('game-confetti'))
  }, [pct])

  return (
    <div className="space-y-5 animate-phase-in">
      {/* Victory card with gradient */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-brand-gradient px-6 pt-10 pb-8 text-center">
          <div className="text-6xl mb-3 animate-victory-burst">{emoji}</div>
          <div className="animate-count-up">
            <h2 className="text-5xl font-black text-white tabular-nums">{correct}/{totalQuestions}</h2>
          </div>
          <p className="text-white/70 text-sm mt-2 font-medium">{message}</p>

          {/* Score bar */}
          <div className="mt-5 mx-auto w-48">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${pct}%` }} />
            </div>
            <p className="text-white/50 text-xs mt-1.5">{pct}% correct</p>
          </div>
        </div>

        {/* XP earned card */}
        <div className="bg-card px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-xp-gold">+{sessionXP} XP earned!</p>
              <p className="text-xs text-muted-foreground mt-0.5">Level {currentLevel.level}: {currentLevel.name}</p>
            </div>
            <div className="size-10 rounded-xl bg-gold-gradient flex items-center justify-center text-lg shadow-md">
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {recentAchievements.length > 0 && (
        <div className="animate-slide-up stagger-3">
          <h3 className="text-sm font-bold text-foreground mb-3">Achievements Unlocked!</h3>
          <div className="grid grid-cols-3 gap-2">
            {recentAchievements.map(a => (
              <AchievementBadge key={a.id} achievement={a} isNew />
            ))}
          </div>
        </div>
      )}

      {/* View all badges */}
      <Button variant="ghost" onClick={() => setShowBadges(!showBadges)} className="w-full text-xs text-muted-foreground">
        {showBadges ? 'Hide badges' : `View all badges (${state.achievements.filter(a => a.unlockedAt).length}/${state.achievements.length})`}
      </Button>
      {showBadges && (
        <div className="grid grid-cols-4 gap-2 animate-expand">
          {state.achievements.map(a => (
            <AchievementBadge key={a.id} achievement={a} size="sm" />
          ))}
        </div>
      )}

      {/* Subtopics */}
      {suggestedSubtopics.length > 0 && (
        <div className="animate-slide-up stagger-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Keep exploring</h3>
          <div className="space-y-2">
            {suggestedSubtopics.map(sub => (
              <button
                key={sub}
                onClick={() => onSubtopic(sub)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl
                           bg-card border border-border shadow-sm hover:shadow-md
                           active:scale-[0.98] transition-all"
              >
                <span className="text-sm font-semibold text-foreground">🔍 {sub}</span>
                <Badge className="rounded-full text-[10px] bg-primary/10 text-primary border-0 font-bold">+15 XP</Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New topic CTA */}
      <Button
        onClick={onNewTopic}
        className="w-full rounded-2xl h-14 text-base font-bold bg-brand-gradient text-white
                   shadow-xl active:scale-[0.97] transition-transform border-0"
      >
        Explore a New Topic 🧭
      </Button>
    </div>
  )
}
