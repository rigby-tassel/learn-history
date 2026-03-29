import { useState, useCallback, useRef } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text: string) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    utteranceRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { isSpeaking, isSupported, speak, stop }
}
