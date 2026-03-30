import { useState } from 'react'
import type { LessonCard as LessonCardType } from '@/types'
import ReadAloudButton from './ReadAloudButton'
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
  const [imgFailed, setImgFailed] = useState(false)

  const fullText = [card.content, card.funFact].filter(Boolean).join('. ')
  const hasImage = card.mediaUrl && card.mediaType !== 'none' && !imgFailed

  return (
    <div className="relative h-full rounded-3xl overflow-hidden bg-card shadow-2xl flex flex-col border border-border/50">
      {/* Hero image section */}
      {hasImage ? (
        <div className="relative h-[38%] min-h-[180px] overflow-hidden shrink-0">
          <img
            src={card.mediaUrl}
            alt={card.mediaCaption || ''}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          {card.mediaCaption && (
            <p className="absolute bottom-2 left-4 text-[10px] text-muted-foreground/60">
              {card.mediaCaption}
            </p>
          )}
        </div>
      ) : (
        <div className="h-[15%] min-h-[60px] bg-brand-gradient opacity-20 shrink-0" />
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-3">
        {/* Card badge + Read aloud */}
        <div className="flex items-center justify-between">
          <Badge className="rounded-full text-[10px] font-bold bg-primary/10 text-primary border-0">
            {index + 1} of {total}
          </Badge>
          <ReadAloudButton text={fullText} />
        </div>

        {/* Title */}
        <h2 className="text-lg font-black text-foreground leading-snug">{card.title}</h2>

        {/* Content */}
        <p className="text-[14px] leading-relaxed text-muted-foreground">{card.content}</p>

        {/* Fun fact */}
        {card.funFact && (
          !showFact ? (
            <button
              onClick={() => setShowFact(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gold-gradient text-white
                         shadow-md active:scale-[0.98] transition-transform text-left"
            >
              <Sparkles className="size-5 shrink-0" />
              <span className="text-sm font-bold flex-1">Tap for a fun fact!</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          ) : (
            <div className="bg-amber-50 rounded-2xl px-4 py-3.5 animate-expand border border-amber-200/60">
              <p className="text-sm text-amber-900">
                <span className="font-bold text-amber-700">Fun fact: </span>{card.funFact}
              </p>
            </div>
          )
        )}

        {/* Timeline */}
        {card.keyDates && card.keyDates.length > 0 && (
          <div>
            <button
              onClick={() => setShowDates(!showDates)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-[0.98] text-left',
                showDates ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10',
              )}
            >
              <Clock className="size-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary flex-1">Timeline</span>
              <ChevronDown className={cn('size-4 text-primary transition-transform', showDates && 'rotate-180')} />
            </button>
            {showDates && (
              <div className="mt-2 pl-4 border-l-2 border-primary/30 space-y-2 animate-expand">
                {card.keyDates.map((date, i) => (
                  <p key={i} className="text-xs text-muted-foreground pl-3">{date}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
