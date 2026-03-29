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
  const gameState = useGameState()
  const sessionXP = useRef(0)

  const isLearning = session?.phase === 'learning' && (session?.lessonCards.length ?? 0) > 0
  const isFirstCard = session?.currentCardIndex === 0
  const isLastCard = session?.currentCardIndex === (session?.lessonCards.length ?? 1) - 1

  const handleSwipeRight = () => {
    if (!isLearning) return
    gameState.awardXP('card-complete')
    sessionXP.current += 10
    nextCard()
  }

  const handleSwipeLeft = () => {
    if (!isLearning || isFirstCard) return
    prevCard()
  }

  const { containerRef, style, isDragging, dragDirection, dragProgress } = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    enabled: isLearning,
    threshold: 70,
  })

  // Fetch content when session starts
  useEffect(() => {
    if (session?.phase === 'loading' && !searchMutation.isPending && !searchMutation.isSuccess && !searchMutation.isError) {
      searchMutation.mutate(session.topic, {
        onSuccess: (result) => {
          setContent(result.lessonCards, result.quizQuestions, result.suggestedSubtopics)
        },
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
      if (a.isCorrect) {
        gameState.awardXP('quiz-correct')
        sessionXP.current += 25
      }
    })
    gameState.awardXP('session-complete')
    sessionXP.current += 50
    gameState.recordSessionComplete(session.topic, correct, answers.length)
  }

  const handleNewTopic = () => {
    resetSession()
    navigate('/')
  }

  const handleRetry = () => {
    searchMutation.reset()
    setPhase('loading')
  }

  const handleSubtopic = (topic: string) => {
    searchMutation.reset()
    gameState.awardXP('subtopic-explore')
    gameState.recordSubtopic()
    sessionXP.current = 0
    startSession(topic)
    setPhase('loading')
  }

  return (
    <ExploreLayout>
      {/* Top bar */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleNewTopic} className="gap-1 text-muted-foreground">
          <ChevronLeft className="size-4" />
          Topics
        </Button>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          {session.topic}
        </span>
      </div>

      {/* Loading */}
      {session.phase === 'loading' && !searchMutation.isError && (
        <LoadingState topic={session.topic} />
      )}

      {/* Error */}
      {searchMutation.isError && (
        <div className="flex flex-col items-center gap-4 px-6 py-16 animate-phase-in">
          <span className="text-4xl">😵</span>
          <p className="text-sm text-muted-foreground text-center">
            {searchMutation.error?.message || 'Something went wrong'}
          </p>
          <div className="flex gap-3">
            <Button onClick={handleRetry} className="rounded-xl">Try Again</Button>
            <Button variant="outline" onClick={handleNewTopic} className="rounded-xl">New Topic</Button>
          </div>
        </div>
      )}

      {/* Lesson cards with swipe */}
      {isLearning && (
        <div className="flex-1 flex flex-col animate-phase-in">
          {/* Swipe container */}
          <div ref={containerRef} className="swipe-container flex-1 px-4 pt-2 pb-4" style={style}>
            {/* Swipe direction hints */}
            {isDragging && dragDirection === 'left' && !isFirstCard && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ opacity: dragProgress * 0.7 }}>
                <div className="bg-slate-800/70 text-white rounded-full p-2">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>
            )}
            {isDragging && dragDirection === 'right' && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ opacity: dragProgress * 0.7 }}>
                <div className="bg-primary/80 text-white rounded-full p-2">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            )}

            <LessonCard
              card={session.lessonCards[session.currentCardIndex]}
              index={session.currentCardIndex}
              total={session.lessonCards.length}
            />
          </div>

          {/* Bottom action bar */}
          <div className="px-4 pb-5 pt-2">
            {/* Carousel dots */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {session.lessonCards.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === session.currentCardIndex
                      ? 'w-6 bg-primary'
                      : i < session.currentCardIndex
                        ? 'w-2 bg-primary/40'
                        : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSwipeLeft}
                disabled={isFirstCard}
                className="flex-1 h-12 rounded-xl text-base gap-2"
              >
                <ChevronLeft className="size-5" />
                Back
              </Button>
              <Button
                onClick={() => { gameState.awardXP('card-complete'); sessionXP.current += 10; nextCard() }}
                className="flex-1 h-12 rounded-xl text-base font-semibold gap-2"
              >
                {isLastCard ? 'Start Quiz' : 'Next'}
                {isLastCard ? <ArrowRight className="size-5" /> : <ChevronRight className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {session.phase === 'quiz' && session.quizQuestions.length > 0 && (
        <div className="px-4 py-4 animate-phase-in">
          <QuizView
            questions={session.quizQuestions}
            onComplete={handleQuizComplete}
          />
        </div>
      )}

      {/* Results */}
      {session.phase === 'results' && (
        <div className="px-4 py-4 animate-phase-in">
          <ResultsView
            topic={session.topic}
            answers={session.quizAnswers}
            totalQuestions={session.quizQuestions.length}
            suggestedSubtopics={session.suggestedSubtopics}
            onNewTopic={handleNewTopic}
            onSubtopic={handleSubtopic}
            sessionXP={sessionXP.current}
          />
        </div>
      )}
    </ExploreLayout>
  )
}
