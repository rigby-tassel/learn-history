import { Routes, Route } from 'react-router-dom'
import TopicPickerPage from './pages/TopicPickerPage'
import SessionPage from './pages/SessionPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TopicPickerPage />} />
      <Route path="/session" element={<SessionPage />} />
    </Routes>
  )
}
