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
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30 px-5 py-2.5">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-sm font-black text-gradient-brand">Explorer</span>
            <div className="flex items-center gap-2">
              <StreakBanner />
              <XPBar />
            </div>
          </div>
        </header>
      )}
      <div className={hideHeader ? '' : 'max-w-md mx-auto w-full'}>
        {children}
      </div>
      <XPPopup />
      <Confetti />
    </div>
  )
}
