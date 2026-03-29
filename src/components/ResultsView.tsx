import { useEffect, useState } from 'react'
import type { QuizAnswer } from '@/types'
import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
    <div className="space-y-4 animate-phase-in">
      <Card className="rounded-2xl border-0 shadow-md text-center">
        <CardContent className="p-6">
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-3xl font-black text-card-foreground">{correct}/{totalQuestions}</h2>
          <p className="text-muted-foreground text-sm mb-4">{message}</p>
          <Progress value={pct} className="h-2.5 mb-2" />

          <Card className="mt-4 rounded-xl bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <p className="text-sm font-bold text-amber-700">✨ You earned {sessionXP} XP this session!</p>
              <p className="text-xs text-amber-600 mt-0.5">Level {currentLevel.level}: {currentLevel.name}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {recentAchievements.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Achievements Unlocked!</h3>
          <div className="grid grid-cols-3 gap-2">
            {recentAchievements.map(a => (
              <AchievementBadge key={a.id} achievement={a} isNew />
            ))}
          </div>
        </div>
      )}

      <Button variant="ghost" onClick={() => setShowBadges(!showBadges)} className="w-full text-xs">
        {showBadges ? 'Hide badges' : `View all badges (${state.achievements.filter(a => a.unlockedAt).length}/${state.achievements.length})`}
      </Button>
      {showBadges && (
        <div className="grid grid-cols-4 gap-2 animate-expand">
          {state.achievements.map(a => (
            <AchievementBadge key={a.id} achievement={a} size="sm" />
          ))}
        </div>
      )}

      {suggestedSubtopics.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Keep exploring {topic}</h3>
          <div className="space-y-2">
            {suggestedSubtopics.map(sub => (
              <Button
                key={sub}
                variant="outline"
                onClick={() => onSubtopic(sub)}
                className="w-full justify-between rounded-xl h-auto py-3.5"
              >
                <span>🔍 {sub}</span>
                <Badge className="rounded-full text-[10px]">+15 XP</Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button onClick={onNewTopic} className="w-full rounded-xl h-12 text-base font-semibold">
        Explore a New Topic
      </Button>
    </div>
  )
}
