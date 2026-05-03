import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

function viteBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={viteBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
