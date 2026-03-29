import { SUGGESTED_TOPICS } from '@/constants'

interface TopicSuggestionsProps {
  onSelect: (topic: string) => void
  disabled?: boolean
}

export default function TopicSuggestions({ onSelect, disabled }: TopicSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {SUGGESTED_TOPICS.map(({ label, emoji }) => (
        <button
          key={label}
          onClick={() => !disabled && onSelect(label)}
          disabled={disabled}
          className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]"
        >
          <span className="text-xl">{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
