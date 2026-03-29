import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import LoadingState from '@/components/LoadingState'
import LessonCard from '@/components/LessonCard'
import QuizView from '@/components/QuizView'
import ResultsView from '@/components/ResultsView'
import { useExploreSession } from '@/hooks/useExploreSession'
import { useSearchContent } from '@/hooks/useSearchContent'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { useGameState } from '@/hooks/useGameState'
import type { QuizAnswer } from '@/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

export default function SessionPage() {
  const navigate = useNavigate()
  const {
    session, nextCard, prevCard, submitAnswer,
    resetSession, startSession, setContent, setPhase,
  } = useExploreSession()
  const searchMutation = useSearchContent()
  const gameState = useGameState()
  const sessionXP = useRef(0)

  const isLearning = session?.phase === 'learning' && (session?.lessonCards.length ?? 0) > 0
  const isFirstCard = session?.currentCardIndex === 0
  const isLastCard = session?.currentCardIndex === (session?.lessonCards.length ?? 1) - 1

  const handleNext = () => {
    if (!isLearning) return
    gameState.awardXP('card-complete')
    sessionXP.current += 10
    nextCard()
  }

  const handlePrev = () => {
    if (!isLearning || isFirstCard) return
    prevCard()
  }

  const { containerRef, style, isDragging, dragDirection, dragProgress } = useSwipeGesture({
    onSwipeRight: handleNext,
    onSwipeLeft: handlePrev,
    enabled: isLearning,
    threshold: 70,
  })

  useEffect(() => {
    if (session?.phase === 'loading' && !searchMutation.isPending && !searchMutation.isSuccess && !searchMutation.isError) {
      searchMutation.mutate(session.topic, {
        onSuccess: (result) => setContent(result.lessonCards, result.quizQuestions, result.suggestedSubtopics),
      })
    }
  }, [session?.phase, session?.topic]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!session) navigate('/')
  }, [session, navigate])

  if (!session) return null

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    const correct = answers.filter(a => a.isCorrect).length
    answers.forEach(a => {
      submitAnswer(a)
      if (a.isCorrect) { gameState.awardXP('quiz-correct'); sessionXP.current += 25 }
    })
    gameState.awardXP('session-complete')
    sessionXP.current += 50
    gameState.recordSessionComplete(session.topic, correct, answers.length)
  }

  const handleNewTopic = () => { resetSession(); navigate('/') }
  const handleRetry = () => { searchMutation.reset(); setPhase('loading') }
  const handleSubtopic = (topic: string) => {
    searchMutation.reset(); gameState.awardXP('subtopic-explore')
    gameState.recordSubtopic(); sessionXP.current = 0
    startSession(topic); setPhase('loading')
  }

  return (
    <ExploreLayout>
      {/* Top bar */}
      <div className="px-5 pt-3 pb-1 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleNewTopic} className="gap-1 text-muted-foreground">
          <ChevronLeft className="size-4" /> Topics
        </Button>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">{session.topic}</span>
      </div>

      {/* Loading */}
      {session.phase === 'loading' && !searchMutation.isError && <LoadingState topic={session.topic} />}

      {/* Error */}
      {searchMutation.isError && (
        <div className="flex flex-col items-center gap-4 px-6 py-16 animate-phase-in">
          <span className="text-4xl">😵</span>
          <p className="text-sm text-muted-foreground text-center">{searchMutation.error?.message || 'Something went wrong'}</p>
          <div className="flex gap-3">
            <Button onClick={handleRetry} className="rounded-2xl h-11">Try Again</Button>
            <Button variant="outline" onClick={handleNewTopic} className="rounded-2xl h-11">New Topic</Button>
          </div>
        </div>
      )}

      {/* Lesson cards */}
      {isLearning && (
        <div className="animate-phase-in">
          {/* Card area */}
          <div className="px-5 pt-2 pb-4">
            <div ref={containerRef} className="swipe-container">
              <div style={style}>
                <LessonCard card={session.lessonCards[session.currentCardIndex]} index={session.currentCardIndex} total={session.lessonCards.length} />
              </div>
            </div>
          </div>

          {/* Bottom nav - always visible */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border px-5 pt-3 pb-5 space-y-3 z-10">
            {/* Carousel dots */}
            <div className="flex items-center justify-center gap-1.5">
              {session.lessonCards.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === session.currentCardIndex ? 'w-5 bg-primary'
                    : i < session.currentCardIndex ? 'w-1.5 bg-primary/40'
                    : 'w-1.5 bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            {/* Nav buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePrev} disabled={isFirstCard} className="flex-1 h-12 rounded-2xl text-base gap-2">
                <ChevronLeft className="size-5" /> Back
              </Button>
              <Button onClick={handleNext} className="flex-1 h-12 rounded-2xl text-base font-semibold gap-2">
                {isLastCard ? 'Start Quiz' : 'Next'}
                {isLastCard ? <ArrowRight className="size-5" /> : <ChevronRight className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {session.phase === 'quiz' && session.quizQuestions.length > 0 && (
        <div className="px-5 py-4 animate-phase-in">
          <QuizView questions={session.quizQuestions} onComplete={handleQuizComplete} />
        </div>
      )}

      {/* Results */}
      {session.phase === 'results' && (
        <div className="px-5 py-4 animate-phase-in">
          <ResultsView
            topic={session.topic} answers={session.quizAnswers}
            totalQuestions={session.quizQuestions.length}
            suggestedSubtopics={session.suggestedSubtopics}
            onNewTopic={handleNewTopic} onSubtopic={handleSubtopic}
            sessionXP={sessionXP.current}
          />
        </div>
      )}
    </ExploreLayout>
  )
}
