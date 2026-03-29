import type { ReactNode } from 'react'
import XPBar from './XPBar'
import XPPopup from './XPPopup'
import Confetti from './Confetti'
import StreakBanner from './StreakBanner'

interface ExploreLayoutProps {
  children: ReactNode
  hideHeader?: boolean
}

export default function ExploreLayout({ children, hideHeader }: ExploreLayoutProps) {
  return (
    <div className="bg-background">
      {!hideHeader && (
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 px-5 py-2.5">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Explorer</span>
            <div className="flex items-center gap-3">
              <StreakBanner />
              <XPBar />
            </div>
          </div>
        </header>
      )}
      <div className="max-w-md mx-auto w-full">
        {children}
      </div>
      <XPPopup />
      <Confetti />
    </div>
  )
}
