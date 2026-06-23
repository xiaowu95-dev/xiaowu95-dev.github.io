import { Navigate, Route, Routes } from 'react-router-dom'
import AppDetail from '@/pages/AppDetail'
import Home from '@/pages/Home'
import TimeAgeDetail from '@/pages/TimeAgeDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app/kogo" element={<AppDetail />} />
      <Route path="/app/time-age" element={<TimeAgeDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
