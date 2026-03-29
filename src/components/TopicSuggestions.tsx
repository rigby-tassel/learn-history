import { SUGGESTED_TOPICS } from '@/constants'
import { Button } from '@/components/ui/button'

interface TopicSuggestionsProps {
  onSelect: (topic: string) => void
  disabled?: boolean
}

export default function TopicSuggestions({ onSelect, disabled }: TopicSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full">
      {SUGGESTED_TOPICS.map(({ label, emoji }) => (
        <Button
          key={label}
          variant="outline"
          onClick={() => !disabled && onSelect(label)}
          disabled={disabled}
          className="h-auto justify-start gap-2.5 rounded-2xl px-4 py-3.5 text-left text-sm font-medium shadow-sm"
        >
          <span className="text-lg">{emoji}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  )
}
