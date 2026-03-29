import { useState } from 'react'
import type { LessonCard as LessonCardType } from '@/types'
import MediaEmbed from './MediaEmbed'
import ReadAloudButton from './ReadAloudButton'
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Full-bleed media */}
      <MediaEmbed type={card.mediaType} url={card.mediaUrl} caption={card.mediaCaption} />

      <div className="px-5 pt-4 pb-5">
        {/* Title + read aloud */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">{card.title}</h2>
          <ReadAloudButton text={fullText} className="shrink-0 mt-0.5" />
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed text-slate-600 whitespace-pre-line mb-4">
          {card.content}
        </div>

        {/* Tap-to-reveal fun fact */}
        {card.funFact && (
          <div className="mb-3">
            {!showFact ? (
              <button
                onClick={() => setShowFact(true)}
                className="flex items-center gap-2 w-full bg-amber-50 text-amber-700 rounded-xl px-4 py-3 text-sm font-medium active:scale-[0.98] transition-transform"
              >
                <Lightbulb className="w-4 h-4" />
                Tap for a fun fact
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-expand">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Fun fact:</span> {card.funFact}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Collapsible key dates */}
        {card.keyDates && card.keyDates.length > 0 && (
          <div>
            <button
              onClick={() => setShowDates(!showDates)}
              className={cn(
                'flex items-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium active:scale-[0.98] transition-all',
                showDates ? 'bg-primary/5 text-primary' : 'bg-slate-50 text-slate-500',
              )}
            >
              <Clock className="w-4 h-4" />
              Key Dates
              <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform', showDates && 'rotate-180')} />
            </button>
            {showDates && (
              <div className="mt-2 pl-4 border-l-2 border-primary/30 space-y-2 animate-expand">
                {card.keyDates.map((date, i) => (
                  <p key={i} className="text-sm text-slate-600 pl-2">{date}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
