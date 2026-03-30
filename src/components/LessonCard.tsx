import type { LessonCard as LessonCardType } from '@/types'
import ReadAloudButton from './ReadAloudButton'

// Rotating gradient colors per card index for visual variety
const GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-blue-600 to-cyan-500',
  'from-emerald-600 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-purple-600 to-violet-500',
  'from-sky-500 to-blue-600',
  'from-teal-500 to-emerald-600',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-600',
]

interface LessonCardProps {
  card: LessonCardType
  index: number
  total: number
  onNext?: () => void
  onPrev?: () => void
}

export default function LessonCard({ card, index, total, onNext, onPrev }: LessonCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const midpoint = rect.width / 2

    if (x < midpoint) {
      onPrev?.()
    } else {
      onNext?.()
    }
  }

  return (
    <div
      onClick={handleTap}
      className="relative h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-pointer select-none"
    >
      {/* Gradient background — fills entire card */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Content centered on the card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
        {/* Card counter */}
        <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">
          {index + 1} / {total}
        </span>

        {/* Title */}
        <h2 className="text-2xl font-black text-white leading-tight mb-5">
          {card.title}
        </h2>

        {/* Content — 1-2 sentences, large readable text */}
        <p className="text-lg text-white/85 leading-relaxed font-medium max-w-sm">
          {card.content}
        </p>
      </div>

      {/* Bottom: read aloud + tap hint */}
      <div className="relative z-10 flex items-center justify-between px-6 pb-6">
        <ReadAloudButton text={`${card.title}. ${card.content}`} />
        <span className="text-white/30 text-[10px] font-medium">
          tap to continue →
        </span>
      </div>
    </div>
  )
}
