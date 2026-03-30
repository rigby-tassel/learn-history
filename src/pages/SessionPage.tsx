import { useEffect, useRef, useState, useCallback } from 'react'
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
import { ChevronLeft } from 'lucide-react'

const CARD_DURATION = 12000 // 12 seconds per card

export default function SessionPage() {
  const navigate = useNavigate()
  const {
    session, nextCard, prevCard, submitAnswer,
    resetSession, startSession, setContent, setPhase,
  } = useExploreSession()
  const searchMutation = useSearchContent()
  const gameState = useGameState()
  const sessionXP = useRef(0)

  // Timer state
  const [timerActive, setTimerActive] = useState(true)
  const [timerKey, setTimerKey] = useState(0) // forces CSS animation restart
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isLearning = session?.phase === 'learning' && (session?.lessonCards.length ?? 0) > 0
  const isFirstCard = session?.currentCardIndex === 0
  const isLastCard = session?.currentCardIndex === (session?.lessonCards.length ?? 1) - 1
  const currentIndex = session?.currentCardIndex ?? 0

  const handleNext = useCallback(() => {
    if (!isLearning) return
    gameState.awardXP('card-complete')
    sessionXP.current += 10
    nextCard()
    // Reset timer for next card
    setTimerKey(k => k + 1)
    setTimerActive(true)
  }, [isLearning, gameState, nextCard])

  const handlePrev = useCallback(() => {
    if (!isLearning || isFirstCard) return
    prevCard()
    setTimerKey(k => k + 1)
    setTimerActive(true)
  }, [isLearning, isFirstCard, prevCard])

  // Auto-advance timer
  useEffect(() => {
    if (!isLearning || !timerActive) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      handleNext()
    }, CARD_DURATION)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isLearning, timerActive, timerKey, handleNext])

  const { containerRef, style } = useSwipeGesture({
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
      {/* Story-style progress bar with animated fill timer */}
      {isLearning && (
        <div className="sticky top-[49px] z-30 bg-background/90 backdrop-blur-xl px-4 pt-3 pb-2">
          {/* Progress segments — active one animates over CARD_DURATION */}
          <div className="flex gap-1 mb-2">
            {session.lessonCards.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                {i < currentIndex ? (
                  // Completed
                  <div className="h-full w-full rounded-full bg-brand-gradient" />
                ) : i === currentIndex ? (
                  // Active — animated fill
                  <div
                    key={timerKey}
                    className="h-full rounded-full bg-brand-gradient"
                    style={{
                      width: timerActive ? '100%' : '0%',
                      transition: timerActive ? `width ${CARD_DURATION}ms linear` : 'none',
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleNewTopic} className="gap-0.5 text-muted-foreground -ml-2 h-8">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{session.topic}</span>
            <span className="text-[10px] font-medium text-muted-foreground">{currentIndex + 1}/{session.lessonCards.length}</span>
          </div>
        </div>
      )}

      {/* Non-learning phases still get the topic header */}
      {!isLearning && session.phase !== 'loading' && (
        <div className="px-5 pt-3 pb-1 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleNewTopic} className="gap-1 text-muted-foreground">
            <ChevronLeft className="size-4" /> Topics
          </Button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{session.topic}</span>
        </div>
      )}

      {/* Loading */}
      {session.phase === 'loading' && !searchMutation.isError && <LoadingState topic={session.topic} />}

      {/* Error */}
      {searchMutation.isError && (
        <div className="flex flex-col items-center gap-4 px-6 py-16 animate-phase-in">
          <span className="text-5xl">😵</span>
          <p className="text-sm text-muted-foreground text-center">{searchMutation.error?.message || 'Something went wrong'}</p>
          <div className="flex gap-3">
            <Button onClick={handleRetry} className="rounded-2xl h-12 bg-brand-gradient text-white px-6">Try Again</Button>
            <Button variant="outline" onClick={handleNewTopic} className="rounded-2xl h-12 px-6">New Topic</Button>
          </div>
        </div>
      )}

      {/* Lesson cards — full-screen story card */}
      {isLearning && (
        <div className="relative animate-card-enter" style={{ height: 'calc(100dvh - 110px)' }}>
          <div ref={containerRef} className="swipe-container h-full px-4 pb-4">
            <div style={style} className="h-full">
              <LessonCard
                card={session.lessonCards[currentIndex]}
                index={currentIndex}
                total={session.lessonCards.length}
                onNext={handleNext}
                onPrev={handlePrev}
              />
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
