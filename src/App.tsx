import { Navigate, Route, Routes } from 'react-router-dom'
import AppDetail from '@/pages/AppDetail'
import Home from '@/pages/Home'
import Meiqing from '@/pages/Meiqing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app/kogo" element={<AppDetail />} />
      <Route path="/meiqing" element={<Meiqing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
