import type { Achievement } from '@/types'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md'
  isNew?: boolean
}

export default function AchievementBadge({ achievement, size = 'md', isNew }: AchievementBadgeProps) {
  const locked = !achievement.unlockedAt

  return (
    <div className={cn(
      'relative flex flex-col items-center gap-1 rounded-2xl p-3 transition-all',
      locked ? 'opacity-40 grayscale' : 'bg-card shadow-md border border-primary/10',
      size === 'sm' && 'p-2',
    )}>
      {isNew && (
        <span className="absolute -top-1 -right-1 bg-brand-gradient text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          NEW
        </span>
      )}
      <span className={cn('text-2xl', size === 'sm' && 'text-xl', !locked && 'shimmer-effect')}>
        {achievement.icon}
      </span>
      <span className={cn('text-xs font-bold text-foreground text-center leading-tight', size === 'sm' && 'text-[10px]')}>
        {achievement.name}
      </span>
      {size === 'md' && (
        <span className="text-[10px] text-muted-foreground text-center leading-tight">
          {achievement.description}
        </span>
      )}
      {locked && (
        <span className="absolute inset-0 flex items-center justify-center text-lg">🔒</span>
      )}
    </div>
  )
}
