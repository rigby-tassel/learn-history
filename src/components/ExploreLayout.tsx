import type { ReactNode } from 'react'

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h1 className="text-lg font-bold text-slate-900">History Explorer</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
