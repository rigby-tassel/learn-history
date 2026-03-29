import { useState } from 'react'
import { Search, Mic, MicOff, ArrowUp } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { cn } from '@/lib/utils'

interface TopicInputProps {
  onSubmit: (topic: string) => void
  isLoading?: boolean
}

export default function TopicInput({ onSubmit, isLoading }: TopicInputProps) {
  const [value, setValue] = useState('')
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition()

  const displayValue = isListening ? transcript : value

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const topic = displayValue.trim()
    if (topic && !isLoading) {
      if (isListening) { stopListening(); setValue(transcript) }
      onSubmit(topic)
    }
  }

  const toggleVoice = () => {
    if (isListening) { stopListening(); setValue(transcript) }
    else startListening()
  }

  const hasValue = displayValue.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        'flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 transition-all shadow-sm',
        isListening ? 'border-destructive' : 'border-border focus-within:border-foreground/20 focus-within:shadow-md',
      )}>
        {!hasValue && <Search className="size-4 text-muted-foreground/50 shrink-0" />}
        <input
          type="text"
          value={displayValue}
          onChange={e => setValue(e.target.value)}
          placeholder="Ask anything"
          className="flex-1 text-[15px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
          disabled={isLoading || isListening}
        />
        {isSupported && !hasValue && (
          <button
            type="button"
            onClick={toggleVoice}
            className={cn(
              'shrink-0 p-1.5 rounded-full transition-colors',
              isListening ? 'text-destructive' : 'text-muted-foreground/50',
            )}
          >
            {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>
        )}
        {hasValue && (
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 size-8 bg-foreground text-background rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </form>
  )
}
