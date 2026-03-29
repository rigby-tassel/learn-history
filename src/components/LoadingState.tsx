export default function LoadingState({ topic }: { topic: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12 animate-fade-in">
      <div className="text-6xl animate-bounce">🌍</div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Exploring {topic}...
        </h2>
        <p className="text-slate-500 text-sm">
          Finding the most fascinating stories and facts
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary"
            style={{
              animation: 'pulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
