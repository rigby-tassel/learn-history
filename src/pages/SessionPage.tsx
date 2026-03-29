import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import LoadingState from '@/components/LoadingState'
import LessonCard from '@/components/LessonCard'
import QuizView from '@/components/QuizView'
import ResultsView from '@/components/ResultsView'
import { useExploreSession } from '@/hooks/useExploreSession'
import { useSearchContent } from '@/hooks/useSearchContent'
import type { QuizAnswer } from '@/types'
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

export default function SessionPage() {
  const navigate = useNavigate()
  const {
    session,
    nextCard,
    prevCard,
    submitAnswer,
    resetSession,
    startSession,
    setContent,
    setPhase,
  } = useExploreSession()
  const searchMutation = useSearchContent()

  // Fetch content when session starts in loading phase
  useEffect(() => {
    if (session?.phase === 'loading' && !searchMutation.isPending && !searchMutation.isSuccess && !searchMutation.isError) {
      searchMutation.mutate(session.topic, {
        onSuccess: (result) => {
          setContent(result.lessonCards, result.quizQuestions, result.suggestedSubtopics)
        },
      })
    }
  }, [session?.phase, session?.topic]) // eslint-disable-line react-hooks/exhaustive-deps

  // If no session, redirect to topic picker
  if (!session) {
    navigate('/')
    return null
  }

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    answers.forEach(a => submitAnswer(a))
  }

  const handleNewTopic = () => {
    resetSession()
    navigate('/')
  }

  const handleRetry = () => {
    searchMutation.reset()
    setPhase('loading')
  }

  const handleSubtopic = async (topic: string) => {
    searchMutation.reset()
    startSession(topic)
    setPhase('loading')
  }

  return (
    <ExploreLayout>
      {/* Back to topics */}
      <button
        onClick={handleNewTopic}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        New topic
      </button>

      <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
        {session.topic}
      </h3>

      {/* Loading */}
      {session.phase === 'loading' && !searchMutation.isError && (
        <LoadingState topic={session.topic} />
      )}

      {/* Error */}
      {searchMutation.isError && (
        <div className="flex flex-col items-center gap-4 py-12 animate-fade-in">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
            <p className="text-sm text-slate-500 mb-1">
              {searchMutation.error?.message || 'Failed to load content'}
            </p>
            <p className="text-xs text-slate-400">
              Make sure your OpenAI API key is set in the .env file
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleNewTopic}
              className="border-2 border-slate-200 text-slate-600 font-medium px-6 py-2.5 rounded-xl hover:border-slate-300 transition-colors"
            >
              New Topic
            </button>
          </div>
        </div>
      )}

      {/* Lesson cards */}
      {session.phase === 'learning' && session.lessonCards.length > 0 && (
        <div className="flex-1 flex flex-col">
          <LessonCard
            card={session.lessonCards[session.currentCardIndex]}
            index={session.currentCardIndex}
            total={session.lessonCards.length}
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevCard}
              disabled={session.currentCardIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium disabled:opacity-30 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={nextCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              {session.currentCardIndex === session.lessonCards.length - 1 ? 'Start Quiz' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz */}
      {session.phase === 'quiz' && session.quizQuestions.length > 0 && (
        <QuizView
          questions={session.quizQuestions}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Results */}
      {session.phase === 'results' && (
        <ResultsView
          topic={session.topic}
          answers={session.quizAnswers}
          totalQuestions={session.quizQuestions.length}
          suggestedSubtopics={session.suggestedSubtopics}
          onNewTopic={handleNewTopic}
          onSubtopic={handleSubtopic}
        />
      )}
    </ExploreLayout>
  )
}
