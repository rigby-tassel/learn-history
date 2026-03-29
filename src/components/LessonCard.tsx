import { useState } from 'react'
import type { LessonCard as LessonCardType } from '@/types'
import MediaEmbed from './MediaEmbed'
import ReadAloudButton from './ReadAloudButton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Sparkles, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonCardProps {
  card: LessonCardType
  index: number
  total: number
}

export default function LessonCard({ card, index, total }: LessonCardProps) {
  const [showFact, setShowFact] = useState(false)
  const [showDates, setShowDates] = useState(false)

  const fullText = [card.content, card.funFact].filter(Boolean).join('. ')

  return (
    <Card className="overflow-hidden rounded-3xl border shadow-lg">
      {/* Image */}
      <MediaEmbed type={card.mediaType} url={card.mediaUrl} caption={card.mediaCaption} />

      <CardContent className="p-5 space-y-4">
        {/* Card counter + Read aloud */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="rounded-full text-xs font-medium">
            {index + 1} of {total}
          </Badge>
          <ReadAloudButton text={fullText} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground leading-tight">{card.title}</h2>

        {/* Content */}
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {card.content}
        </p>

        {/* Tap for facts */}
        {card.funFact && (
          !showFact ? (
            <Button
              variant="outline"
              onClick={() => setShowFact(true)}
              className="w-full justify-between rounded-2xl h-auto py-3.5 border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100/70 hover:text-amber-800"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" />
                Tap for facts
              </span>
              <ChevronDown className="size-4" />
            </Button>
          ) : (
            <div className="bg-amber-50 rounded-2xl px-4 py-3.5 animate-expand border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Did you know? </span>{card.funFact}
              </p>
            </div>
          )
        )}

        {/* Key dates */}
        {card.keyDates && card.keyDates.length > 0 && (
          <div>
            <Button
              variant="outline"
              onClick={() => setShowDates(!showDates)}
              className={cn(
                'w-full justify-between rounded-2xl h-auto py-3.5',
                showDates && 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10',
              )}
            >
              <span className="flex items-center gap-2">
                <Clock className="size-4" />
                Timeline
              </span>
              <ChevronDown className={cn('size-4 transition-transform', showDates && 'rotate-180')} />
            </Button>
            {showDates && (
              <div className="mt-3 pl-4 border-l-2 border-primary/30 space-y-2.5 animate-expand">
                {card.keyDates.map((date, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-3">{date}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
