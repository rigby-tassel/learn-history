import { useState } from 'react'
import { Search, Mic, MicOff } from 'lucide-react'
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
        'flex items-center gap-2 bg-white rounded-2xl border-2 px-4 py-3 transition-all shadow-sm',
        isListening ? 'border-red-400 shadow-red-100' : 'border-slate-200 focus-within:border-primary focus-within:shadow-primary/10',
      )}>
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={displayValue}
          onChange={e => setValue(e.target.value)}
          placeholder="What do you want to learn about?"
          className="flex-1 text-base outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
          disabled={isLoading || isListening}
          autoFocus
        />
        {isSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            className={cn(
              'p-2 rounded-xl transition-colors shrink-0',
              isListening
                ? 'bg-red-100 text-red-600 animate-pulse-glow'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}
        <button
          type="submit"
          disabled={!displayValue.trim() || isLoading}
          className="bg-primary text-white font-semibold px-5 py-2 rounded-xl disabled:opacity-40 hover:bg-primary-dark transition-colors shrink-0"
        >
          {isLoading ? 'Loading...' : 'Go'}
        </button>
      </div>
    </form>
  )
}
