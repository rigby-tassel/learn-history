import type { LessonCard as LessonCardType } from '@/types'
import MediaEmbed from './MediaEmbed'
import ReadAloudButton from './ReadAloudButton'

interface LessonCardProps {
  card: LessonCardType
  index: number
  total: number
}

export default function LessonCard({ card, index, total }: LessonCardProps) {
  const fullText = [card.content, card.funFact && `Fun fact: ${card.funFact}`]
    .filter(Boolean)
    .join('. ')

  return (
    <div className="animate-slide-up">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-400">
          {index + 1} of {total}
        </span>
        <div className="flex-1 mx-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <ReadAloudButton text={fullText} />
      </div>

      {/* Card content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <MediaEmbed type={card.mediaType} url={card.mediaUrl} caption={card.mediaCaption} />

        <div className="p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h2>

          <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line mb-4">
            {card.content}
          </div>

          {card.funFact && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Fun fact:</span> {card.funFact}
              </p>
            </div>
          )}

          {card.keyDates && card.keyDates.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Dates</p>
              <ul className="space-y-1">
                {card.keyDates.map((date, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-primary">&#x2022;</span>
                    {date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
