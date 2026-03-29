import type { ReactNode } from 'react'
import XPBar from './XPBar'
import XPPopup from './XPPopup'
import Confetti from './Confetti'
import StreakBanner from './StreakBanner'

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <h1 className="text-base font-bold text-foreground">History Explorer</h1>
          </div>
          <div className="flex items-center gap-3">
            <StreakBanner />
            <XPBar />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {children}
      </main>
      <XPPopup />
      <Confetti />
    </div>
  )
}
