import { useState } from 'react'
import { Search, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      if (isListening) {
        stopListening()
        setValue(transcript)
      }
      onSubmit(topic)
    }
  }

  const toggleVoice = () => {
    if (isListening) {
      stopListening()
      setValue(transcript)
    } else {
      startListening()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        'flex items-center gap-2 rounded-2xl border-2 bg-card px-3 py-2 transition-all',
        isListening ? 'border-destructive shadow-sm' : 'border-border focus-within:border-primary focus-within:shadow-md focus-within:shadow-primary/10',
      )}>
        <Search className="size-5 text-muted-foreground shrink-0" />
        <Input
          type="text"
          value={displayValue}
          onChange={e => setValue(e.target.value)}
          placeholder="What do you want to learn about?"
          className="flex-1 border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          disabled={isLoading || isListening}
          autoFocus
        />
        {isSupported && (
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'ghost'}
            size="icon"
            onClick={toggleVoice}
            className={cn('shrink-0 rounded-xl', isListening && 'animate-pulse-glow')}
          >
            {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </Button>
        )}
        <Button
          type="submit"
          disabled={!displayValue.trim() || isLoading}
          size="lg"
          className="shrink-0 rounded-xl px-5 font-semibold"
        >
          {isLoading ? '...' : 'Go'}
        </Button>
      </div>
    </form>
  )
}
