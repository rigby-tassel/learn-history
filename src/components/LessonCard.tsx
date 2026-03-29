import { useState } from 'react'
import type { LessonCard as LessonCardType } from '@/types'
import MediaEmbed from './MediaEmbed'
import ReadAloudButton from './ReadAloudButton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, Lightbulb, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonCardProps {
  card: LessonCardType
  index: number
  total: number
}

export default function LessonCard({ card }: LessonCardProps) {
  const [showFact, setShowFact] = useState(false)
  const [showDates, setShowDates] = useState(false)

  const fullText = [card.content, card.funFact && `Fun fact: ${card.funFact}`]
    .filter(Boolean)
    .join('. ')

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-md">
      <MediaEmbed type={card.mediaType} url={card.mediaUrl} caption={card.mediaCaption} />

      <CardContent className="px-5 pt-4 pb-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold text-card-foreground leading-tight">{card.title}</h2>
          <ReadAloudButton text={fullText} className="shrink-0 mt-0.5" />
        </div>

        <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line mb-4">
          {card.content}
        </div>

        {card.funFact && (
          <div className="mb-3">
            {!showFact ? (
              <Button
                variant="secondary"
                onClick={() => setShowFact(true)}
                className="w-full justify-start gap-2 rounded-xl h-auto py-3 bg-amber-50 text-amber-700 hover:bg-amber-100 border-0"
              >
                <Lightbulb className="size-4" />
                <span className="flex-1 text-left">Tap for a fun fact</span>
                <ChevronDown className="size-4" />
              </Button>
            ) : (
              <div className="bg-amber-50 rounded-xl px-4 py-3 animate-expand border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Fun fact:</span> {card.funFact}
                </p>
              </div>
            )}
          </div>
        )}

        {card.keyDates && card.keyDates.length > 0 && (
          <div>
            <Button
              variant="secondary"
              onClick={() => setShowDates(!showDates)}
              className={cn(
                'w-full justify-start gap-2 rounded-xl h-auto py-3 border-0',
                showDates ? 'bg-primary/10 text-primary hover:bg-primary/15' : '',
              )}
            >
              <Clock className="size-4" />
              <span className="flex-1 text-left">Key Dates</span>
              <ChevronDown className={cn('size-4 transition-transform', showDates && 'rotate-180')} />
            </Button>
            {showDates && (
              <div className="mt-2 pl-4 border-l-2 border-primary/30 space-y-2 animate-expand">
                {card.keyDates.map((date, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-2">{date}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
