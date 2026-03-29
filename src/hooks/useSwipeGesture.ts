import { useRef, useState, useCallback, useEffect } from 'react'

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  enabled?: boolean
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 80, enabled = true }: SwipeConfig) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)

  const startX = useRef(0)
  const startY = useRef(0)
  const claimed = useRef(false)
  const rejected = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isAnimating) return
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    claimed.current = false
    rejected.current = false
    setIsDragging(true)
    setOffsetX(0)
  }, [enabled, isAnimating])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || isAnimating || rejected.current) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    if (!claimed.current && !rejected.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
        rejected.current = true
        setIsDragging(false)
        return
      }
      if (Math.abs(dx) > 10) {
        claimed.current = true
      } else {
        return
      }
    }

    if (claimed.current) {
      e.preventDefault()
      setOffsetX(dx)
    }
  }, [enabled, isAnimating])

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !claimed.current) {
      setIsDragging(false)
      setOffsetX(0)
      return
    }

    setIsDragging(false)

    if (Math.abs(offsetX) >= threshold) {
      const dir = offsetX > 0 ? 'right' : 'left'
      setExitDir(dir)
      setIsAnimating(true)

      // Animate exit
      const exitX = dir === 'right' ? window.innerWidth : -window.innerWidth
      setOffsetX(exitX)

      setTimeout(() => {
        if (dir === 'right' && onSwipeRight) onSwipeRight()
        if (dir === 'left' && onSwipeLeft) onSwipeLeft()
        setOffsetX(0)
        setExitDir(null)
        setIsAnimating(false)
      }, 250)
    } else {
      // Spring back
      setOffsetX(0)
    }
  }, [enabled, offsetX, threshold, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const dragProgress = Math.min(Math.abs(offsetX) / threshold, 1)
  const dragDirection = offsetX > 0 ? 'right' as const : offsetX < 0 ? 'left' as const : null
  const rotation = isDragging ? (offsetX / window.innerWidth) * 5 : 0

  const style: React.CSSProperties = {
    transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    willChange: isDragging ? 'transform' : undefined,
  }

  return { containerRef, style, isDragging, dragDirection, dragProgress, isAnimating, exitDir }
}
