import type { QuizAnswer } from '@/types'

interface ResultsViewProps {
  topic: string
  answers: QuizAnswer[]
  totalQuestions: number
  suggestedSubtopics: string[]
  onNewTopic: () => void
  onSubtopic: (topic: string) => void
}

export default function ResultsView({
  topic,
  answers,
  totalQuestions,
  suggestedSubtopics,
  onNewTopic,
  onSubtopic,
}: ResultsViewProps) {
  const correct = answers.filter(a => a.isCorrect).length
  const pct = Math.round((correct / totalQuestions) * 100)

  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : pct >= 40 ? '📚' : '💪'
  const message =
    pct >= 80
      ? 'Amazing! You really know your stuff!'
      : pct >= 60
        ? 'Great job! You learned a lot!'
        : pct >= 40
          ? 'Good effort! Keep exploring!'
          : "Nice try! Let's keep learning!"

  return (
    <div className="animate-slide-up space-y-6">
      {/* Score card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          {correct} / {totalQuestions}
        </h2>
        <p className="text-slate-500 text-sm mb-4">{message}</p>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{pct}% correct</p>
      </div>

      {/* Suggested subtopics */}
      {suggestedSubtopics.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
            Keep exploring {topic}
          </h3>
          <div className="space-y-2">
            {suggestedSubtopics.map(sub => (
              <button
                key={sub}
                onClick={() => onSubtopic(sub)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-all"
              >
                🔍 {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New topic button */}
      <button
        onClick={onNewTopic}
        className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors"
      >
        Explore a New Topic
      </button>
    </div>
  )
}
