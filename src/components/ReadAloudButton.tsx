import { Volume2, VolumeOff } from 'lucide-react'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { cn } from '@/lib/utils'

interface ReadAloudButtonProps {
  text: string
  className?: string
}

export default function ReadAloudButton({ text, className }: ReadAloudButtonProps) {
  const { isSpeaking, isSupported, speak, stop } = useSpeechSynthesis()

  if (!isSupported) return null

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
        isSpeaking
          ? 'bg-primary/10 text-primary'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
        className,
      )}
    >
      {isSpeaking ? <VolumeOff className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      {isSpeaking ? 'Stop' : 'Read aloud'}
    </button>
  )
}
