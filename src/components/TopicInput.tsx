import { useState } from 'react'
import { Search, Mic, MicOff, ArrowUp } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { cn } from '@/lib/utils'

interface TopicInputProps {
  onSubmit: (topic: string) => void
  isLoading?: boolean
  variant?: 'light' | 'dark'
}

export default function TopicInput({ onSubmit, isLoading, variant = 'dark' }: TopicInputProps) {
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
  const isLight = variant === 'light'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        'flex items-center gap-2 rounded-2xl px-4 py-3 transition-all',
        isLight
          ? 'bg-white/90 backdrop-blur-sm shadow-lg border-0'
          : 'border bg-card shadow-sm',
        isListening && 'ring-2 ring-red-400',
        !isListening && !isLight && 'focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-md',
        !isListening && isLight && 'focus-within:shadow-xl',
      )}>
        {!hasValue && <Search className={cn('size-4 shrink-0', isLight ? 'text-gray-400' : 'text-muted-foreground/50')} />}
        <input
          type="text"
          value={displayValue}
          onChange={e => setValue(e.target.value)}
          placeholder="Ask anything..."
          className={cn(
            'flex-1 text-base bg-transparent outline-none',
            isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-foreground placeholder:text-muted-foreground/50',
          )}
          disabled={isLoading || isListening}
        />
        {isSupported && !hasValue && (
          <button
            type="button"
            onClick={toggleVoice}
            className={cn(
              'shrink-0 p-1.5 rounded-full transition-colors',
              isListening ? 'text-red-500' : isLight ? 'text-gray-400' : 'text-muted-foreground/50',
            )}
          >
            {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>
        )}
        {hasValue && (
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 size-9 bg-brand-gradient text-white rounded-xl flex items-center justify-center
                       disabled:opacity-40 transition-all active:scale-95 shadow-md"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </form>
  )
}
