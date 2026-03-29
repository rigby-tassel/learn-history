import { useRef, useState, useCallback, useEffect } from 'react'

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  enabled?: boolean
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 70, enabled = true }: SwipeConfig) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const startX = useRef(0)
  const startY = useRef(0)
  const claimed = useRef(false)
  const rejected = useRef(false)
  const isDown = useRef(false)

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    if (!enabled || isAnimating) return
    startX.current = clientX
    startY.current = clientY
    claimed.current = false
    rejected.current = false
    isDown.current = true
    setIsDragging(true)
    setOffsetX(0)
  }, [enabled, isAnimating])

  const moveDrag = useCallback((clientX: number, clientY: number, preventDefault?: () => void) => {
    if (!enabled || isAnimating || rejected.current || !isDown.current) return
    const dx = clientX - startX.current
    const dy = clientY - startY.current

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
      preventDefault?.()
      setOffsetX(dx)
    }
  }, [enabled, isAnimating])

  const endDrag = useCallback(() => {
    isDown.current = false
    if (!enabled || !claimed.current) {
      setIsDragging(false)
      setOffsetX(0)
      return
    }

    setIsDragging(false)

    if (Math.abs(offsetX) >= threshold) {
      const dir = offsetX > 0 ? 'right' : 'left'
      setIsAnimating(true)
      const exitX = dir === 'right' ? window.innerWidth : -window.innerWidth
      setOffsetX(exitX)

      setTimeout(() => {
        if (dir === 'right' && onSwipeRight) onSwipeRight()
        if (dir === 'left' && onSwipeLeft) onSwipeLeft()
        setOffsetX(0)
        setIsAnimating(false)
      }, 250)
    } else {
      setOffsetX(0)
    }
  }, [enabled, offsetX, threshold, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Touch events
    const onTouchStart = (e: TouchEvent) => beginDrag(e.touches[0].clientX, e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => moveDrag(e.touches[0].clientX, e.touches[0].clientY, () => e.preventDefault())
    const onTouchEnd = () => endDrag()

    // Mouse events (for desktop testing)
    const onMouseDown = (e: MouseEvent) => { e.preventDefault(); beginDrag(e.clientX, e.clientY) }
    const onMouseMove = (e: MouseEvent) => { if (isDown.current) moveDrag(e.clientX, e.clientY) }
    const onMouseUp = () => { if (isDown.current) endDrag() }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [beginDrag, moveDrag, endDrag])

  const dragProgress = Math.min(Math.abs(offsetX) / threshold, 1)
  const dragDirection = offsetX > 0 ? 'right' as const : offsetX < 0 ? 'left' as const : null
  const rotation = isDragging ? (offsetX / window.innerWidth) * 5 : 0

  const style: React.CSSProperties = {
    transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    willChange: isDragging ? 'transform' : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return { containerRef, style, isDragging, dragDirection, dragProgress, isAnimating }
}
