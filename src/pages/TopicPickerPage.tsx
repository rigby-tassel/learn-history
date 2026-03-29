import { useNavigate } from 'react-router-dom'
import ExploreLayout from '@/components/ExploreLayout'
import TopicInput from '@/components/TopicInput'
import TopicSuggestions from '@/components/TopicSuggestions'
import { useExploreSession } from '@/hooks/useExploreSession'

export default function TopicPickerPage() {
  const navigate = useNavigate()
  const { startSession, resetSession } = useExploreSession()

  const handleTopicSelect = (topic: string) => {
    resetSession()
    startSession(topic)
    navigate('/session')
  }

  return (
    <ExploreLayout>
      <div className="flex-1 flex flex-col items-center gap-8 py-4">
        {/* Hero */}
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-3">🌍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            What do you want to explore?
          </h2>
          <p className="text-slate-500 text-sm">
            Pick a topic and discover amazing stories from history
          </p>
        </div>

        {/* Search input */}
        <TopicInput onSubmit={handleTopicSelect} />

        {/* Suggestions */}
        <div className="w-full">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Or pick a topic
          </p>
          <TopicSuggestions onSelect={handleTopicSelect} />
        </div>
      </div>
    </ExploreLayout>
  )
}
